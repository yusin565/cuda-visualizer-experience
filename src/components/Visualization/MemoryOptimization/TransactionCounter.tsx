
import React from 'react';
import { Text } from '@react-three/drei';

interface TransactionCounterProps {
  position: [number, number, number];
  accessPattern: string;
  threadsActive: number;
  numMemoryCells: number;
}

const TransactionCounter: React.FC<TransactionCounterProps> = ({ 
  position, 
  accessPattern, 
  threadsActive, 
  numMemoryCells 
}) => {
  const getTransactionCount = () => {
    if (accessPattern === 'coalesced') {
      return Math.ceil(threadsActive / 4);
    } else if (accessPattern === 'shared') {
      return '1 + ' + Math.ceil(threadsActive / 4);
    } else if (accessPattern === 'strided') {
      return Math.min(threadsActive, numMemoryCells / 2);
    } else { // random
      return Math.min(threadsActive, numMemoryCells);
    }
  };

  const getTextColor = () => {
    return accessPattern === 'coalesced' || accessPattern === 'shared' 
      ? '#76B900' 
      : '#D9534F';
  };

  return (
    <group position={position}>
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
        color={getTextColor()}
        anchorX="center"
        anchorY="middle"
      >
        {getTransactionCount()}
      </Text>
    </group>
  );
};

export default TransactionCounter;
