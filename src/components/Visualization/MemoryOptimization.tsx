
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface MemoryOptimizationProps {
  blockSize: number;
  memoryAccess: string;
  showDetails: boolean;
}

// Memory cell representation
const MemoryCell = ({ position, color, active, value }: { 
  position: [number, number, number], 
  color: string,
  active: boolean,
  value?: number
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

// Thread representation
const Thread = ({ position, color, active, index, accessingIndices }: { 
  position: [number, number, number], 
  color: string,
  active: boolean,
  index: number,
  accessingIndices: number[]
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
      
      {active && accessingIndices.map((accessIdx, i) => {
        const vertices = new Float32Array([
          0, 0, 0,
          0, -2.5, 0,
          accessIdx - position[0], -2.5, 0
        ]);
        
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={3}
                array={vertices}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} linewidth={2} />
          </line>
        );
      })}
    </group>
  );
};

// Memory access visualization
const MemoryAccess = ({ position, memoryType, accessPattern, threadsActive, showDetails }: {
  position: [number, number, number],
  memoryType: 'global' | 'shared',
  accessPattern: string,
  threadsActive: number,
  showDetails: boolean
}) => {
  const numMemoryCells = 16;
  const [activeMemoryCells, setActiveMemoryCells] = useState<number[]>([]);
  const [threadAccessPatterns, setThreadAccessPatterns] = useState<number[][]>([]);
  const [accessEfficiency, setAccessEfficiency] = useState(0);
  
  // Generate memory access patterns based on the selected pattern
  useEffect(() => {
    const patterns: number[][] = [];
    let activeCells: number[] = [];
    
    if (accessPattern === 'coalesced') {
      // Each thread accesses consecutive memory locations
      for (let i = 0; i < threadsActive; i++) {
        patterns.push([i]);
        activeCells.push(i);
      }
      setAccessEfficiency(100);
    } else if (accessPattern === 'strided') {
      // Each thread accesses memory with a stride
      const stride = 2;
      for (let i = 0; i < threadsActive; i++) {
        const idx = i * stride % numMemoryCells;
        patterns.push([idx]);
        activeCells.push(idx);
      }
      setAccessEfficiency(50);
    } else if (accessPattern === 'random') {
      // Each thread accesses random memory locations
      for (let i = 0; i < threadsActive; i++) {
        const randomIdx = Math.floor(Math.random() * numMemoryCells);
        patterns.push([randomIdx]);
        activeCells.push(randomIdx);
      }
      setAccessEfficiency(25);
    } else if (accessPattern === 'shared') {
      // Using shared memory, threads cooperatively load into shared then access
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
      
      {/* Memory cells */}
      {Array(numMemoryCells).fill(0).map((_, i) => (
        <MemoryCell 
          key={i} 
          position={[i - numMemoryCells / 2 + 0.5, -3, 0]} 
          color={memoryType === 'global' ? '#0077C5' : '#F0AD4E'} 
          active={activeMemoryCells.includes(i)}
          value={showDetails ? i : undefined}
        />
      ))}
      
      {/* Threads */}
      {Array(threadsActive).fill(0).map((_, i) => {
        if (i < 8) { // Limit display to 8 threads for clarity
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
      
      {/* Efficiency indicator */}
      {showDetails && (
        <group position={[numMemoryCells / 2 + 2, -1.5, 0]}>
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
          <mesh position={[0, -1.5 + (accessEfficiency / 100) * 3, 0]}>
            <boxGeometry args={[0.8, (accessEfficiency / 100) * 3, 0.3]} />
            <meshStandardMaterial color={accessEfficiency > 70 ? '#76B900' : (accessEfficiency > 40 ? '#F0AD4E' : '#D9534F')} />
          </mesh>
          <Text
            position={[0, -1.7, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {accessEfficiency}%
          </Text>
        </group>
      )}
      
      {/* Memory transaction indicator */}
      {showDetails && (
        <group position={[-numMemoryCells / 2 - 2, -1.5, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Memory Transactions
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.6}
            color={accessPattern === 'coalesced' || accessPattern === 'shared' ? '#76B900' : '#D9534F'}
            anchorX="center"
            anchorY="middle"
          >
            {accessPattern === 'coalesced' ? Math.ceil(threadsActive / 4) : 
             accessPattern === 'shared' ? '1 + ' + Math.ceil(threadsActive / 4) :
             accessPattern === 'strided' ? Math.min(threadsActive, numMemoryCells / 2) : 
             Math.min(threadsActive, numMemoryCells)}
          </Text>
        </group>
      )}
    </group>
  );
};

const MemoryOptimization: React.FC<MemoryOptimizationProps> = ({ 
  blockSize, 
  memoryAccess, 
  showDetails 
}) => {
  // Determine how many threads to show based on blockSize
  const threadsToShow = Math.min(Math.max(4, blockSize / 32), 8);
  
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Memory access visualization */}
        <MemoryAccess 
          position={[0, 0, 0]} 
          memoryType={memoryAccess === 'shared' ? 'shared' : 'global'} 
          accessPattern={memoryAccess} 
          threadsActive={threadsToShow}
          showDetails={showDetails}
        />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      {/* Overlay information */}
      <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
        <h3 className="text-nvidia-green mb-2 font-medium">Memory Access Patterns</h3>
        <p className="text-sm text-gray-300">
          {memoryAccess === 'coalesced' ? (
            "Coalesced memory access combines multiple individual thread requests into fewer efficient transactions, significantly improving performance."
          ) : memoryAccess === 'strided' ? (
            "Strided access patterns force the GPU to perform separate memory transactions for each thread, reducing bandwidth utilization and performance."
          ) : memoryAccess === 'random' ? (
            "Random access patterns are highly inefficient, causing maximum memory transactions and cache thrashing."
          ) : (
            "Shared memory allows threads in a block to collaboratively load data from global memory once, then access it repeatedly with low latency."
          )}
        </p>
        
        {showDetails && (
          <div className="mt-2 space-y-1">
            <div className="text-sm flex justify-between">
              <span>Active Threads:</span>
              <span className="text-nvidia-green">{threadsToShow}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Memory Type:</span>
              <span className={memoryAccess === 'shared' ? "text-yellow-400" : "text-blue-400"}>
                {memoryAccess === 'shared' ? 'Shared Memory' : 'Global Memory'}
              </span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Efficiency:</span>
              <span className={
                memoryAccess === 'coalesced' || memoryAccess === 'shared' ? "text-nvidia-green" : 
                memoryAccess === 'strided' ? "text-yellow-400" : "text-red-400"
              }>
                {memoryAccess === 'coalesced' ? 'High (100%)' : 
                 memoryAccess === 'shared' ? 'Very High (90%)' :
                 memoryAccess === 'strided' ? 'Medium (50%)' : 'Low (25%)'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryOptimization;
