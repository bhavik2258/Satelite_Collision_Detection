import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Earth3D from "@/components/Earth3D";
import ControlPanel from "@/components/shared/ControlPanel";
import ParameterDisplay from "@/components/shared/ParameterDisplay";
import ActionButtons from "@/components/shared/ActionButtons";
import * as THREE from "three";

const Satellite = ({ altitude, speed, isRunning }: { altitude: number; speed: number; isRunning: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0);

  useFrame(() => {
    if (meshRef.current && isRunning) {
      angleRef.current += 0.01 * speed;
      const radius = 2 + altitude / 300;
      meshRef.current.position.x = Math.cos(angleRef.current) * radius;
      meshRef.current.position.z = Math.sin(angleRef.current) * radius;
    }
  });

  const radius = 2 + altitude / 300;
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  return (
    <>
      <Line points={points} color="#00FFFF" lineWidth={2} opacity={0.7} transparent />
      <mesh ref={meshRef} position={[radius, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
      </mesh>
    </>
  );
};

const OrbitalMechanics = () => {
  const [altitude, setAltitude] = useState(500);
  const [speed, setSpeed] = useState(1);
  const [trailLength, setTrailLength] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  // Mock calculations - TODO: Connect Backend API here for real orbital mechanics calculations
  const orbitalVelocity = (7.6 * (500 / altitude)).toFixed(2);
  const orbitalPeriod = (94.6 * Math.sqrt(Math.pow(altitude / 500, 3))).toFixed(1);
  const distanceFromEarth = (6378 + altitude).toFixed(0);

  const handleReset = () => {
    setIsRunning(false);
    setAltitude(500);
    setSpeed(1);
    setTrailLength(100);
  };

  const handleDownload = () => {
    // TODO: Connect Backend API here
    console.log("Downloading orbital mechanics data...");
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
        <ControlPanel title="Orbital Parameters" accentColor="cyan">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Orbital Altitude (km)</label>
              <Slider
                value={[altitude]}
                onValueChange={(v) => setAltitude(v[0])}
                min={200}
                max={2000}
                step={10}
                className="w-full"
              />
              <span className="text-sm text-primary">{altitude} km</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Animation Speed</label>
              <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseFloat(v))}>
                <SelectTrigger className="glass-panel border-neon-cyan/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-neon-cyan/30 bg-space-dark">
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Trail Length (points)</label>
              <Input
                type="number"
                value={trailLength}
                onChange={(e) => setTrailLength(parseInt(e.target.value))}
                className="glass-panel border-neon-cyan/30"
              />
            </div>

            <ActionButtons
              isRunning={isRunning}
              onPlayPause={() => setIsRunning(!isRunning)}
              onReset={handleReset}
              onDownload={handleDownload}
              variant="cyan"
            />
          </div>
        </ControlPanel>

        <ParameterDisplay
          title="Calculated Values"
          accentColor="lime"
          parameters={[
            { label: "Orbital Velocity", value: orbitalVelocity, unit: "km/s", highlight: true },
            { label: "Orbital Period", value: orbitalPeriod, unit: "min" },
            { label: "Distance from Earth", value: distanceFromEarth, unit: "km" },
            { label: "Current Speed", value: (parseFloat(orbitalVelocity) * speed).toFixed(2), unit: "km/s" },
          ]}
        />
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 min-h-[400px] sm:min-h-[500px] rounded-xl overflow-hidden border border-neon-cyan/20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-primary/5 to-secondary/5" />
        <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth3D rotationSpeed={0.001} />
          <Satellite altitude={altitude} speed={speed} isRunning={isRunning} />
          <OrbitControls enablePan={false} minDistance={5} maxDistance={20} />
        </Canvas>
      </div>
    </motion.div>
  );
};

export default OrbitalMechanics;

