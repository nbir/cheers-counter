
import React from "react";
import { Toaster } from "sonner";
import { Link } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex flex-col pt-16">
        {/* Dynamic Island padding - added extra padding at the top */}
        <div className="h-8 w-full fixed top-0 left-0 bg-transparent z-50"></div>
        
        {/* Glass morphism effect for the top part */}
        <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
        
        {/* Add Toaster component for notifications */}
        <Toaster position="top-center" className="pt-12" />
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer with theme toggle, subtle branding and links */}
        <footer className="py-6 px-4 text-center text-sm text-gray-400 dark:text-gray-500">
          <div className="flex justify-center mb-4">
            <ThemeToggle />
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
