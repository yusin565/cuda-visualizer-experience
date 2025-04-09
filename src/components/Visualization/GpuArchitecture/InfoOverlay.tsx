
import React from 'react';

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
  return (
    <div className="absolute bottom-4 left-4 card-gradient p-4 rounded-lg max-w-md">
      <h3 className="text-nvidia-green mb-2 font-medium">CUDA Execution Model</h3>
      <p className="text-sm text-gray-300">
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
    </div>
  );
};

export default InfoOverlay;
