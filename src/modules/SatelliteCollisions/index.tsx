import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Earth3D from "@/components/Earth3D";
import ControlPanel from "@/components/shared/ControlPanel";
import ParameterDisplay from "@/components/shared/ParameterDisplay";
import ActionButtons from "@/components/shared/ActionButtons";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as THREE from "three";

const CollisionSatellite = ({ 
  radius, 
  color, 
  isRunning,
  speed 
}: { 
  radius: number; 
  color: string; 
  isRunning: boolean;
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0);

  useFrame(() => {
    if (meshRef.current && isRunning) {
      angleRef.current += 0.01 * speed;
      meshRef.current.position.x = Math.cos(angleRef.current) * radius;
      meshRef.current.position.z = Math.sin(angleRef.current) * radius;
      meshRef.current.position.y = Math.sin(angleRef.current * 1.5) * 0.3;
    }
  });

  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius, 
      Math.sin(angle * 1.5) * 0.3,
      Math.sin(angle) * radius
    ));
  }

  return (
    <>
      <Line points={points} color={color} lineWidth={2} opacity={0.7} transparent />
      <mesh ref={meshRef} position={[radius, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </>
  );
};

const CollisionPoint = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.3);
    }
  });

  return (
    <mesh ref={meshRef} position={[3.5, 0.2, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} transparent opacity={0.8} />
    </mesh>
  );
};

const SatelliteCollisions = () => {
  const [satellite1, setSatellite1] = useState("ISS");
  const [satellite2, setSatellite2] = useState("Hubble");
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState(12);
  const [threshold, setThreshold] = useState(10);
  const [samplePoints, setSamplePoints] = useState(1200);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // TODO: Connect Backend API here
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      setIsRunning(true);
    }, 2000);
  };

  const handleReset = () => {
    setShowResults(false);
    setIsAnalyzing(false);
    setIsRunning(false);
  };

  const handleDownload = () => {
    // TODO: Connect Backend API here
    console.log("Downloading collision analysis data...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6"
    >
      {/* Control Panel */}
      <div className="w-full lg:w-96 space-y-6">
        <ControlPanel title="Collision Analysis" accentColor="lime">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-muted-foreground">Select satellites to analyze</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Satellite 1</label>
              <Select value={satellite1} onValueChange={setSatellite1}>
                <SelectTrigger className="glass-panel border-neon-cyan/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-neon-cyan/30 bg-space-dark">
                  <SelectItem value="ISS">ISS (International Space Station)</SelectItem>
                  <SelectItem value="Hubble">Hubble Space Telescope</SelectItem>
                  <SelectItem value="Tiangong">Tiangong Space Station</SelectItem>
                  <SelectItem value="GPS-IIF">GPS IIF-12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Satellite 2</label>
              <Select value={satellite2} onValueChange={setSatellite2}>
                <SelectTrigger className="glass-panel border-neon-cyan/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-neon-cyan/30 bg-space-dark">
                  <SelectItem value="Hubble">Hubble Space Telescope</SelectItem>
                  <SelectItem value="ISS">ISS (International Space Station)</SelectItem>
                  <SelectItem value="Starlink-1234">Starlink-1234</SelectItem>
                  <SelectItem value="NOAA-20">NOAA-20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-xs text-primary">✅ 200 satellites loaded (Mock Data)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Start Time (UTC)</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass-panel border-neon-cyan/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Duration (hours)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="glass-panel border-neon-cyan/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Threshold (km)</label>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="glass-panel border-neon-cyan/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sample Points</label>
              <Input
                type="number"
                value={samplePoints}
                onChange={(e) => setSamplePoints(parseInt(e.target.value))}
                className="glass-panel border-neon-cyan/30"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze Collision Risk"}
            </Button>

            <ActionButtons
              isRunning={isRunning}
              onPlayPause={() => setIsRunning(!isRunning)}
              onReset={handleReset}
              onDownload={handleDownload}
              variant="lime"
            />
          </div>
        </ControlPanel>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="glass-panel border-orange-500/30 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-foreground">Analysis Results</h3>
              </div>
              <ParameterDisplay
                title="Collision Analysis"
                accentColor="lime"
                parameters={[
                  { label: "Minimum Distance", value: "8.4", unit: "km", highlight: true },
                  { label: "Time of Closest Approach", value: "2025-11-07 14:32 UTC" },
                  { label: "Relative Velocity", value: "12.3", unit: "km/s" },
                  { label: "Risk Level", value: "⚠️ MODERATE", highlight: true },
                ]}
              />
            </Card>
          </motion.div>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 min-h-[400px] sm:min-h-[500px] rounded-xl overflow-hidden border border-green-500/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-green-500/5 to-orange-500/5" />
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-space-dark/80 backdrop-blur-sm z-10">
            <LoadingSpinner 
              message="Analyzing collision trajectories..." 
              accentColor="lime"
            />
          </div>
        )}
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth3D rotationSpeed={0.001} />
          <CollisionSatellite radius={3.5} color="#ef4444" isRunning={showResults && isRunning} speed={1} />
          <CollisionSatellite radius={4.2} color="#00FF85" isRunning={showResults && isRunning} speed={1.3} />
          
          {/* TODO: Connect Backend API here - Load real collision data */}
          {showResults && <CollisionPoint />}
          <OrbitControls enablePan={false} minDistance={8} maxDistance={25} />
        </Canvas>
      </div>
    </motion.div>
  );
};

export default SatelliteCollisions;

