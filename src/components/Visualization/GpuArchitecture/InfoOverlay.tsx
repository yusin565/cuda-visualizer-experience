
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 card-gradient rounded-lg max-w-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="p-4 pb-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <h3 className="text-nvidia-green font-medium">CUDA Execution Model</h3>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-nvidia-green transition-transform group-hover:text-white" />
            ) : (
              <ChevronDown className="h-4 w-4 text-nvidia-green transition-transform group-hover:text-white" />
            )}
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default InfoOverlay;
