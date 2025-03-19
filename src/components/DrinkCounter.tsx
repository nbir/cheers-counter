
import React, { useState } from "react";
import { Plus, Minus, AlertTriangle, Beer } from "lucide-react";
import BeerGlass from "./BeerGlass";
import { toast } from "sonner";
import { useDrinkStorage } from "@/hooks/useDrinkStorage";
import DrinkHistoryTable from "./DrinkHistoryTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DrinkCounter: React.FC = () => {
  const maxCount = 12;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { 
    count, 
    incrementCount, 
    decrementCount, 
    getDailyDrinkSummary, 
    getTodaysDrinkCount 
  } = useDrinkStorage();
  
  const todayCount = getTodaysDrinkCount();
  
  const handleIncrement = () => {
    const success = incrementCount(maxCount);
    
    // Show different messages based on count
    if (success) {
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
  
  const handleDecrementRequest = () => {
    if (count > 0) {
      setShowConfirmDialog(true);
    }
  };
  
  const handleConfirmDecrement = () => {
    decrementCount();
    setShowConfirmDialog(false);
  };
  
  const drinkSummary = getDailyDrinkSummary();
  
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md flex items-center justify-between gap-6 mb-8">
        {/* Title with updated font and icon */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mx-auto animate-float font-display flex items-center gap-2">
          <Beer size={32} className="text-amber-500" />
          <span>BeerMeTwice</span>
        </h1>
      </div>
      
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-6 gap-4">
        {/* Minus button */}
        <button 
          onClick={handleDecrementRequest} 
          disabled={count === 0}
          className="counter-btn"
          aria-label="Decrease drink count"
        >
          <Minus size={24} className={count === 0 ? "text-gray-300" : "text-gray-800"} />
        </button>
        
        {/* Beer glass - now with today's count */}
        <div className="flex-1 flex justify-center py-4">
          <BeerGlass count={todayCount} maxCount={maxCount} />
        </div>
        
        {/* Plus button */}
        <button 
          onClick={handleIncrement}
          disabled={count === maxCount} 
          className="counter-btn"
          aria-label="Increase drink count"
        >
          <Plus size={24} className={count === maxCount ? "text-gray-300" : "text-gray-800"} />
        </button>
      </div>
      
      {/* Counter label - showing today's count */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-500">
          {todayCount === 0 ? "No drinks today" : todayCount === 1 ? "1 drink today" : `${todayCount} drinks today`}
        </p>
        {todayCount >= 3 && (
          <p className="text-sm text-amber-600 mt-1 font-medium">
            Remember to drink responsibly
          </p>
        )}
      </div>
      
      {/* Drink history table */}
      <DrinkHistoryTable drinkSummary={drinkSummary} />
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500 h-5 w-5" />
              Remove Drink?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove a drink from your count?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDecrement}>
              Yes, Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DrinkCounter;
