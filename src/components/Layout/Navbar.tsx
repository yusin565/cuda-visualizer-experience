
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-full bg-nvidia-dark border-b border-nvidia-green/30 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-nvidia-green rounded-md flex items-center justify-center">
          <span className="text-nvidia-dark font-bold">3D</span>
        </div>
        <h1 className="text-2xl font-bold text-white">
          CUDA <span className="text-nvidia-green">Visualizer</span>
        </h1>
      </div>
      
      <Tabs value={activeSection} className="w-auto" onValueChange={setActiveSection}>
        <TabsList className="bg-nvidia-gray">
          <TabsTrigger value="architecture" className="data-[state=active]:bg-nvidia-green data-[state=active]:text-nvidia-dark">
            GPU Architecture
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-nvidia-green data-[state=active]:text-nvidia-dark">
            Performance Benchmark
          </TabsTrigger>
          <TabsTrigger value="memory" className="data-[state=active]:bg-nvidia-green data-[state=active]:text-nvidia-dark">
            Memory Optimization
          </TabsTrigger>
          <TabsTrigger value="workloads" className="data-[state=active]:bg-nvidia-green data-[state=active]:text-nvidia-dark">
            Workload Selector
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Navbar;
