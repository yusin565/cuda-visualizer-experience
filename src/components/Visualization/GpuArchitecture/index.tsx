
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Grid from './Grid';
import MemoryHierarchy from './MemoryHierarchy';
import InfoOverlay from './InfoOverlay';

interface GpuArchitectureProps {
  blockSize: number;
  showDetails: boolean;
}

const GpuArchitecture: React.FC<GpuArchitectureProps> = ({ blockSize, showDetails }) => {
  // Calculate how many blocks and threads should be active for animation
  const [activeLevel, setActiveLevel] = useState<string>('registers');
  const [blocksActive, setBlocksActive] = useState(1);
  const [threadsActive, setThreadsActive] = useState(1);
  
  // Animation cycle
  useEffect(() => {
    // Memory hierarchy animation
    const memoryInterval = setInterval(() => {
      setActiveLevel(prev => {
        switch(prev) {
          case 'registers': return 'shared';
          case 'shared': return 'l1';
          case 'l1': return 'global';
          case 'global': return 'host';
          case 'host': return 'registers';
          default: return 'registers';
        }
      });
    }, 3000);
    
    // Thread/block activation animation
    const maxBlocks = 9; // 3x3 grid
    const threadInterval = setInterval(() => {
      setThreadsActive(prev => {
        const newValue = prev + blockSize / 8;
        
        // Calculate how many blocks would be fully filled
        const blocksNeeded = Math.ceil(newValue / blockSize);
        setBlocksActive(Math.min(blocksNeeded, maxBlocks));
        
        // Wrap around if we reach the max
        if (newValue >= maxBlocks * blockSize) {
          return 1;
        }
        
        return newValue;
      });
    }, 1000);
    
    return () => {
      clearInterval(memoryInterval);
      clearInterval(threadInterval);
    };
  }, [blockSize]);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 3, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Grid and thread blocks */}
        <Grid 
          position={[-4, 0, 0]} 
          blockSize={blockSize} 
          blocksActive={blocksActive} 
          threadsActive={threadsActive}
          showDetails={showDetails}
        />
        
        {/* Memory hierarchy */}
        <MemoryHierarchy 
          position={[4, 0, 0]} 
          activeLevel={activeLevel} 
          showDetails={showDetails}
        />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      {/* Overlay information */}
      <InfoOverlay
        blocksActive={blocksActive}
        threadsActive={threadsActive}
        blockSize={blockSize}
        activeLevel={activeLevel}
        showDetails={showDetails}
      />
    </div>
  );
};

export default GpuArchitecture;
