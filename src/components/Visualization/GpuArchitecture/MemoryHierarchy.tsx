
import React from 'react';
import { Text } from '@react-three/drei';
import MemoryCell from './MemoryCell';

interface MemoryHierarchyProps {
  position: [number, number, number];
  activeLevel: string;
  showDetails: boolean;
}

interface MemoryType {
  name: string;
  color: string;
  size: string;
  y: number;
}

const MemoryHierarchy: React.FC<MemoryHierarchyProps> = ({
  position,
  activeLevel,
  showDetails
}) => {
  // Define memory types and their properties
  const memoryTypes: MemoryType[] = [
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
    const fromY = memoryTypes[from].y;
    const toY = memoryTypes[to].y;
    
    // Create vertices array with the correct format for three.js
    const vertices = new Float32Array([
      0, fromY, 0,
      0, toY, 0
    ]);
    
    return (
      <line key={`${from}-${to}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            itemSize={3}
            array={vertices}
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

export default MemoryHierarchy;
