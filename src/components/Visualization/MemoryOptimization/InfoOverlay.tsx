
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isOpen, setIsOpen] = useState(true);

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
    <div className="absolute bottom-4 left-4 card-gradient rounded-lg max-w-md overflow-hidden">
      <div className="bg-nvidia-green/80 px-4 py-3">
        <h3 className="text-white font-medium">Memory Access Patterns</h3>
      </div>
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">
            {getDescription()}
          </p>
          
          {showDetails && (
            <div className="space-y-2">
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
        </CollapsibleContent>
        
        <div className="bg-nvidia-green/80 p-1 flex justify-center cursor-pointer">
          <CollapsibleTrigger className="w-full flex justify-center items-center">
            <div className="w-10 h-1 bg-white/50 rounded-full"></div>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
};

export default InfoOverlay;
