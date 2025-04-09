
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AccessLine } from './AccessLine';

interface ThreadProps { 
  position: [number, number, number]; 
  color: string;
  active: boolean;
  index: number;
  accessingIndices: number[];
}

const Thread: React.FC<ThreadProps> = ({ 
  position, 
  color,
  active,
  index,
  accessingIndices
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (active) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? 0.5 : 0} 
          metalness={0.5} 
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, 0, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {index}
      </Text>
      
      {active && accessingIndices.map((accessIdx, i) => (
        <AccessLine 
          key={i} 
          startPos={[0, 0, 0]} 
          midPos={[0, -2.5, 0]} 
          endPos={[accessIdx - position[0], -2.5, 0]} 
          color={color} 
        />
      ))}
    </group>
  );
};

export default Thread;
