
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 card-gradient rounded-lg max-w-md overflow-hidden">
      <div className="bg-nvidia-green/80 px-4 py-3">
        <h3 className="text-white font-medium">CUDA Execution Model</h3>
      </div>
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">
            The CUDA programming model organizes threads into blocks, and blocks into a grid. 
            This hierarchy maps efficiently to NVIDIA GPU hardware, enabling massive parallelism 
            with thousands of concurrent threads.
          </p>
          
          {showDetails && (
            <div className="space-y-2">
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
