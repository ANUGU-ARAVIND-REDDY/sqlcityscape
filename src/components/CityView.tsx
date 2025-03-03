
import React, { useEffect, useRef } from 'react';

interface Building {
  id: number;
  type: 'residential' | 'commercial' | 'industrial';
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
}

interface CityViewProps {
  buildings?: Building[];
}

const defaultBuildings: Building[] = [
  { id: 1, type: 'residential', height: 5, width: 2, x: 2, y: 0, color: '#3B82F6' },
  { id: 2, type: 'commercial', height: 7, width: 3, x: 6, y: 1, color: '#10B981' },
  { id: 3, type: 'residential', height: 4, width: 2, x: 11, y: 0, color: '#3B82F6' },
  { id: 4, type: 'industrial', height: 3, width: 4, x: 0, y: 2, color: '#F59E0B' },
  { id: 5, type: 'commercial', height: 6, width: 3, x: 15, y: 0, color: '#10B981' },
];

const CityView: React.FC<CityViewProps> = ({ buildings = defaultBuildings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Draw the city
    const drawCity = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      skyGradient.addColorStop(0, '#E0F2FE');
      skyGradient.addColorStop(1, '#BFDBFE');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height * 0.7);
      
      // Draw ground
      const groundGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      groundGradient.addColorStop(0, '#DCFCE7');
      groundGradient.addColorStop(1, '#BBF7D0');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
      
      // Draw grid for reference
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      const gridSize = width / 20;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, height * 0.7);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid line
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.lineTo(width, height * 0.7);
      ctx.stroke();
      
      // Sort buildings by y-coordinate to handle overlapping
      const sortedBuildings = [...buildings].sort((a, b) => a.y - b.y);
      
      // Draw buildings
      sortedBuildings.forEach(building => {
        const baseHeight = height * 0.7; // Ground level
        const buildingWidth = building.width * gridSize;
        const buildingHeight = building.height * 20;
        const baseX = building.x * gridSize;
        const baseY = baseHeight - building.y * 10;
        
        // Draw building
        ctx.fillStyle = building.color;
        ctx.fillRect(baseX, baseY - buildingHeight, buildingWidth, buildingHeight);
        
        // Draw windows
        ctx.fillStyle = '#FFFFFF';
        const windowSize = 5;
        const windowSpacing = 10;
        
        for (let floor = 1; floor <= building.height; floor++) {
          const floorY = baseY - floor * (windowSize + windowSpacing);
          
          for (let window = 1; window <= building.width * 2; window++) {
            const windowX = baseX + window * windowSpacing - windowSize;
            ctx.fillRect(windowX, floorY, windowSize, windowSize);
          }
        }
        
        // Draw roof
        ctx.fillStyle = darkenColor(building.color, 20);
        ctx.fillRect(baseX, baseY - buildingHeight - 5, buildingWidth, 5);
      });
      
      // Add clouds for decoration
      drawClouds(ctx, width, height);
    };
    
    // Helper function to darken a color
    const darkenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, (num >> 16) - amt);
      const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
      const B = Math.max(0, (num & 0x0000FF) - amt);
      return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    };
    
    // Draw decorative clouds
    const drawClouds = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      // Cloud positions
      const clouds = [
        { x: width * 0.1, y: height * 0.2, size: 20 },
        { x: width * 0.5, y: height * 0.15, size: 25 },
        { x: width * 0.8, y: height * 0.25, size: 15 },
      ];
      
      clouds.forEach(cloud => {
        drawCloud(ctx, cloud.x, cloud.y, cloud.size);
      });
    };
    
    // Draw a single cloud
    const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 1.5, y, size * 1.2, 0, Math.PI * 2);
      ctx.arc(x + size * 0.5, y - size * 0.8, size * 0.9, 0, Math.PI * 2);
      ctx.arc(x + size * 2.2, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    };
    
    // Draw initial city
    drawCity();
    
    // Animation loop for subtle movements
    let animationFrame: number;
    
    const animate = () => {
      // Redraw the city (could add animation logic here)
      drawCity();
      animationFrame = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [buildings]);

  return (
    <div className="city-view w-full h-full rounded-lg overflow-hidden shadow-lg">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default CityView;
