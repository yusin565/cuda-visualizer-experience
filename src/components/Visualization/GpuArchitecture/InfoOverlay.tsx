
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfoOverlayProps {
  blocksActive: number;
  threadsActive: number;
  blockSize: number;
  activeLevel: string;
  showDetails: boolean;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({
  blocksActive,
  threadsActive,
  blockSize,
  activeLevel,
  showDetails
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="text-nvidia-green mb-0 font-medium">CUDA Execution Model</h3>
        <button 
          onClick={toggleExpand} 
          className="text-nvidia-green hover:text-white transition-colors"
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <p className="text-sm text-gray-300 mt-2">
            The CUDA programming model organizes threads into blocks, and blocks into a grid. 
            This hierarchy maps efficiently to NVIDIA GPU hardware, enabling massive parallelism 
            with thousands of concurrent threads.
          </p>
          
          {showDetails && (
            <div className="mt-2 space-y-1">
              <div className="text-sm flex justify-between">
                <span>Active Blocks:</span>
                <span className="text-nvidia-green">{blocksActive} of 9</span>
              </div>
              <div className="text-sm flex justify-between">
                <span>Active Threads:</span>
                <span className="text-nvidia-green">{threadsActive} of {9 * blockSize}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span>Block Size:</span>
                <span className="text-nvidia-green">{blockSize} threads</span>
              </div>
              <div className="text-sm flex justify-between">
                <span>Memory Access:</span>
                <span className="text-yellow-400">{activeLevel}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InfoOverlay;
