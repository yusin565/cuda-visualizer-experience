
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PerformanceBenchmarkProps {
  showDetails: boolean;
}

// Worker representation for CPU or GPU core
const Worker = ({ position, color, active, processingSpeed }: { 
  position: [number, number, number], 
  color: string,
  active: boolean,
  processingSpeed: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [scale, setScale] = useState(1);
  
  useFrame(() => {
    if (active) {
      // Pulse effect
      setScale(prev => {
        const newScale = prev + Math.sin(Date.now() * 0.005 * processingSpeed) * 0.05;
        return Math.max(0.9, Math.min(1.1, newScale));
      });
      
      // Processing animation
      meshRef.current.rotation.y += 0.02 * processingSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[scale, scale, scale]}>
      <boxGeometry args={[0.8, 0.2, 0.8]} />
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

// Task representation
const Task = ({ position, completed, color }: { 
  position: [number, number, number], 
  completed: boolean,
  color: string
}) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial 
        color={completed ? color : '#555555'} 
        emissive={completed ? color : undefined} 
        emissiveIntensity={0.3}
        transparent={!completed}
        opacity={completed ? 1 : 0.3}
      />
    </mesh>
  );
};

// CPU Simulation
const CpuSimulation = ({ position, numCores, tasksCompleted, showDetails }: { 
  position: [number, number, number],
  numCores: number,
  tasksCompleted: number,
  showDetails: boolean
}) => {
  // Place CPU cores in a line
  return (
    <group position={position}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.7}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        CPU Processing
      </Text>
      
      {/* Progress bar */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[6, 0.4, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-3 + (tasksCompleted / 100) * 3, 1, 0]}>
        <boxGeometry args={[(tasksCompleted / 100) * 6, 0.4, 0.4]} />
        <meshStandardMaterial color="#0077C5" />
      </mesh>
      <Text
        position={[3.5, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {tasksCompleted}%
      </Text>
      
      {/* Display CPU cores */}
      {Array(numCores).fill(0).map((_, i) => {
        const x = ((i % 4) - 1.5) * 1.2;
        const z = Math.floor(i / 4) * 1.2 - 1;
        return (
          <Worker 
            key={i} 
            position={[x, 0, z]} 
            color="#0077C5" 
            active={i < Math.ceil(tasksCompleted / 10)} 
            processingSpeed={1}
          />
        );
      })}
      
      {/* Task grid */}
      {showDetails && Array(100).fill(0).map((_, i) => {
        const x = ((i % 10) - 4.5) * 0.4;
        const z = Math.floor(i / 10) * 0.4 - 4;
        return (
          <Task 
            key={i} 
            position={[x, -1.5, z]} 
            completed={i < tasksCompleted} 
            color="#0077C5"
          />
        );
      })}
    </group>
  );
};

// GPU Simulation
const GpuSimulation = ({ position, numCores, tasksCompleted, showDetails }: { 
  position: [number, number, number],
  numCores: number,
  tasksCompleted: number,
  showDetails: boolean
}) => {
  // Place GPU cores in a grid
  const coresPerRow = Math.ceil(Math.sqrt(numCores));
  
  return (
    <group position={position}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.7}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        GPU Processing
      </Text>
      
      {/* Progress bar */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[6, 0.4, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[-3 + (tasksCompleted / 100) * 3, 1, 0]}>
        <boxGeometry args={[(tasksCompleted / 100) * 6, 0.4, 0.4]} />
        <meshStandardMaterial color="#76B900" />
      </mesh>
      <Text
        position={[3.5, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        {tasksCompleted}%
      </Text>
      
      {/* Display GPU cores in a grid */}
      {Array(numCores).fill(0).map((_, i) => {
        if (i < 64) { // Limit display to avoid overcrowding
          const x = ((i % coresPerRow) - (coresPerRow / 2)) * 0.35 + 0.175;
          const z = (Math.floor(i / coresPerRow) - (coresPerRow / 2)) * 0.35 + 0.175;
          return (
            <Worker 
              key={i} 
              position={[x, 0, z]} 
              color="#76B900" 
              active={i < Math.ceil(tasksCompleted * 6.4 / 10)} 
              processingSpeed={5}
            />
          );
        }
        return null;
      })}
      
      {/* Task grid (more tasks for GPU) */}
      {showDetails && Array(100).fill(0).map((_, i) => {
        const gridSize = 10; // 10x10 grid
        const x = ((i % gridSize) - (gridSize / 2)) * 0.4 + 0.2;
        const z = (Math.floor(i / gridSize) - (gridSize / 2)) * 0.4 + 0.2;
        return (
          <Task 
            key={i} 
            position={[x, -1.5, z]} 
            completed={i < tasksCompleted} 
            color="#76B900"
          />
        );
      })}
    </group>
  );
};

const PerformanceBenchmark: React.FC<PerformanceBenchmarkProps> = ({ showDetails }) => {
  const [cpuProgress, setCpuProgress] = useState(0);
  const [gpuProgress, setGpuProgress] = useState(0);
  
  useEffect(() => {
    const cpuInterval = setInterval(() => {
      setCpuProgress(prev => {
        if (prev >= 100) {
          clearInterval(cpuInterval);
          return 100;
        }
        return prev + 0.2;
      });
    }, 50);
    
    const gpuInterval = setInterval(() => {
      setGpuProgress(prev => {
        if (prev >= 100) {
          clearInterval(gpuInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    return () => {
      clearInterval(cpuInterval);
      clearInterval(gpuInterval);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* CPU and GPU simulations side by side */}
        <CpuSimulation position={[-5, 0, 0]} numCores={8} tasksCompleted={cpuProgress} showDetails={showDetails} />
        <GpuSimulation position={[5, 0, 0]} numCores={128} tasksCompleted={gpuProgress} showDetails={showDetails} />
        
        {/* Chart showing speedup */}
        {showDetails && (
          <group position={[0, -5, 0]}>
            <Text
              position={[0, 1, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Performance Comparison
            </Text>
            
            {/* CPU Bar */}
            <mesh position={[-2, 0, 0]}>
              <boxGeometry args={[1, 1, 0.5]} />
              <meshStandardMaterial color="#0077C5" />
            </mesh>
            <Text
              position={[-2, -0.7, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              CPU
            </Text>
            <Text
              position={[-2, 0, 0.5]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              1x
            </Text>
            
            {/* GPU Bar */}
            <mesh position={[2, 0, 0]} scale={[1, gpuProgress / 4, 1]}>
              <boxGeometry args={[1, 1, 0.5]} />
              <meshStandardMaterial color="#76B900" />
            </mesh>
            <Text
              position={[2, -0.7, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              GPU
            </Text>
            <Text
              position={[2, (gpuProgress / 4) * 0.5, 0.5]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {Math.round(gpuProgress / 4)}x
            </Text>
          </group>
        )}
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      {/* Overlay information */}
      <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
        <h3 className="text-nvidia-green mb-2 font-medium">Real-time Performance Comparison</h3>
        <p className="text-sm text-gray-300">
          Watch in real-time as the GPU processes tasks in parallel, completing the workload significantly faster than the CPU.
          GPU acceleration can provide 10-30x speedup for various workloads compared to CPU-only processing.
        </p>
        {showDetails && (
          <div className="mt-2 space-y-1">
            <div className="text-sm flex justify-between">
              <span>CPU Progress:</span>
              <span className="text-blue-400">{Math.round(cpuProgress)}%</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>GPU Progress:</span>
              <span className="text-nvidia-green">{Math.round(gpuProgress)}%</span>
            </div>
            <div className="text-sm flex justify-between">
              <span>Speed Improvement:</span>
              <span className="text-nvidia-green">{cpuProgress > 0 ? Math.round((gpuProgress / cpuProgress) * 10) / 10 : 0}x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceBenchmark;
