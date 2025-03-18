
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import BeerGlass from "./BeerGlass";
import { toast } from "sonner";

const DrinkCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const maxCount = 12;
  
  const incrementCount = () => {
    if (count < maxCount) {
      setCount(prev => prev + 1);
      
      // Show different messages based on count
      if (count === 0) {
        toast("First drink! Cheers! 🍻");
      } else if (count === 1) {
        toast("Two beers down!");
      } else if (count === maxCount - 1) {
        toast("Last one! Drink responsibly!");
      }
    } else {
      toast("Maybe that's enough for today?", {
        description: "Remember to drink responsibly"
      });
    }
  };
  
  const decrementCount = () => {
    if (count > 0) {
      setCount(prev => prev - 1);
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md flex items-center justify-between gap-6 mb-8">
        {/* Title with subtle animation */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mx-auto animate-float">
          2BeersDown
        </h1>
      </div>
      
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-6 gap-4">
        {/* Minus button */}
        <button 
          onClick={decrementCount} 
          disabled={count === 0}
          className="counter-btn"
          aria-label="Decrease drink count"
        >
          <Minus size={24} className={count === 0 ? "text-gray-300" : "text-gray-800"} />
        </button>
        
        {/* Beer glass */}
        <div className="flex-1 flex justify-center py-4">
          <BeerGlass count={count} maxCount={maxCount} />
        </div>
        
        {/* Plus button */}
        <button 
          onClick={incrementCount}
          disabled={count === maxCount} 
          className="counter-btn"
          aria-label="Increase drink count"
        >
          <Plus size={24} className={count === maxCount ? "text-gray-300" : "text-gray-800"} />
        </button>
      </div>
      
      {/* Counter label */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-500">
          {count === 0 ? "No drinks yet" : count === 1 ? "1 drink" : `${count} drinks`}
        </p>
        {count >= 3 && (
          <p className="text-sm text-amber-600 mt-1 font-medium">
            Remember to drink responsibly
          </p>
        )}
      </div>
    </div>
  );
};

export default DrinkCounter;
