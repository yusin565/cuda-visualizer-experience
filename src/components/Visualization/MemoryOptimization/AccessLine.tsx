
import React from 'react';
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
  // Create vertices array for the line
  const vertices = new Float32Array([
    startPos[0], startPos[1], startPos[2],
    midPos[0], midPos[1], midPos[2],
    endPos[0], endPos[1], endPos[2]
  ]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3}
          itemSize={3}
          array={vertices}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
};
