
import React from 'react';
import { Text } from '@react-three/drei';

interface EfficiencyMeterProps {
  position: [number, number, number];
  efficiency: number;
}

const EfficiencyMeter: React.FC<EfficiencyMeterProps> = ({ position, efficiency }) => {
  return (
    <group position={position}>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Efficiency
      </Text>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, -1.5 + (efficiency / 100) * 3, 0]}>
        <boxGeometry args={[0.8, (efficiency / 100) * 3, 0.3]} />
        <meshStandardMaterial 
          color={efficiency > 70 ? '#76B900' : (efficiency > 40 ? '#F0AD4E' : '#D9534F')} 
        />
      </mesh>
      <Text
        position={[0, -1.7, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {efficiency}%
      </Text>
    </group>
  );
};

export default EfficiencyMeter;
