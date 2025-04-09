
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useHelper, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GpuArchitectureProps {
  blockSize: number;
  showDetails: boolean;
}

const Thread = ({ position, color, isHighlighted, showLabel }: { 
  position: [number, number, number], 
  color: string,
  isHighlighted: boolean,
  showLabel: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (isHighlighted) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color={color} emissive={isHighlighted ? color : undefined} emissiveIntensity={0.5} />
      {showLabel && (
        <Html distanceFactor={10} position={[0, 0.3, 0]} className="pointer-events-none">
          <div className="bg-nvidia-dark border border-nvidia-green px-2 py-1 rounded text-white text-xs">
            Thread
          </div>
        </Html>
      )}
    </mesh>
  );
};

const ThreadBlock = ({ position, size, isHighlighted, showLabel }: { 
  position: [number, number, number], 
  size: number,
  isHighlighted: boolean,
  showLabel: boolean
}) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 0.5, 'red');
  
  const threadsPerDimension = Math.ceil(Math.sqrt(size / 4));
  const spacing = 0.4;
  const blockWidth = threadsPerDimension * spacing;
  
  return (
    <group position={position}>
      {/* Container box */}
      <mesh ref={boxRef} position={[0, 0, 0]}>
        <boxGeometry args={[blockWidth+0.3, 1, blockWidth+0.3]} />
        <meshStandardMaterial 
          color="#1A1A1A" 
          transparent 
          opacity={0.2} 
          emissive={isHighlighted ? "#76B900" : undefined} 
          emissiveIntensity={0.3} 
        />
      </mesh>
      
      {/* Light for the block */}
      <directionalLight
        ref={directionalLightRef}
        position={[0, 2, 0]}
        intensity={isHighlighted ? 2 : 0.5}
        color="#76B900"
      />
      
      {/* Threads */}
      {Array(threadsPerDimension).fill(0).map((_, x) =>
        Array(threadsPerDimension).fill(0).map((_, z) => {
          if (x * threadsPerDimension + z < size / 4) { // Limit to blockSize
            const xPos = (x - threadsPerDimension / 2) * spacing + spacing / 2;
            const zPos = (z - threadsPerDimension / 2) * spacing + spacing / 2;
            return (
              <Thread 
                key={`${x}-${z}`} 
                position={[xPos, 0, zPos]} 
                color={isHighlighted ? "#76B900" : "#4a7600"} 
                isHighlighted={isHighlighted} 
                showLabel={x === 0 && z === 0 && showLabel}
              />
            );
          }
          return null;
        })
      )}
      
      {showLabel && (
        <Html distanceFactor={10} position={[0, 1.2, 0]} className="pointer-events-none">
          <div className="bg-nvidia-dark border border-nvidia-green px-2 py-1 rounded text-white text-xs">
            Thread Block ({size / 4} threads)
          </div>
        </Html>
      )}
    </group>
  );
};

const Grid = ({ position, numBlocks, blockSize, isHighlighted, showLabel }: { 
  position: [number, number, number], 
  numBlocks: number,
  blockSize: number,
  isHighlighted: boolean,
  showLabel: boolean
}) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const blocksPerDimension = Math.ceil(Math.sqrt(numBlocks));
  const spacing = 3;
  
  return (
    <group position={position}>
      {/* Container box for the grid */}
      <mesh ref={boxRef} position={[0, 0, 0]}>
        <boxGeometry args={[blocksPerDimension * spacing + 1, 2, blocksPerDimension * spacing + 1]} />
        <meshStandardMaterial 
          color="#333333" 
          transparent 
          opacity={0.1} 
          emissive={isHighlighted ? "#0077C5" : undefined} 
          emissiveIntensity={0.2} 
        />
      </mesh>
      
      {/* Thread blocks */}
      {Array(blocksPerDimension).fill(0).map((_, x) =>
        Array(blocksPerDimension).fill(0).map((_, z) => {
          if (x * blocksPerDimension + z < numBlocks) {
            const xPos = (x - blocksPerDimension / 2) * spacing + spacing / 2;
            const zPos = (z - blocksPerDimension / 2) * spacing + spacing / 2;
            return (
              <ThreadBlock 
                key={`${x}-${z}`} 
                position={[xPos, 0, zPos]} 
                size={blockSize} 
                isHighlighted={x === 0 && z === 0 && isHighlighted} 
                showLabel={x === 0 && z === 0 && showLabel}
              />
            );
          }
          return null;
        })
      )}
      
      {showLabel && (
        <Html distanceFactor={10} position={[0, 2.5, 0]} className="pointer-events-none">
          <div className="bg-nvidia-dark border border-nvidia-blue px-2 py-1 rounded text-white text-xs">
            Grid ({numBlocks} blocks)
          </div>
        </Html>
      )}
    </group>
  );
};

