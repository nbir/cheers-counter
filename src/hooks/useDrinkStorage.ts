
import { useState, useEffect } from "react";

// Define types for our drink data
interface DrinkEntry {
  timestamp: number; // Unix timestamp
}

interface DailyDrinkSummary {
  date: string;      // ISO date string
  totalDrinks: number;
  entries?: DrinkEntry[]; // Added for date details page
}

interface MonthlyDrinkSummary {
  month: string;     // Month in YYYY-MM format
  totalDrinks: number;
}

// Wrapper functions for localStorage to handle errors gracefully
const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const setStorageItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

export function useDrinkStorage() {
  const [drinkHistory, setDrinkHistory] = useState<DrinkEntry[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Delay the localStorage access to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      try {
        const storedHistory = getStorageItem('drinkHistory');
        
        if (storedHistory) {
          setDrinkHistory(JSON.parse(storedHistory));
        }
        
        setIsStorageLoaded(true);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setIsStorageLoaded(true); // Still mark as loaded even on error
      }
    }, 500); // Short delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save data to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (isStorageLoaded) {
      try {
        setStorageItem('drinkHistory', JSON.stringify(drinkHistory));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [drinkHistory, isStorageLoaded]);
  
  // Get the current count of drinks from history
  const getCurrentCount = (): number => {
    return drinkHistory.length;
  };
  
  // Function to increment drink count
  const incrementCount = (maxCount: number) => {
    // Add entry to history
    const newEntry: DrinkEntry = {
      timestamp: Date.now(),
    };
    
    setDrinkHistory(prev => [...prev, newEntry]);
    
    // We always allow incrementing past maxCount
    return true;
  };
  
  // Function to decrement drink count
  const decrementCount = () => {
    if (drinkHistory.length > 0) {
      // Remove the most recent entry
      setDrinkHistory(prev => prev.slice(0, -1));
      return true;
    }
    
    return false;
  };
  
  // Function to add a drink at a specific date and time
  const addDrinkAtDateTime = (dateTimeStr: string) => {
    // Parse the date string to a timestamp
    const timestamp = new Date(dateTimeStr).getTime();
    const now = new Date().getTime();
    
    // Don't allow adding drinks in the future
    if (timestamp > now) {
      return false;
    }
    
    // Add new entry
    const newEntry: DrinkEntry = {
      timestamp
    };
    
    // Sort the history by timestamp after adding the new entry
    const updatedHistory = [...drinkHistory, newEntry].sort((a, b) => a.timestamp - b.timestamp);
    
    // Update state
    setDrinkHistory(updatedHistory);
    
    return true;
  };
  
  // Function to get adjusted date (day starts at 4:01am and ends at 4am)
  const getAdjustedDay = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // If time is between 00:00 and 04:00, consider it part of the previous day
    if (date.getHours() < 4) {
      const prevDay = new Date(date);
      prevDay.setDate(date.getDate() - 1);
      return prevDay.toISOString().split('T')[0]; // Return YYYY-MM-DD
    }
    
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
  };
  
  // Get drink summary for the last 30 days
  const getDailyDrinkSummary = (): DailyDrinkSummary[] => {
    // Create a map to store drinks per day
    const dailyDrinks = new Map<string, number>();
    const entriesByDay = new Map<string, DrinkEntry[]>();
    
    // Get the current date and time
    const now = new Date();
    
    // Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    // Process history entries to count drinks per day
    drinkHistory.forEach((entry) => {
      const entryDate = new Date(entry.timestamp);
      
      // Only consider entries in the last 30 days
      if (entryDate >= thirtyDaysAgo) {
        const day = getAdjustedDay(entry.timestamp);
        
        // Store entries by day for detailed view
        if (!entriesByDay.has(day)) {
          entriesByDay.set(day, []);
        }
        entriesByDay.get(day)!.push(entry);
        
        // Increment the count for the day
        dailyDrinks.set(day, (dailyDrinks.get(day) || 0) + 1);
      }
    });
    
    // Convert map to array and filter out days with 0 drinks
    const summaryArray = Array.from(dailyDrinks.entries())
      .map(([date, drinks]) => ({ 
        date, 
        totalDrinks: drinks,
        entries: entriesByDay.get(date) 
      }))
      .filter(day => day.totalDrinks > 0)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date, newest first
    
    return summaryArray;
  };
  
  // Get drink summary by month
  const getMonthlyDrinkSummary = (): MonthlyDrinkSummary[] => {
    const dailySummary = getDailyDrinkSummary();
    const monthlyDrinks = new Map<string, number>();
    
    dailySummary.forEach(day => {
      const month = day.date.substring(0, 7); // Get YYYY-MM from YYYY-MM-DD
      monthlyDrinks.set(month, (monthlyDrinks.get(month) || 0) + day.totalDrinks);
    });
    
    // Convert map to array
    const summaryArray = Array.from(monthlyDrinks.entries())
      .map(([month, drinks]) => ({ month, totalDrinks: drinks }))
      .sort((a, b) => b.month.localeCompare(a.month)); // Sort by month, newest first
      
    return summaryArray;
  };
  
  // Get today's drink count
  const getTodaysDrinkCount = (): number => {
    const today = getAdjustedDay(Date.now());
    const dailySummary = getDailyDrinkSummary();
    const todaySummary = dailySummary.find(day => day.date === today);
    return todaySummary ? todaySummary.totalDrinks : 0;
  };
  
  // Get entries for a specific date
  const getEntriesForDate = (dateStr: string): DrinkEntry[] => {
    // Filter all entries by the adjusted day
    return drinkHistory.filter(entry => getAdjustedDay(entry.timestamp) === dateStr);
  };
  
  // Delete drinks for a specific date
  const deleteDrinksByDate = (dateToDelete: string): void => {
    // We need to identify all entries that belong to this date and remove them
    setDrinkHistory(prev => 
      prev.filter(entry => getAdjustedDay(entry.timestamp) !== dateToDelete)
    );
  };
  
  // Delete drinks for a specific month
  const deleteDrinksByMonth = (monthToDelete: string): void => {
    // Filter out entries from the specified month
    setDrinkHistory(prev => 
      prev.filter(entry => !getAdjustedDay(entry.timestamp).startsWith(monthToDelete))
    );
  };
  
  // Get date for URL format
  const getDateForUrl = (date: string): string => {
    // Convert YYYY-MM-DD to YYYYMMDD
    return date.replace(/-/g, '');
  };
  
  // Parse URL date to ISO format
  const parseUrlDate = (urlDate: string): string => {
    // Convert YYYYMMDD to YYYY-MM-DD
    if (urlDate.length === 8) {
      return `${urlDate.substring(0, 4)}-${urlDate.substring(4, 6)}-${urlDate.substring(6, 8)}`;
    }
    return urlDate;
  };
  
  return {
    count: getCurrentCount(),
    incrementCount,
    decrementCount,
    addDrinkAtDateTime,
    getDailyDrinkSummary,
    getMonthlyDrinkSummary,
    getTodaysDrinkCount,
    deleteDrinksByDate,
    deleteDrinksByMonth,
    getEntriesForDate,
    getDateForUrl,
    parseUrlDate,
    getAdjustedDay
  };
}
