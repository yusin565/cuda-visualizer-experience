
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface MemoryCellProps {
  position: [number, number, number]; 
  color: string;
  active: boolean;
  value?: number;
}

const MemoryCell: React.FC<MemoryCellProps> = ({ 
  position, 
  color,
  active,
  value 
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
        <boxGeometry args={[0.9, 0.2, 0.9]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? intensity : 0} 
          metalness={0.5} 
          roughness={0.2}
        />
      </mesh>
      {value !== undefined && (
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      )}
    </group>
  );
};

export default MemoryCell;
