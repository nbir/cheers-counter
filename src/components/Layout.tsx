
import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Link } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Moon, Sun, Droplet, Waves } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

// Create a global event for spill toggle changes
export const SPILL_TOGGLE_EVENT = "spillToggleChange";

interface LayoutProps {
  children: React.ReactNode;
}

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Wait for component to mount to avoid hydration issues with theme
  React.useEffect(() => {
    setMounted(true);
    // Set default theme to dark if no preference is stored
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      setTheme('dark');
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleTheme}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={16} className="text-gray-400" />
      ) : (
        <Moon size={16} className="text-gray-400" />
      )}
      <span className="text-sm">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};

const SpillToggle: React.FC = () => {
  const [showSpill, setShowSpill] = useState<boolean>(() => {
    try {
      const savedSpill = localStorage.getItem('showSpill');
      return savedSpill !== null ? JSON.parse(savedSpill) : true;
    } catch (error) {
      return true;
    }
  });
  
  const [mounted, setMounted] = React.useState(false);

  // Wait for component to mount to avoid hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('showSpill', JSON.stringify(showSpill));
        
        // Dispatch a custom event when the toggle changes
        const event = new CustomEvent(SPILL_TOGGLE_EVENT, { 
          detail: { showSpill } 
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Error saving spill preference to localStorage:', error);
      }
    }
  }, [showSpill, mounted]);

  const toggleSpill = () => {
    setShowSpill(!showSpill);
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleSpill}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      aria-label={showSpill ? 'Hide spill effect' : 'Show spill effect'}
    >
      {showSpill ? (
        <Droplet size={16} className="text-gray-400" />
      ) : (
        <Waves size={16} className="text-gray-400" />
      )}
      <span className="text-sm">{showSpill ? 'Hide Spill' : 'Show Spill'}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Wait for the localStorage to be accessible
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Match the delay from useDrinkStorage
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex flex-col pt-16">
        {/* Dynamic Island padding - added extra padding at the top */}
        <div className="h-8 w-full fixed top-0 left-0 bg-transparent z-50"></div>
        
        {/* Glass morphism effect for the top part */}
        <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
        
        {/* Add Toaster component for notifications */}
        <Toaster position="top-center" className="pt-16" />
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            {isLoading ? (
              <div className="space-y-6 w-full">
                <Skeleton className="h-12 w-40 mx-auto mb-8" />
                <div className="flex justify-between">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <Skeleton className="h-64 w-28 mx-auto" />
                  <Skeleton className="h-14 w-14 rounded-full" />
                </div>
                <Skeleton className="h-6 w-40 mx-auto mt-4" />
                <Skeleton className="h-64 w-full mt-8" />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
        
        {/* Footer with theme toggle, subtle branding and links */}
        <footer className="py-6 px-4 text-center text-sm text-gray-400 dark:text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
            <ThemeToggle />
            <SpillToggle />
          </div>
          <p>BeerMeTwice • Drink Responsibly</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/my-data" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 underline">
              My Data
            </Link>
            <Link to="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 underline">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
