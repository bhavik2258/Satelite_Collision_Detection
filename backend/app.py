import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
import requests
from simulations import satellite_collision_p1

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "frontend"))
# Save simulation results under backend/static/results so they are served via /static/
RESULTS_DIR = os.path.join(BASE_DIR, "static", "results")

os.makedirs(RESULTS_DIR, exist_ok=True)

# Set static_folder to 'static' so Flask serves /static/ from backend/static/
app = Flask(__name__, static_folder="static", static_url_path="/static")

@app.route("/api/tle", methods=["GET"])
def get_tle_file():
    """Serve the default TLE file located in the backend folder as plain text."""
    tle_path = os.path.join(BASE_DIR, "tle.txt")
    if not os.path.exists(tle_path):
        return ("TLE file not found.", 404)
    # Serve as a file to avoid CORS/content-type issues
    return send_from_directory(BASE_DIR, "tle.txt", mimetype="text/plain")

@app.route("/api/tle/live", methods=["GET"])
def get_live_tle():
    """Proxy live TLEs from CelesTrak.
    Query params:
      - group: celestrak GROUP (e.g., active, stations, visual, weather, starlink)
      - format: only 'tle' is supported here
      - n: optional limit of lines to return (server still fetches full file)
    """
    group = request.args.get("group", "active")
    fmt = request.args.get("format", "tle")
    if fmt.lower() != "tle":
        return ("Unsupported format", 400)

    # Use exact CelesTrak URL format: FORMAT=TLE (uppercase) as per their API
    url = f"https://celestrak.org/NORAD/elements/gp.php?GROUP={group}&FORMAT=TLE"
    try:
        resp = requests.get(url, timeout=15, headers={"User-Agent": "SatelliteCollision/1.0"})
        resp.raise_for_status()
        text = resp.text
        # Ensure we got valid TLE data
        if not text or len(text.strip()) < 100:
            return jsonify({"error": "Empty or invalid response from CelesTrak"}), 502
        # Optional trim to first N 3-line sets to keep payload small if requested
        n_param = request.args.get("n")
        if n_param:
            try:
                n_sets = int(n_param)
                lines = [l for l in text.splitlines() if l.strip()]
                out_lines = []
                i = 0
                sets = 0
                while i < len(lines) and sets < n_sets:
                    if not lines[i].startswith(("1 ", "2 ")) and i + 2 < len(lines) and lines[i+1].startswith("1 ") and lines[i+2].startswith("2 "):
                        out_lines.extend([lines[i], lines[i+1], lines[i+2]])
                        i += 3
                        sets += 1
                    elif lines[i].startswith("1 ") and i + 1 < len(lines) and lines[i+1].startswith("2 "):
                        # No name line present; still include pair
                        out_lines.extend([lines[i], lines[i+1]])
                        i += 2
                        sets += 1
                    else:
                        i += 1
                text = "\n".join(out_lines)
            except Exception:
                pass
        return (text, 200, {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store"})
    except requests.RequestException as e:
        return jsonify({"error": "Failed to fetch from CelesTrak", "details": str(e)}), 502

@app.route("/run-simulation", methods=["POST"])
def run_simulation_route():
    data = request.get_json() or {}
    sim_type = data.get("sim_type", "orbit")

    filename = f"{uuid.uuid4().hex}.gif"
    output_filepath = os.path.join(RESULTS_DIR, filename)

    try:
        satellite_collision_p1.run_simulation(
            output_filepath, duration=6000, save_format="gif"
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    public_url = f"/static/results/{filename}"
    return jsonify({"status": "success", "file": public_url})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve index.html for / and any unknown path (React/JS-style routing safe)."""
    full_path = os.path.join(FRONTEND_DIR, path)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(FRONTEND_DIR, path)
    else:
        return send_from_directory(FRONTEND_DIR, "index.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
