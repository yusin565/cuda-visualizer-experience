
import React from 'react';
import { Text } from '@react-three/drei';
import Thread from './Thread';

interface ThreadBlockProps {
  position: [number, number, number];
  blockSize: number;
  activeThreads: number;
  showDetails: boolean;
}

const ThreadBlock: React.FC<ThreadBlockProps> = ({ 
  position, 
  blockSize, 
  activeThreads,
  showDetails 
}) => {
  const size = Math.ceil(Math.sqrt(blockSize));
  
  return (
    <group position={position}>
      {/* Block container */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size * 0.4 + 0.1, 0.05, size * 0.4 + 0.1]} />
        <meshStandardMaterial 
          color="#555555" 
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Thread grid */}
      {Array(blockSize).fill(0).map((_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const x = (col - size / 2 + 0.5) * 0.4;
        const z = (row - size / 2 + 0.5) * 0.4;
        return (
          <Thread 
            key={i} 
            position={[x, 0.2, z]} 
            active={i < activeThreads}
            index={i}
          />
        );
      })}
      
      {/* Block label */}
      {showDetails && (
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Block {position[0]} x {position[2]}
        </Text>
      )}
    </group>
  );
};

export default ThreadBlock;
