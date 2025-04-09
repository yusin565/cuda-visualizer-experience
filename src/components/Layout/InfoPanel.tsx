
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InfoPanelProps {
  title: string;
  description: string;
  keyPoints: string[];
  section: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ 
  title, 
  description, 
  keyPoints,
  section
}) => {
  return (
    <Card className="card-gradient w-full max-w-md h-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-nvidia-green nvidia-glow">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
      <Separator className="bg-nvidia-green/30" />
      <CardContent className="pt-4">
        <h4 className="text-sm font-medium text-nvidia-green mb-2">Key Insights:</h4>
        <ul className="space-y-2">
          {keyPoints.map((point, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <span className="text-nvidia-green mt-0.5">►</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        
        {section === 'performance' && (
          <div className="mt-4 pt-4 border-t border-nvidia-green/30">
            <h4 className="text-sm font-medium text-nvidia-green mb-2">Performance Speedup:</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">ML Training</span>
                  <span className="text-xs text-nvidia-green">20-30x</span>
                </div>
                <div className="w-full bg-nvidia-gray rounded-full h-2">
                  <div className="bg-nvidia-green h-2 rounded-full animate-pulse-glow" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Monte Carlo Simulation</span>
                  <span className="text-xs text-nvidia-green">15-40x</span>
                </div>
                <div className="w-full bg-nvidia-gray rounded-full h-2">
                  <div className="bg-nvidia-green h-2 rounded-full animate-pulse-glow" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Image Processing</span>
                  <span className="text-xs text-nvidia-green">10-25x</span>
                </div>
                <div className="w-full bg-nvidia-gray rounded-full h-2">
                  <div className="bg-nvidia-green h-2 rounded-full animate-pulse-glow" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoPanel;
