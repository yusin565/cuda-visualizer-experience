
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MemoryAccessVisualization from './MemoryAccessVisualization';
import InfoOverlay from './InfoOverlay';

interface MemoryOptimizationProps {
  blockSize: number;
  memoryAccess: string;
  showDetails: boolean;
}

const MemoryOptimization: React.FC<MemoryOptimizationProps> = ({ 
  blockSize, 
  memoryAccess, 
  showDetails 
}) => {
  const threadsToShow = Math.min(Math.max(4, blockSize / 32), 8);
  
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <MemoryAccessVisualization 
          position={[0, 0, 0]} 
          memoryType={memoryAccess === 'shared' ? 'shared' : 'global'} 
          accessPattern={memoryAccess} 
          threadsActive={threadsToShow}
          showDetails={showDetails}
        />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      <InfoOverlay 
        accessPattern={memoryAccess} 
        threadsActive={threadsToShow} 
        memoryType={memoryAccess === 'shared' ? 'shared' : 'global'} 
        showDetails={showDetails}
      />
    </div>
  );
};

export default MemoryOptimization;
