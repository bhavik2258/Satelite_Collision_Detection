import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

interface Earth3DProps {
  showStars?: boolean;
  rotationSpeed?: number;
}

const Earth3D = ({ showStars = true, rotationSpeed = 0.001 }: Earth3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      {/* Earth Sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#1e3a8a" 
          emissive="#3b82f6" 
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Atmospheric Glow */}
      <Sphere args={[2.05, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#87ceeb" 
          emissive="#87ceeb"
          emissiveIntensity={0.1}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Stars Background */}
      {showStars && (
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
      )}
    </>
  );
};

export default Earth3D;

