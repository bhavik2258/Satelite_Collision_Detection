import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import Earth3D from "@/components/Earth3D";
import ControlPanel from "@/components/shared/ControlPanel";
import ParameterDisplay from "@/components/shared/ParameterDisplay";
import ActionButtons from "@/components/shared/ActionButtons";
import * as THREE from "three";

const SatelliteOrbit = ({ 
  radius, 
  color, 
  name, 
  speed, 
  isRunning 
}: { 
  radius: number; 
  color: string; 
  name: string; 
  speed: number;
  isRunning: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame(() => {
    if (meshRef.current && isRunning) {
      angleRef.current += 0.005 * speed;
      meshRef.current.position.x = Math.cos(angleRef.current) * radius;
      meshRef.current.position.z = Math.sin(angleRef.current) * radius;
      meshRef.current.position.y = Math.sin(angleRef.current * 2) * 0.5;
    }
  });

  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius, 
      Math.sin(angle * 2) * 0.5, 
      Math.sin(angle) * radius
    ));
  }

  return (
    <>
      <Line points={points} color={color} lineWidth={1.5} opacity={0.6} transparent />
      <mesh ref={meshRef} position={[radius, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </>
  );
};

const satellites = [
  { name: "SAT-1", radius: 3, color: "#9D4EDD" },
  { name: "SAT-2", radius: 3.5, color: "#9D4EDD" },
  { name: "SAT-3", radius: 4, color: "#9D4EDD" },
  { name: "SAT-4", radius: 4.5, color: "#9D4EDD" },
  { name: "SAT-5", radius: 5, color: "#9D4EDD" },
  { name: "SAT-6", radius: 5.5, color: "#9D4EDD" },
];

// TODO: Connect Backend API here - Load real satellite TLE data

const RealSatelliteTracking = () => {
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSatellites, setSelectedSatellites] = useState(satellites.slice(0, 4));

  const handleReset = () => {
    setIsRunning(false);
    setSpeed(1);
  };

  const handleDownload = () => {
    // TODO: Connect Backend API here
    console.log("Downloading satellite tracking data...");
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
      <div className="w-full lg:w-80 space-y-6">
        <ControlPanel title="Tracking Controls" accentColor="purple">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Animation Speed (x)</label>
              <Slider
                value={[speed]}
                onValueChange={(v) => setSpeed(v[0])}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
              <span className="text-sm text-primary mt-1 block">{speed}x</span>
            </div>

            <ActionButtons
              isRunning={isRunning}
              onPlayPause={() => setIsRunning(!isRunning)}
              onReset={handleReset}
              onDownload={handleDownload}
              playLabel="Start Animation"
              pauseLabel="Stop Animation"
              variant="purple"
            />
          </div>
        </ControlPanel>

        <ParameterDisplay
          title="Statistics"
          accentColor="lime"
          parameters={[
            { label: "Active Satellites", value: selectedSatellites.length, highlight: true },
            { label: "Total Orbits", value: selectedSatellites.length },
            { label: "Simulation Speed", value: `${speed}x` },
            { label: "Status", value: isRunning ? "Running" : "Paused", highlight: true },
          ]}
        />

        <div className="glass-panel border-neon-purple/30 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Active Satellites</h4>
          <div className="space-y-2">
            {selectedSatellites.map((sat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sat.color }} />
                <span className="text-xs text-muted-foreground">{sat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 min-h-[400px] sm:min-h-[500px] rounded-xl overflow-hidden border border-neon-purple/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-secondary/5 to-primary/5" />
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth3D rotationSpeed={0.001} />
          {selectedSatellites.map((sat, idx) => (
            <SatelliteOrbit
              key={idx}
              radius={sat.radius}
              color={sat.color}
              name={sat.name}
              speed={speed}
              isRunning={isRunning}
            />
          ))}
          <OrbitControls enablePan={false} minDistance={8} maxDistance={25} />
        </Canvas>
      </div>
    </motion.div>
  );
};

export default RealSatelliteTracking;

