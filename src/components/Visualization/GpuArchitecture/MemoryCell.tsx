
import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface MemoryCellProps {
  position: [number, number, number];
  color: string;
  active: boolean;
  name: string;
  size: string;
}

const MemoryCell: React.FC<MemoryCellProps> = ({ 
  position, 
  color, 
  active, 
  name, 
  size 
}) => {
  const [intensity, setIntensity] = useState(0);
  
  useFrame(() => {
    if (active) {
      setIntensity((prev) => {
        return 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
      });
    } else {
      setIntensity(0);
    }
  });

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.8, 0.4, 0.8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? intensity : 0} 
          metalness={0.5} 
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {size}
      </Text>
    </group>
  );
};

export default MemoryCell;
