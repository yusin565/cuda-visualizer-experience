
import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import MemoryCell from './MemoryCell';
import Thread from './Thread';
import EfficiencyMeter from './EfficiencyMeter';
import TransactionCounter from './TransactionCounter';

interface MemoryAccessProps {
  position: [number, number, number];
  memoryType: 'global' | 'shared';
  accessPattern: string;
  threadsActive: number;
  showDetails: boolean;
}

const MemoryAccessVisualization: React.FC<MemoryAccessProps> = ({ 
  position, 
  memoryType, 
  accessPattern, 
  threadsActive, 
  showDetails 
}) => {
  const numMemoryCells = 16;
  const [activeMemoryCells, setActiveMemoryCells] = useState<number[]>([]);
  const [threadAccessPatterns, setThreadAccessPatterns] = useState<number[][]>([]);
  const [accessEfficiency, setAccessEfficiency] = useState(0);
  
  useEffect(() => {
    const patterns: number[][] = [];
    let activeCells: number[] = [];
    
    if (accessPattern === 'coalesced') {
      for (let i = 0; i < threadsActive; i++) {
        patterns.push([i]);
        activeCells.push(i);
      }
      setAccessEfficiency(100);
    } else if (accessPattern === 'strided') {
      const stride = 2;
      for (let i = 0; i < threadsActive; i++) {
        const idx = i * stride % numMemoryCells;
        patterns.push([idx]);
        activeCells.push(idx);
      }
      setAccessEfficiency(50);
    } else if (accessPattern === 'random') {
      for (let i = 0; i < threadsActive; i++) {
        const randomIdx = Math.floor(Math.random() * numMemoryCells);
        patterns.push([randomIdx]);
        activeCells.push(randomIdx);
      }
      setAccessEfficiency(25);
    } else if (accessPattern === 'shared') {
      const sharedIndices = [];
      for (let i = 0; i < Math.min(threadsActive, numMemoryCells); i++) {
        sharedIndices.push(i);
      }
      for (let i = 0; i < threadsActive; i++) {
        patterns.push(sharedIndices);
      }
      activeCells = sharedIndices;
      setAccessEfficiency(90);
    }
    
    setThreadAccessPatterns(patterns);
    setActiveMemoryCells([...new Set(activeCells)]);
  }, [accessPattern, threadsActive, numMemoryCells]);
  
  return (
    <group position={position}>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {memoryType === 'global' ? 'Global Memory Access' : 'Shared Memory Access'}
      </Text>
      
      {Array(numMemoryCells).fill(0).map((_, i) => (
        <MemoryCell 
          key={i} 
          position={[i - numMemoryCells / 2 + 0.5, -3, 0]} 
          color={memoryType === 'global' ? '#0077C5' : '#F0AD4E'} 
          active={activeMemoryCells.includes(i)}
          value={showDetails ? i : undefined}
        />
      ))}
      
      {Array(threadsActive).fill(0).map((_, i) => {
        if (i < 8) {
          return (
            <Thread 
              key={i} 
              position={[i - Math.min(threadsActive, 8) / 2 + 0.5, 0, 0]} 
              color="#76B900" 
              active={true}
              index={i}
              accessingIndices={threadAccessPatterns[i] || []}
            />
          );
        }
        return null;
      })}
      
      {showDetails && (
        <>
          <EfficiencyMeter 
            position={[numMemoryCells / 2 + 2, -1.5, 0]} 
            efficiency={accessEfficiency} 
          />
          
          <TransactionCounter 
            position={[-numMemoryCells / 2 - 2, -1.5, 0]} 
            accessPattern={accessPattern} 
            threadsActive={threadsActive} 
            numMemoryCells={numMemoryCells} 
          />
        </>
      )}
    </group>
  );
};

export default MemoryAccessVisualization;
