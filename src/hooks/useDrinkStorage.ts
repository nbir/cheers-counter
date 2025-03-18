
import { useState, useEffect } from "react";

// Define types for our drink data
interface DrinkEntry {
  timestamp: number; // Unix timestamp
  count: number;     // Number of drinks at that point
}

interface DailyDrinkSummary {
  date: string;      // ISO date string
  totalDrinks: number;
}

export function useDrinkStorage() {
  const [count, setCount] = useState<number>(0);
  const [drinkHistory, setDrinkHistory] = useState<DrinkEntry[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('currentDrinkCount');
      const storedHistory = localStorage.getItem('drinkHistory');
      
      if (storedCount) {
        setCount(parseInt(storedCount, 10));
      }
      
      if (storedHistory) {
        setDrinkHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('currentDrinkCount', count.toString());
      localStorage.setItem('drinkHistory', JSON.stringify(drinkHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [count, drinkHistory]);
  
  // Function to increment drink count
  const incrementCount = (maxCount: number) => {
    if (count < maxCount) {
      const newCount = count + 1;
      setCount(newCount);
      
      // Add entry to history
      const newEntry: DrinkEntry = {
        timestamp: Date.now(),
        count: newCount,
      };
      
      setDrinkHistory(prev => [...prev, newEntry]);
    }
    
    return count < maxCount;
  };
  
  // Function to decrement drink count
  const decrementCount = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      
      // Add entry to history
      const newEntry: DrinkEntry = {
        timestamp: Date.now(),
        count: newCount,
      };
      
      setDrinkHistory(prev => [...prev, newEntry]);
    }
    
    return count > 0;
  };
  
  // Get drink summary for the last 30 days
  const getDailyDrinkSummary = (): DailyDrinkSummary[] => {
    // Create a map to store drinks per day
    const dailyDrinks = new Map<string, number>();
    
    // Get the current date and time
    const now = new Date();
    
    // Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Function to get the adjusted date (day starts at 4:01am and ends at 4am)
    const getAdjustedDay = (timestamp: number): string => {
      const date = new Date(timestamp);
      
      // If time is between 00:00 and 04:00, consider it part of the previous day
      if (date.getHours() < 4) {
        date.setDate(date.getDate() - 1);
      }
      
      return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
    };
    
    // Process history entries to count drinks per day
    drinkHistory.forEach((entry, index) => {
      const entryDate = new Date(entry.timestamp);
      
      // Only consider entries in the last 30 days
      if (entryDate >= thirtyDaysAgo) {
        const day = getAdjustedDay(entry.timestamp);
        
        // If this is the first entry or if it's an entry with a different count than the previous
        if (index === 0 || entry.count !== drinkHistory[index - 1]?.count) {
          const countChange = index === 0 
            ? entry.count 
            : entry.count - drinkHistory[index - 1].count;
          
          // Increment/decrement the count for the day
          dailyDrinks.set(day, (dailyDrinks.get(day) || 0) + countChange);
        }
      }
    });
    
    // Convert map to array and filter out days with 0 drinks
    const summaryArray = Array.from(dailyDrinks.entries())
      .map(([date, drinks]) => ({ date, totalDrinks: drinks }))
      .filter(day => day.totalDrinks > 0)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date, newest first
    
    return summaryArray;
  };
  
  return {
    count,
    incrementCount,
    decrementCount,
    getDailyDrinkSummary,
  };
}
