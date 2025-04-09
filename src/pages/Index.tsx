
import React, { useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import InfoPanel from '@/components/Layout/InfoPanel';
import ControlPanel from '@/components/Layout/ControlPanel';
import GpuArchitecture from '@/components/Visualization/GpuArchitecture';
import PerformanceBenchmark from '@/components/Visualization/PerformanceBenchmark';
import MemoryOptimization from '@/components/Visualization/MemoryOptimization';
import WorkloadSelector from '@/components/Visualization/WorkloadSelector';

const Index = () => {
  // State for section navigation
  const [activeSection, setActiveSection] = useState('architecture');
  
  // Control panel states
  const [workloadType, setWorkloadType] = useState('ml');
  const [showDetails, setShowDetails] = useState(true);
  const [blockSize, setBlockSize] = useState(256);
  const [memoryAccess, setMemoryAccess] = useState('coalesced');
  
  // Content for information panels based on active section
  const infoPanels = {
    architecture: {
      title: "GPU Architecture & Execution Model",
      description: "CUDA provides a hierarchical execution model that maps efficiently to GPU hardware.",
      keyPoints: [
        "Threads group into thread blocks, which combine into a grid for massive parallelism",
        "Memory hierarchy includes registers, shared memory, and global memory",
        "Block size affects occupancy and resource utilization",
        "Threads in a block can synchronize and share data"
      ]
    },
    performance: {
      title: "Performance Comparison",
      description: "CUDA-accelerated applications can achieve dramatic speedups compared to CPU implementations.",
      keyPoints: [
        "GPUs contain thousands of simple cores vs. fewer complex CPU cores",
        "Parallel processing allows handling many tasks simultaneously",
        "Machine learning training sees 20-30x speedups",
        "Scientific simulations achieve 15-40x faster results"
      ]
    },
    memory: {
      title: "Memory Access Optimization",
      description: "Memory access patterns significantly impact CUDA application performance.",
      keyPoints: [
        "Global memory coalescing combines thread accesses into fewer transactions",
        "Shared memory provides low-latency access for thread blocks",
        "Optimized access patterns can improve throughput by 10x or more",
        "Avoid strided or random access patterns when possible"
      ]
    },
    workloads: {
      title: "CUDA Application Domains",
      description: "Different workloads benefit from specific CUDA optimization techniques.",
      keyPoints: [
        "Machine learning leverages tensor cores and optimized convolutions",
        "Scientific simulations use domain decomposition and efficient stencils",
        "Financial models parallelize Monte Carlo simulations",
        "Graphics applications accelerate ray tracing and shading"
      ]
    }
  };
  
  // Render the active section content
  const renderContent = () => {
    switch (activeSection) {
      case 'architecture':
        return <GpuArchitecture blockSize={blockSize} showDetails={showDetails} />;
      case 'performance':
        return <PerformanceBenchmark showDetails={showDetails} />;
      case 'memory':
        return <MemoryOptimization blockSize={blockSize} memoryAccess={memoryAccess} showDetails={showDetails} />;
      case 'workloads':
        return <WorkloadSelector workloadType={workloadType} showDetails={showDetails} />;
      default:
        return null;
    }
  };
  
  const activeInfo = infoPanels[activeSection as keyof typeof infoPanels];

  return (
    <div className="min-h-screen w-full bg-nvidia-dark grid-bg overflow-hidden">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          CUDA <span className="text-nvidia-green">Acceleration</span> Visualizer
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main visualization area */}
          <div className="flex-1 card-gradient rounded-lg p-4 h-[600px]">
            {renderContent()}
          </div>
          
          {/* Sidebar with info and controls */}
          <div className="w-full lg:w-80 space-y-6">
            <InfoPanel 
              title={activeInfo.title} 
              description={activeInfo.description} 
              keyPoints={activeInfo.keyPoints} 
              section={activeSection}
            />
            
            <ControlPanel 
              section={activeSection}
              workloadType={workloadType}
              setWorkloadType={setWorkloadType}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              blockSize={blockSize}
              setBlockSize={setBlockSize}
              memoryAccess={memoryAccess}
              setMemoryAccess={setMemoryAccess}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Interactive 3D visualization of CUDA GPU acceleration concepts.
            Adjust controls to explore different scenarios and optimizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
