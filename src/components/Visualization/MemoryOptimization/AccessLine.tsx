
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

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
  // Create points array for the curved line
  const points = useMemo(() => {
    return [
      new THREE.Vector3(startPos[0], startPos[1], startPos[2]),
      new THREE.Vector3(midPos[0], midPos[1], midPos[2]),
      new THREE.Vector3(endPos[0], endPos[1], endPos[2])
    ];
  }, [startPos, midPos, endPos]);
  
  return (
    <Line 
      points={points}
      color={color}
      lineWidth={1}
    />
  );
};
