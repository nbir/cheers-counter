
import React, { useState } from "react";
import { Plus, Minus, AlertTriangle, Beer, Droplet, Waves } from "lucide-react";
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
    
    if (success) {
      const newCount = todayCount + 1;
      
      if (newCount === 1) {
        toast("First drink! Cheers! 🍻");
      } else if (newCount === 2) {
        toast("Two beers down!");
      } else if (newCount === 4) {
        toast("Four beers! Halfway to eight!");
      } else if (newCount === 8) {
        toast("Eight beers! That's quite a lot!");
      } else if (newCount === 10) {
        toast("Ten beers! Remember to drink water too!");
      } else if (newCount >= maxCount) {
        toast("That's a lot of beers! Drink responsibly!");
      }
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mx-auto animate-float font-display flex items-center gap-2">
          <Beer size={32} className="text-amber-500" />
          <span>BeerMeTwice</span>
        </h1>
      </div>
      
      <div className="w-full max-w-md flex items-center justify-between px-4 mb-6 gap-4">
        <button 
          onClick={handleDecrementRequest} 
          disabled={count === 0}
          className="counter-btn"
          aria-label="Decrease drink count"
        >
          <Minus size={24} className={count === 0 ? "text-gray-300 dark:text-gray-600" : "text-gray-800 dark:text-gray-200"} />
        </button>
        
        <div className="flex-1 flex justify-center py-4">
          <BeerGlass count={todayCount} maxCount={maxCount} />
        </div>
        
        <button 
          onClick={handleIncrement}
          className="counter-btn"
          aria-label="Increase drink count"
        >
          <Plus size={24} className="text-gray-800 dark:text-gray-200" />
        </button>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {todayCount === 0 ? "No drinks today" : todayCount === 1 ? "1 drink today" : `${todayCount} drinks today`}
        </p>
        {todayCount >= 3 && (
          <p className="text-sm text-amber-600 dark:text-amber-500 mt-1 font-medium">
            Remember to drink responsibly
          </p>
        )}
      </div>
      
      <DrinkHistoryTable drinkSummary={drinkSummary} />
      
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
