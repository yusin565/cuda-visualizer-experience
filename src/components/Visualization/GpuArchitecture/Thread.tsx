
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreadProps {
  position: [number, number, number];
  active: boolean;
  index: number;
  color?: string;
}

const Thread: React.FC<ThreadProps> = ({ 
  position, 
  active, 
  index, 
  color = '#76B900' 
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (active) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial 
        color={color} 
        emissive={active ? color : undefined} 
        emissiveIntensity={0.5} 
        metalness={0.5} 
        roughness={0.2}
      />
    </mesh>
  );
};

export default Thread;
