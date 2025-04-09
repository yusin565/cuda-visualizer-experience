
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface GpuArchitectureProps {
  blockSize: number;
  showDetails: boolean;
}

// Thread representation
const Thread = ({ position, active, index, color = '#76B900' }: { 
  position: [number, number, number], 
  active: boolean,
  index: number,
  color?: string
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (active) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial 
        color={color} 
        emissive={active ? color : undefined} 
        emissiveIntensity={0.5} 
        metalness={0.5} 
        roughness={0.2}
      />
    </mesh>
  );
};

// Thread block representation
const ThreadBlock = ({ position, blockSize, activeThreads, showDetails }: { 
  position: [number, number, number], 
  blockSize: number,
  activeThreads: number,
  showDetails: boolean
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

// Grid representation
const Grid = ({ position, blockSize, blocksActive, threadsActive, showDetails }: { 
  position: [number, number, number], 
  blockSize: number,
  blocksActive: number,
  threadsActive: number,
  showDetails: boolean
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

// Memory cell representation
const MemoryCell = ({ position, color, active, name, size }: { 
  position: [number, number, number], 
  color: string,
  active: boolean,
  name: string,
  size: string
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

// Memory hierarchy visualization
const MemoryHierarchy = ({ position, activeLevel, showDetails }: {
  position: [number, number, number],
  activeLevel: string,
  showDetails: boolean
}) => {
  // Define memory types and their properties
  const memoryTypes = [
    { name: "Registers", color: "#76B900", size: "per Thread", y: 3 },
    { name: "Shared Memory", color: "#F0AD4E", size: "per Block", y: 2 },
    { name: "L1/L2 Cache", color: "#5BC0DE", size: "GPU-wide", y: 1 },
    { name: "Global Memory", color: "#0077C5", size: "Device DRAM", y: 0 },
    { name: "Host Memory", color: "#D9534F", size: "System RAM", y: -1 }
  ];
  
  // Connect levels with lines
  const lineConnections = [
    { from: 0, to: 1 }, // Registers to Shared
    { from: 1, to: 2 }, // Shared to L1/L2
    { from: 2, to: 3 }, // L1/L2 to Global
    { from: 3, to: 4 }  // Global to Host
  ];
  
  // Helper for creating a line object - fixed version
  const createLine = (from: number, to: number) => {
    const positions = new Float32Array([
      0, memoryTypes[from].y, 0,
      0, memoryTypes[to].y, 0
    ]);
    
    return (
      <line key={`${from}-${to}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#555555" 
          linewidth={2} 
        />
      </line>
    );
  };
  
  return (
    <group position={position}>
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Memory Hierarchy
      </Text>
      
      {/* Memory levels */}
      {memoryTypes.map((mem, i) => (
        <MemoryCell 
          key={i} 
          position={[0, mem.y, 0]} 
          color={mem.color} 
          active={activeLevel === mem.name.toLowerCase().split('/')[0]}
          name={mem.name}
          size={mem.size}
        />
      ))}
      
      {/* Connecting lines */}
      {lineConnections.map((conn) => createLine(conn.from, conn.to))}
      
      {/* Performance metrics */}
      {showDetails && (
        <group position={[2.5, 1, 0]}>
          <Text
            position={[0, 3, 0]}
            fontSize={0.2}
            color="#76B900"
            anchorX="left"
            anchorY="middle"
          >
            Registers: ~0.2ns
          </Text>
          <Text
            position={[0, 2, 0]}
            fontSize={0.2}
            color="#F0AD4E"
            anchorX="left"
            anchorY="middle"
          >
            Shared: ~1.2ns
          </Text>
          <Text
            position={[0, 1, 0]}
            fontSize={0.2}
            color="#5BC0DE"
            anchorX="left"
            anchorY="middle"
          >
            L1/L2: ~20ns
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#0077C5"
            anchorX="left"
            anchorY="middle"
          >
            Global: ~200ns
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.2}
            color="#D9534F"
            anchorX="left"
            anchorY="middle"
          >
            Host: ~20,000ns
          </Text>
        </group>
      )}
      
      {/* Bandwidth comparison */}
      {showDetails && (
        <group position={[-2.5, 1, 0]}>
          <Text
            position={[0, 3, 0]}
            fontSize={0.2}
            color="#76B900"
            anchorX="right"
            anchorY="middle"
          >
            Per-thread
          </Text>
          <Text
            position={[0, 2, 0]}
            fontSize={0.2}
            color="#F0AD4E"
            anchorX="right"
            anchorY="middle"
          >
            ~5-10 TB/s
          </Text>
          <Text
            position={[0, 1, 0]}
            fontSize={0.2}
            color="#5BC0DE"
            anchorX="right"
            anchorY="middle"
          >
            ~1-3 TB/s
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#0077C5"
            anchorX="right"
            anchorY="middle"
          >
            ~1 TB/s
          </Text>
          <Text
            position={[0, -1, 0]}
            fontSize={0.2}
            color="#D9534F"
            anchorX="right"
            anchorY="middle"
          >
            ~50 GB/s
          </Text>
        </group>
      )}
    </group>
  );
};

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
      <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
        <h3 className="text-nvidia-green mb-2 font-medium">CUDA Execution Model</h3>
        <p className="text-sm text-gray-300">
          The CUDA programming model organizes threads into blocks, and blocks into a grid. 
          This hierarchy maps efficiently to NVIDIA GPU hardware, enabling massive parallelism 
          with thousands of concurrent threads.
        </p>
        
        {showDetails && (
          <div className="mt-2 space-y-1">
            <div className="text-sm flex justify-between">
              <span>Active Blocks:</span>
              <span className="text-nvidia-green">{blocksActive} of 9</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Active Threads:</span>
              <span className="text-nvidia-green">{threadsActive} of {9 * blockSize}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Block Size:</span>
              <span className="text-nvidia-green">{blockSize} threads</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Memory Access:</span>
              <span className="text-yellow-400">{activeLevel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GpuArchitecture;
