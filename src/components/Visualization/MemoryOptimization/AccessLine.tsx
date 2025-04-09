
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AccessLineProps {
  startPos: [number, number, number];
  midPos: [number, number, number];
  endPos: [number, number, number];
  color: string;
}

export const AccessLine: React.FC<AccessLineProps> = ({ 
  startPos, 
  midPos, 
  endPos, 
  color 
}) => {
  // Create vertices array for the line using useMemo to avoid recreating on every render
  const vertices = useMemo(() => {
    return new Float32Array([
      startPos[0], startPos[1], startPos[2],
      midPos[0], midPos[1], midPos[2],
      endPos[0], endPos[1], endPos[2]
    ]);
  }, [startPos, midPos, endPos]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={vertices.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} />
    </line>
  );
};
