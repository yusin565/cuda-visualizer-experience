
import React from 'react';
import { Text } from '@react-three/drei';
import ThreadBlock from './ThreadBlock';

interface GridProps {
  position: [number, number, number];
  blockSize: number;
  blocksActive: number;
  threadsActive: number;
  showDetails: boolean;
}

const Grid: React.FC<GridProps> = ({ 
  position, 
  blockSize, 
  blocksActive, 
  threadsActive, 
  showDetails 
}) => {
  const blocksPerRow = 3;
  const blocksPerCol = 3;
  
  return (
    <group position={position}>
      {/* Grid container */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[blocksPerRow * 2.5, 0.01, blocksPerCol * 2.5]} />
        <meshStandardMaterial 
          color="#333333" 
          transparent={true}
          opacity={0.2}
        />
      </mesh>
      
      {/* Block grid */}
      {Array(blocksPerRow * blocksPerCol).fill(0).map((_, i) => {
        const row = Math.floor(i / blocksPerRow);
        const col = i % blocksPerRow;
        const x = (col - blocksPerRow / 2 + 0.5) * 2.5;
        const z = (row - blocksPerCol / 2 + 0.5) * 2.5;
        
        // Calculate how many threads should be active in this block
        const blockIndex = row * blocksPerRow + col;
        const isActive = blockIndex < blocksActive;
        const activeThreadCount = isActive ? 
          (blockIndex === blocksActive - 1 ? threadsActive % blockSize || blockSize : blockSize) : 0;
        
        return (
          <ThreadBlock 
            key={i} 
            position={[x, 0, z]} 
            blockSize={blockSize}
            activeThreads={activeThreadCount}
            showDetails={showDetails}
          />
        );
      })}
      
      {/* Grid label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        CUDA Grid
      </Text>
      
      {showDetails && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.3}
          color="#76B900"
          anchorX="center"
          anchorY="middle"
        >
          {blocksActive} Blocks Active • {threadsActive} Threads Total
        </Text>
      )}
    </group>
  );
};

export default Grid;
