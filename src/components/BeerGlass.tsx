
import React, { useEffect, useRef } from "react";

interface BeerGlassProps {
  count: number;
  maxCount?: number;
  showSpill?: boolean;
}

const BeerGlass: React.FC<BeerGlassProps> = ({ count, maxCount = 12, showSpill = true }) => {
  // Cap the fill percentage at 100%, but allow count to go higher than maxCount
  const fillPercentage = Math.min(Math.max((Math.min(count, maxCount) / maxCount) * 100, 0), 100);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  
  // Calculate spill intensity based on count
  const getSpillIntensity = () => {
    if (count < 8) return 0;
    if (count <= 12) return (count - 8) / 4; // 0% at 8 drinks, 100% at 12 drinks
    return 1 + (count - 12) / 10; // More than 100% for counts over 12
  };
  
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
    
    const createSpill = () => {
      if (!spillRef.current || !showSpill) return;
      
      // Clear previous spill bubbles
      while (spillRef.current.firstChild) {
        spillRef.current.removeChild(spillRef.current.firstChild);
      }
      
      const spillIntensity = getSpillIntensity();
      
      // Don't create spill if intensity is 0
      if (spillIntensity <= 0) return;
      
      // Number of bubbles based on intensity
      const numBubbles = Math.floor(10 * spillIntensity) + 5;
      
      for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement("div");
        const size = Math.floor(Math.random() * 10) + 5;
        const left = Math.floor(Math.random() * 100);
        const top = Math.floor(Math.random() * 100);
        const opacity = Math.random() * 0.4 + 0.3;
        const animDuration = (Math.random() * 5 + 5) * (1 / spillIntensity);
        
        bubble.className = "spill-bubble absolute rounded-full";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.top = `${top}%`;
        bubble.style.opacity = `${opacity}`;
        bubble.style.backgroundColor = "rgba(255, 220, 150, 0.7)";
        bubble.style.boxShadow = "0 0 5px rgba(255, 220, 150, 0.5)";
        bubble.style.animation = `float ${animDuration}s ease-in-out infinite`;
        
        spillRef.current.appendChild(bubble);
      }
    };
    
    createBubbles();
    createSpill();
    
    // Recreate bubbles periodically
    const bubbleInterval = setInterval(createBubbles, 3000);
    const spillInterval = setInterval(createSpill, 4000);
    
    return () => {
      clearInterval(bubbleInterval);
      clearInterval(spillInterval);
    };
  }, [count, showSpill]);
  
  return (
    <div className="relative w-full">
      {/* Spill container (positioned above the glass) */}
      {showSpill && count >= 8 && (
        <div 
          ref={spillRef}
          className="spill-container absolute -top-40 left-1/2 transform -translate-x-1/2 w-screen h-40 overflow-hidden"
          style={{
            opacity: getSpillIntensity()
          }}
        ></div>
      )}
      
      <div className="beer-glass-hefeweizen w-full max-w-[120px] h-[280px] mx-auto glass-effect" style={{ position: 'relative' }}>
        {/* Glass shading/highlights */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/10 opacity-50 dark:from-white/20 dark:to-black/20"></div>
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/30 to-transparent dark:from-white/10"></div>
        
        {/* Beer fill with dynamic height */}
        <div 
          className="beer-fill"
          style={{ 
            height: `${fillPercentage}%`,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <div className="beer-bubbles" ref={bubbleRef} style={{ position: 'absolute', inset: 0 }}></div>
          
          {/* Foam */}
          {count > 0 && (
            <div 
              className="beer-foam"
              style={{ 
                bottom: '98%',
                position: 'absolute',
                left: 0,
                right: 0
              }}
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
    </div>
  );
};

export default BeerGlass;
