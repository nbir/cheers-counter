import { useState, useEffect } from "react";

// Define types for our drink data
interface DrinkEntry {
  timestamp: number; // Unix timestamp
  count: number;     // Number of drinks at that point
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
  
  // Function to increment drink count, removing the maxCount limit
  const incrementCount = (maxCount: number) => {
    // Keep the maxCount parameter for backward compatibility, but don't use it to limit
    const newCount = count + 1;
    setCount(newCount);
    
    // Add entry to history
    const newEntry: DrinkEntry = {
      timestamp: Date.now(),
      count: newCount,
    };
    
    setDrinkHistory(prev => [...prev, newEntry]);
    
    // Return true - we now always allow incrementing past maxCount
    return true;
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
  
  // Function to get adjusted date (day starts at 4:01am and ends at 4am)
  const getAdjustedDay = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // If time is between 00:00 and 04:00, consider it part of the previous day
    if (date.getHours() < 4) {
      date.setDate(date.getDate() - 1);
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
    drinkHistory.forEach((entry, index) => {
      const entryDate = new Date(entry.timestamp);
      
      // Only consider entries in the last 30 days
      if (entryDate >= thirtyDaysAgo) {
        const day = getAdjustedDay(entry.timestamp);
        
        // Store entries by day for detailed view
        if (!entriesByDay.has(day)) {
          entriesByDay.set(day, []);
        }
        entriesByDay.get(day)!.push(entry);
        
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
    // We need to identify all entries that belong to this date and remove their effect
    const entriesToModify: DrinkEntry[] = [];
    
    // Group all entries by their adjusted day
    const entriesByDay = new Map<string, DrinkEntry[]>();
    
    drinkHistory.forEach(entry => {
      const day = getAdjustedDay(entry.timestamp);
      if (!entriesByDay.has(day)) {
        entriesByDay.set(day, []);
      }
      entriesByDay.get(day)!.push(entry);
    });
    
    // Filter out the deleted date and any entries that came after it
    const remainingEntries = drinkHistory.filter(entry => {
      const day = getAdjustedDay(entry.timestamp);
      return day !== dateToDelete;
    });
    
    // Update the history and recalculate the current count
    setDrinkHistory(remainingEntries);
    
    // If today's data was deleted, reset the count to 0
    if (dateToDelete === getAdjustedDay(Date.now())) {
      setCount(0);
    } else {
      // Otherwise, recalculate the current count based on remaining entries
      const lastEntry = remainingEntries[remainingEntries.length - 1];
      setCount(lastEntry ? lastEntry.count : 0);
    }
  };
  
  // Delete drinks for a specific month
  const deleteDrinksByMonth = (monthToDelete: string): void => {
    // Filter out entries from the specified month
    const remainingEntries = drinkHistory.filter(entry => {
      const day = getAdjustedDay(entry.timestamp);
      return !day.startsWith(monthToDelete);
    });
    
    // Update the history
    setDrinkHistory(remainingEntries);
    
    // Check if current month was deleted
    const currentMonth = getAdjustedDay(Date.now()).substring(0, 7);
    
    // If current month's data was deleted, reset the count to 0
    if (monthToDelete === currentMonth) {
      setCount(0);
    } else {
      // Otherwise, recalculate the current count based on remaining entries
      const lastEntry = remainingEntries[remainingEntries.length - 1];
      setCount(lastEntry ? lastEntry.count : 0);
    }
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
    count,
    incrementCount,
    decrementCount,
    getDailyDrinkSummary,
    getMonthlyDrinkSummary,
    getTodaysDrinkCount,
    deleteDrinksByDate,
    deleteDrinksByMonth,
    getEntriesForDate,
    getDateForUrl,
    parseUrlDate,
  };
}
