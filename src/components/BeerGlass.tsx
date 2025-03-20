
import React, { useEffect, useRef, useState } from "react";
import { SPILL_TOGGLE_EVENT } from "./Layout";

// Define the shape types
export type GlassShape = "modern" | "hefeweizen" | "nonic";
export const GLASS_SHAPE_EVENT = "glassShapeChange";

interface BeerGlassProps {
  count: number;
  maxCount?: number;
  showSpill?: boolean;
}

const BeerGlass: React.FC<BeerGlassProps> = ({ count, maxCount = 12, showSpill = true }) => {
  const [spillEnabled, setSpillEnabled] = useState<boolean>(true);
  const [glassShape, setGlassShape] = useState<GlassShape>("nonic");
  // Cap the fill percentage at 100%, but allow count to go higher than maxCount
  const fillPercentage = Math.min(Math.max((Math.min(count, maxCount) / maxCount) * 100, 0), 100);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const spillRef = useRef<HTMLDivElement>(null);
  
  // Read settings from localStorage when component mounts
  useEffect(() => {
    try {
      // Read spill setting
      const savedSpill = localStorage.getItem('showSpill');
      if (savedSpill !== null) {
        setSpillEnabled(JSON.parse(savedSpill));
      }
      
      // Read glass shape setting
      const savedShape = localStorage.getItem('glassShape');
      if (savedShape !== null && ['modern', 'hefeweizen', 'nonic'].includes(savedShape)) {
        setGlassShape(savedShape as GlassShape);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
    }
    
    // Add listener for the custom spill toggle event
    const handleSpillToggle = (e: CustomEvent<{showSpill: boolean}>) => {
      setSpillEnabled(e.detail.showSpill);
    };
    
    // Add listener for the glass shape change event
    const handleGlassShapeChange = (e: CustomEvent<{shape: GlassShape}>) => {
      setGlassShape(e.detail.shape);
    };
    
    window.addEventListener(SPILL_TOGGLE_EVENT, handleSpillToggle as EventListener);
    window.addEventListener(GLASS_SHAPE_EVENT, handleGlassShapeChange as EventListener);
    
    return () => {
      window.removeEventListener(SPILL_TOGGLE_EVENT, handleSpillToggle as EventListener);
      window.removeEventListener(GLASS_SHAPE_EVENT, handleGlassShapeChange as EventListener);
    };
  }, []);
  
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
      if (!spillRef.current || !spillEnabled || !showSpill) return;
      
      // Clear previous spill bubbles
      while (spillRef.current.firstChild) {
        spillRef.current.removeChild(spillRef.current.firstChild);
      }
      
      const spillIntensity = getSpillIntensity();
      
      // Don't create spill if intensity is 0
      if (spillIntensity <= 0) return;
      
      // Significantly increased number of bubbles to fill the entire page
      const numBubbles = Math.floor(100 * spillIntensity) + 50;
      
      for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement("div");
        
        // Create varying sizes of bubbles
        const size = Math.floor(Math.random() * 20) + 5;
        
        // Calculate distance from center (0 = at center, 1 = far away)
        // Use an exponential distribution to make more bubbles appear near the glass
        const distanceFromCenter = Math.pow(Math.random(), 2);
        
        // Convert to position on screen (central area is around the glass)
        const horizontalSpread = 100; // How wide the bubbles spread horizontally
        const distFromCenter = (Math.random() * 2 - 1) * horizontalSpread * distanceFromCenter;
        const left = 50 + distFromCenter; // Position relative to center
        
        // Vertical position - spread throughout the container 
        // Closer to center = lower position (above the glass)
        // Further from center = higher position (top of page)
        const verticalPosition = 20 + (80 * distanceFromCenter); // 20-100% from the top
        
        // Bubble opacity decreases as distance increases
        const opacity = Math.max(0.1, 0.8 - (distanceFromCenter * 0.6));
        
        // Animation duration varies - closer bubbles rise faster
        const animDuration = (Math.random() * 10 + 5) * (1 + distanceFromCenter);
        
        bubble.className = "spill-bubble absolute rounded-full";
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.top = `${verticalPosition}%`;
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
    
    // Listen for changes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'showSpill' && e.newValue !== null) {
        setSpillEnabled(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(bubbleInterval);
      clearInterval(spillInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [count, showSpill, spillEnabled]);
  
  return (
    <div className="relative w-full">
      {/* Spill container - expanded to cover the entire page above the footer */}
      {showSpill && spillEnabled && count >= 8 && (
        <div 
          ref={spillRef}
          className="spill-container fixed top-0 left-0 w-screen h-[calc(100vh-80px)] overflow-hidden pointer-events-none"
          style={{
            opacity: getSpillIntensity(),
            zIndex: 40 // High enough to be above most content but below header/nav
          }}
        ></div>
      )}
      
      <div className={`beer-glass-${glassShape} w-full max-w-[120px] h-[280px] mx-auto glass-effect`} style={{ position: 'relative' }}>
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
