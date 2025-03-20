
import React, { useEffect, useRef } from "react";

interface BeerGlassProps {
  count: number;
  maxCount?: number;
}

const BeerGlass: React.FC<BeerGlassProps> = ({ count, maxCount = 12 }) => {
  // Cap the fill percentage at 100%, but allow count to go higher than maxCount
  const fillPercentage = Math.min(Math.max((Math.min(count, maxCount) / maxCount) * 100, 0), 100);
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const createBubbles = () => {
      if (!bubbleRef.current) return;
      
      // Clear previous bubbles
      while (bubbleRef.current.firstChild) {
        bubbleRef.current.removeChild(bubbleRef.current.firstChild);
      }
      
      // Only create bubbles if there's beer
      if (count > 0) {
        // Create random bubbles
        const numBubbles = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < numBubbles; i++) {
          const bubble = document.createElement("div");
          const size = Math.floor(Math.random() * 8) + 4;
          const left = Math.floor(Math.random() * 90) + 5;
          const bottom = Math.floor(Math.random() * 80);
          const delay = Math.random() * 2;
          
          bubble.className = "bubble";
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          bubble.style.left = `${left}%`;
          bubble.style.bottom = `${bottom}%`;
          bubble.style.animationDelay = `${delay}s`;
          
          if (size < 6) {
            bubble.classList.add("animate-bubble-small");
          } else if (size < 9) {
            bubble.classList.add("animate-bubble-medium");
          } else {
            bubble.classList.add("animate-bubble-large");
          }
          
          bubbleRef.current.appendChild(bubble);
        }
      }
    };
    
    createBubbles();
    
    // Recreate bubbles periodically
    const interval = setInterval(createBubbles, 3000);
    
    return () => clearInterval(interval);
  }, [count]);
  
  return (
    <div className="beer-glass-hefeweizen relative w-full max-w-[120px] h-[280px] mx-auto overflow-hidden glass-effect">
      {/* Glass shading/highlights */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/10 opacity-50"></div>
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 to-transparent"></div>
      
      {/* Beer fill with dynamic height */}
      <div 
        className="beer-fill"
        style={{ 
          '--fill-height': `${fillPercentage}%` 
        } as React.CSSProperties}
      >
        <div className="beer-bubbles" ref={bubbleRef}></div>
        
        {/* Foam */}
        {count > 0 && (
          <div 
            className="beer-foam" 
            style={{ bottom: '98%' }}
          ></div>
        )}
      </div>
      
      {/* Count display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 text-5xl font-bold text-white shadow-text">
          {count}
        </div>
      </div>
    </div>
  );
};

export default BeerGlass;
