
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ControlPanelProps {
  section: string;
  workloadType: string;
  setWorkloadType: (value: string) => void;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  blockSize: number;
  setBlockSize: (value: number) => void;
  memoryAccess: string;
  setMemoryAccess: (value: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  section,
  workloadType,
  setWorkloadType,
  showDetails,
  setShowDetails,
  blockSize,
  setBlockSize,
  memoryAccess,
  setMemoryAccess
}) => {
  return (
    <div className="card-gradient rounded-lg p-4 w-full">
      <h3 className="text-lg font-medium text-nvidia-green mb-4">Control Panel</h3>

      <div className="space-y-4">
        {section === 'workloads' && (
          <div className="space-y-2">
            <Label htmlFor="workload-select">Workload Type</Label>
            <Select value={workloadType} onValueChange={setWorkloadType}>
              <SelectTrigger id="workload-select" className="border-nvidia-green/30 bg-nvidia-gray">
                <SelectValue placeholder="Select workload" />
              </SelectTrigger>
              <SelectContent className="bg-nvidia-gray border-nvidia-green/30">
                <SelectItem value="ml">Machine Learning</SelectItem>
                <SelectItem value="scientific">Scientific Simulation</SelectItem>
                <SelectItem value="financial">Financial Computation</SelectItem>
                <SelectItem value="graphics">Graphics Rendering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {(section === 'architecture' || section === 'memory') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="block-size">Thread Block Size</Label>
              <span className="text-sm text-nvidia-green">{blockSize}</span>
            </div>
            <Slider 
              id="block-size"
              min={32} 
              max={1024} 
              step={32} 
              value={[blockSize]} 
              onValueChange={(value) => setBlockSize(value[0])}
              className="cursor-pointer"
            />
          </div>
        )}

        {section === 'memory' && (
          <div className="space-y-2">
            <Label htmlFor="memory-access">Memory Access Pattern</Label>
            <Select value={memoryAccess} onValueChange={setMemoryAccess}>
              <SelectTrigger id="memory-access" className="border-nvidia-green/30 bg-nvidia-gray">
                <SelectValue placeholder="Select access pattern" />
              </SelectTrigger>
              <SelectContent className="bg-nvidia-gray border-nvidia-green/30">
                <SelectItem value="coalesced">Coalesced Access</SelectItem>
                <SelectItem value="strided">Strided Access</SelectItem>
                <SelectItem value="random">Random Access</SelectItem>
                <SelectItem value="shared">Shared Memory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {section === 'performance' && (
          <div className="space-y-2">
            <Label>Simulation Speed</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-nvidia-gray border-nvidia-green/30 hover:bg-nvidia-green hover:text-nvidia-dark"
                onClick={() => console.log('Slow simulation')}
              >
                Slow
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-nvidia-gray border-nvidia-green/30 hover:bg-nvidia-green hover:text-nvidia-dark"
                onClick={() => console.log('Fast simulation')}
              >
                Fast
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            variant={showDetails ? "default" : "outline"} 
            className={`w-full ${showDetails ? 'bg-nvidia-green text-nvidia-dark' : 'bg-nvidia-gray border-nvidia-green/30'}`}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
