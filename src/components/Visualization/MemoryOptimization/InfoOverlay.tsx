
import React from 'react';

interface InfoOverlayProps {
  accessPattern: string;
  threadsActive: number;
  memoryType: string;
  showDetails: boolean;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ 
  accessPattern, 
  threadsActive, 
  memoryType, 
  showDetails 
}) => {
  const getDescription = () => {
    if (accessPattern === 'coalesced') {
      return "Coalesced memory access combines multiple individual thread requests into fewer efficient transactions, significantly improving performance.";
    } else if (accessPattern === 'strided') {
      return "Strided access patterns force the GPU to perform separate memory transactions for each thread, reducing bandwidth utilization and performance.";
    } else if (accessPattern === 'random') {
      return "Random access patterns are highly inefficient, causing maximum memory transactions and cache thrashing.";
    } else { // shared
      return "Shared memory allows threads in a block to collaboratively load data from global memory once, then access it repeatedly with low latency.";
    }
  };

  const getEfficiencyClass = () => {
    if (accessPattern === 'coalesced' || accessPattern === 'shared') {
      return "text-nvidia-green";
    } else if (accessPattern === 'strided') {
      return "text-yellow-400";
    } else {
      return "text-red-400";
    }
  };

  const getEfficiencyText = () => {
    if (accessPattern === 'coalesced') {
      return 'High (100%)';
    } else if (accessPattern === 'shared') {
      return 'Very High (90%)';
    } else if (accessPattern === 'strided') {
      return 'Medium (50%)';
    } else {
      return 'Low (25%)';
    }
  };

  return (
    <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
      <h3 className="text-nvidia-green mb-2 font-medium">Memory Access Patterns</h3>
      <p className="text-sm text-gray-300">
        {getDescription()}
      </p>
      
      {showDetails && (
        <div className="mt-2 space-y-1">
          <div className="text-sm flex justify-between">
            <span>Active Threads:</span>
            <span className="text-nvidia-green">{threadsActive}</span>
          </div>
          <div className="text-sm flex justify-between">
            <span>Memory Type:</span>
            <span className={memoryType === 'shared' ? "text-yellow-400" : "text-blue-400"}>
              {memoryType === 'shared' ? 'Shared Memory' : 'Global Memory'}
            </span>
          </div>
          <div className="text-sm flex justify-between">
            <span>Efficiency:</span>
            <span className={getEfficiencyClass()}>
              {getEfficiencyText()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoOverlay;
