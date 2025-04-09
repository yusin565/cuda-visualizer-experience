
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface WorkloadSelectorProps {
  workloadType: string;
  showDetails: boolean;
}

// GPU representation that adapts to the workload type
const GpuWorkload = ({ position, workloadType, active, showDetails }: { 
  position: [number, number, number], 
  workloadType: string,
  active: boolean,
  showDetails: boolean
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [elementsActive, setElementsActive] = useState(0);
  
  // Determine visualization parameters based on workload type
  let color = '#76B900';
  let totalElements = 100;
  let gridSize = 10;
  let speedup = 20;
  let workloadName = 'Generic';
  let elementShape = 'cube';
  
  switch (workloadType) {
    case 'ml':
      color = '#76B900';
      totalElements = 64;
      gridSize = 8;
      speedup = 25;
      workloadName = 'Neural Network';
      elementShape = 'sphere';
      break;
    case 'scientific':
      color = '#0077C5';
      totalElements = 100;
      gridSize = 10;
      speedup = 35;
      workloadName = 'Fluid Simulation';
      elementShape = 'cylinder';
      break;
    case 'financial':
      color = '#F0AD4E';
      totalElements = 81;
      gridSize = 9;
      speedup = 18;
      workloadName = 'Monte Carlo Simulation';
      elementShape = 'cone';
      break;
    case 'graphics':
      color = '#D9534F';
      totalElements = 121;
      gridSize = 11;
      speedup = 30;
      workloadName = 'Ray Tracing';
      elementShape = 'torus';
      break;
  }
  
  // Animation to progressively activate elements
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setElementsActive(prev => {
          if (prev >= totalElements) {
            clearInterval(interval);
            return totalElements;
          }
          return prev + 1;
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setElementsActive(0);
    }
  }, [active, totalElements]);
  
  // Rotation animation
  useFrame(() => {
    if (active) {
      groupRef.current.rotation.y += 0.002;
    }
  });
  
  // Helper function to create element geometry based on workload type
  const createElement = (position: [number, number, number], index: number) => {
    const isActive = index < elementsActive;
    const scale = isActive ? 1 : 0.5;
    
    let geometry;
    switch (elementShape) {
      case 'sphere':
        geometry = <sphereGeometry args={[0.4, 16, 16]} />;
        break;
      case 'cylinder':
        geometry = <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />;
        break;
      case 'cone':
        geometry = <coneGeometry args={[0.3, 0.8, 16]} />;
        break;
      case 'torus':
        geometry = <torusGeometry args={[0.3, 0.1, 8, 16]} />;
        break;
      default:
        geometry = <boxGeometry args={[0.6, 0.6, 0.6]} />;
    }
    
    return (
      <mesh key={index} position={position} scale={[scale, scale, scale]}>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          emissive={isActive ? color : undefined} 
          emissiveIntensity={isActive ? 0.5 : 0} 
          metalness={0.5} 
          roughness={0.2}
          transparent={!isActive}
          opacity={isActive ? 1 : 0.3}
        />
      </mesh>
    );
  };
  
  return (
    <group ref={groupRef} position={position}>
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {workloadName} Acceleration
      </Text>
      
      {/* Create grid of elements */}
      {Array(totalElements).fill(0).map((_, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const x = (col - gridSize / 2) * 0.8 + 0.4;
        const y = 0;
        const z = (row - gridSize / 2) * 0.8 + 0.4;
        return createElement([x, y, z], i);
      })}
      
      {/* Performance metrics */}
      {showDetails && (
        <group position={[0, -3, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Performance Metrics
          </Text>
          
          <Text
            position={[-2, 0, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            Speedup:
          </Text>
          <Text
            position={[-1.5, 0, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {speedup}x
          </Text>
          
          <Text
            position={[-2, -0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            Memory Usage:
          </Text>
          <Text
            position={[-1.5, -0.5, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {workloadType === 'ml' ? 'High' : workloadType === 'scientific' ? 'Very High' : 'Medium'}
          </Text>
          
          <Text
            position={[-2, -1, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            Parallelism:
          </Text>
          <Text
            position={[-1.5, -1, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {workloadType === 'ml' || workloadType === 'scientific' ? 'Massive' : 'High'}
          </Text>
          
          <Text
            position={[2, 0, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            Compute:
          </Text>
          <Text
            position={[2.5, 0, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {workloadType === 'ml' ? 'Tensor' : workloadType === 'scientific' ? 'Float' : 'Mixed'}
          </Text>
          
          <Text
            position={[2, -0.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            IO Bottleneck:
          </Text>
          <Text
            position={[2.5, -0.5, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {workloadType === 'ml' ? 'Medium' : workloadType === 'scientific' ? 'High' : 'Low'}
          </Text>
          
          <Text
            position={[2, -1, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="middle"
          >
            Ideal for:
          </Text>
          <Text
            position={[2.5, -1, 0]}
            fontSize={0.4}
            color={color}
            anchorX="left"
            anchorY="middle"
          >
            {workloadType === 'ml' ? 'A100/H100' : 
             workloadType === 'scientific' ? 'A100' : 
             workloadType === 'financial' ? 'T4/A10' : 'RTX'}
          </Text>
        </group>
      )}
      
      {/* Progress indicator */}
      <group position={[0, -5, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 0.3, 0.3]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-5 + (elementsActive / totalElements) * 5, 0, 0]}>
          <boxGeometry args={[(elementsActive / totalElements) * 10, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <Text
          position={[5.5, 0, 0]}
          fontSize={0.4}
          color="white"
          anchorX="left"
          anchorY="middle"
        >
          {Math.round((elementsActive / totalElements) * 100)}%
        </Text>
      </group>
    </group>
  );
};

const WorkloadSelector: React.FC<WorkloadSelectorProps> = ({ workloadType, showDetails }) => {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Workload visualization */}
        <GpuWorkload position={[0, 0, 0]} workloadType={workloadType} active={true} showDetails={showDetails} />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      {/* Overlay information */}
      <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
        <h3 className="text-nvidia-green mb-2 font-medium">
          {workloadType === 'ml' ? 'Machine Learning' : 
           workloadType === 'scientific' ? 'Scientific Simulation' : 
           workloadType === 'financial' ? 'Financial Computation' : 'Graphics Rendering'}
        </h3>
        <p className="text-sm text-gray-300">
          {workloadType === 'ml' ? (
            "CUDA accelerates neural network training by 20-30x through tensor cores and optimized memory operations, enabling deep learning breakthroughs."
          ) : workloadType === 'scientific' ? (
            "Scientific simulations like fluid dynamics, weather modeling, and molecular dynamics see 15-40x speedups with CUDA, reducing simulation time from days to hours."
          ) : workloadType === 'financial' ? (
            "Financial models using Monte Carlo simulations for risk assessment and options pricing achieve 10-20x acceleration, enabling real-time analysis."
          ) : (
            "Ray tracing, image processing, and rendering tasks see 15-30x performance gains, making photorealistic rendering possible in real-time applications."
          )}
        </p>
        
        {showDetails && (
          <div className="mt-3 text-sm">
            <h4 className="text-nvidia-green mb-1">Optimization Techniques:</h4>
            <ul className="space-y-1 pl-4 list-disc">
              {workloadType === 'ml' ? (
                <>
                  <li>Tensor core utilization for matrix operations</li>
                  <li>Mixed precision training (FP16/FP32)</li>
                  <li>Optimized memory access for convolutions</li>
                </>
              ) : workloadType === 'scientific' ? (
                <>
                  <li>Domain decomposition for parallel processing</li>
                  <li>Shared memory for stencil operations</li>
                  <li>Optimized boundary condition handling</li>
                </>
              ) : workloadType === 'financial' ? (
                <>
                  <li>Random number generation optimization</li>
                  <li>Path calculation parallelism</li>
                  <li>Efficient reduction for aggregation</li>
                </>
              ) : (
                <>
                  <li>BVH traversal optimization</li>
                  <li>Texture cache utilization</li>
                  <li>Denoising acceleration</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkloadSelector;