const MemoryHierarchy = ({ position, showDetails }: { 
  position: [number, number, number],
  showDetails: boolean
}) => {
  return (
    <group position={position}>
      {/* Global Memory - largest and at the bottom */}
      <mesh position={[0, -5, 0]} receiveShadow>
        <boxGeometry args={[10, 1, 6]} />
        <meshStandardMaterial color="#0077C5" transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, -5.8, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Global Memory
      </Text>
      
      {/* L2 Cache */}
      <mesh position={[0, -3.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.5, 5]} />
        <meshStandardMaterial color="#76B900" transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, -4, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        L2 Cache
      </Text>
      
      {/* Shared Memory - multiple small blocks */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, -2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.8, 0.4, 3]} />
            <meshStandardMaterial color="#F0AD4E" transparent opacity={0.7} />
          </mesh>
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Shared Memory
          </Text>
        </group>
      ))}
      
      {/* Register files - many small blocks at the top */}
      {showDetails && Array(12).fill(0).map((_, i) => {
        const x = ((i % 6) - 2.5) * 1.5;
        const z = i < 6 ? -1 : 1;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.8, 0.2, 0.8]} />
              <meshStandardMaterial color="#D9534F" transparent opacity={0.9} />
            </mesh>
            {i === 0 && (
              <Text
                position={[0, 0.4, 0]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                Registers
              </Text>
            )}
          </group>
        );
      })}
      
      {/* Constant Memory */}
      {showDetails && (
        <group position={[-4, -3.5, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.5, 0.4, 2]} />
            <meshStandardMaterial color="#5BC0DE" transparent opacity={0.7} />
          </mesh>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Constant Memory
          </Text>
        </group>
      )}
      
      {/* Texture Memory */}
      {showDetails && (
        <group position={[4, -3.5, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.5, 0.4, 2]} />
            <meshStandardMaterial color="#5BC0DE" transparent opacity={0.7} />
          </mesh>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Texture Memory
          </Text>
        </group>
      )}
      
      {/* Connection lines */}
      {showDetails && (
        <>
          <line>
            <bufferGeometry attach="geometry" 
              args={[new Float32Array([
                0, -4.5, 0,
                0, -3.5, 0
              ]), 3]} />
            <lineBasicMaterial attach="material" color="#FFFFFF" />
          </line>
          <line>
            <bufferGeometry attach="geometry" 
              args={[new Float32Array([
                0, -3, 0,
                0, -2, 0
              ]), 3]} />
            <lineBasicMaterial attach="material" color="#FFFFFF" />
          </line>
          <line>
            <bufferGeometry attach="geometry" 
              args={[new Float32Array([
                0, -1.8, 0,
                0, -0.2, 0
              ]), 3]} />
            <lineBasicMaterial attach="material" color="#FFFFFF" />
          </line>
        </>
      )}
    </group>
  );
};

const GpuArchitecture: React.FC<GpuArchitectureProps> = ({ blockSize, showDetails }) => {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
        
        {/* GPU Execution Model */}
        <group position={[0, 3, 0]}>
          <Grid position={[0, 0, 0]} numBlocks={9} blockSize={blockSize} isHighlighted={hoveredComponent === 'grid'} showLabel={showDetails} />
        </group>
        
        {/* Memory Hierarchy Visualization */}
        <MemoryHierarchy position={[0, 0, 0]} showDetails={showDetails} />
        
        {/* Tooltip hover areas */}
        <group 
          position={[0, 3, 0]} 
          onClick={() => setHoveredComponent(hoveredComponent === 'grid' ? null : 'grid')}
        >
          <mesh visible={false} position={[0, 0, 0]}>
            <boxGeometry args={[10, 2, 10]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      {/* Overlay tooltips */}
      <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
        <h3 className="text-nvidia-green mb-2 font-medium">GPU Execution Model</h3>
        <p className="text-sm text-gray-300">
          CUDA organizes execution into a hierarchy: threads are grouped into blocks, and blocks are organized into a grid. 
          This structure maps directly to the physical GPU architecture, enabling massive parallelism.
        </p>
        {hoveredComponent === 'grid' && (
          <div className="mt-2 text-sm bg-nvidia-gray/50 p-2 rounded">
            <span className="text-nvidia-green font-medium">Grid:</span> Collection of thread blocks. Each grid corresponds to a CUDA kernel execution.
          </div>
        )}
      </div>
    </div>
  );
};

export default GpuArchitecture;
