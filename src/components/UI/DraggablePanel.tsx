
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DraggablePanelProps {
  children: React.ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  bounds?: 'parent' | 'window';
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({
  children,
  className,
  initialPosition = { x: 0, y: 0 },
  bounds = 'parent'
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Handle mouse move to update position while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current && containerRef.current) {
        const containerRect = bounds === 'parent' 
          ? containerRef.current.getBoundingClientRect() 
          : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        
        const panelRect = panelRef.current.getBoundingClientRect();
        
        // Calculate new position
        let newX = e.clientX - containerRect.left - dragOffset.x;
        let newY = e.clientY - containerRect.top - dragOffset.y;
        
        // Apply bounds constraints
        newX = Math.max(0, Math.min(newX, containerRect.width - panelRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - panelRect.height));
        
        setPosition({ x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, bounds]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        ref={panelRef}
        className={cn(
          "absolute z-10 cursor-move transition-colors", 
          isDragging ? "border-nvidia-green" : "border-transparent",
          className
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`
        }}
      >
        <div 
          className="p-1 bg-nvidia-green/80 rounded-t-sm flex justify-center items-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="w-10 h-1 bg-white/50 rounded-full"></div>
        </div>
        <div className="panel-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DraggablePanel;
