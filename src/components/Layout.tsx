
import React from "react";
import { Toaster } from "sonner";
import { Link } from "react-router-dom";
import { ThemeProvider } from "next-themes";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex flex-col pt-16">
        {/* Dynamic Island padding - added extra padding at the top */}
        <div className="h-8 w-full fixed top-0 left-0 bg-transparent z-50"></div>
        
        {/* Glass morphism effect for the top part */}
        <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
        
        {/* Add Toaster component for notifications */}
        <Toaster position="top-center" />
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer with subtle branding and links */}
        <footer className="py-6 px-4 text-center text-sm text-gray-400 dark:text-gray-500">
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
