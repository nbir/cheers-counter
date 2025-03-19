
import React from "react";
import { Toaster } from "sonner";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col pt-12">
      {/* Glass morphism effect for the top part */}
      <div className="absolute top-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      {/* Add Toaster component for notifications */}
      <Toaster position="top-center" />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer with subtle branding and My Data link */}
      <footer className="py-6 px-4 text-center text-sm text-gray-400">
        <p>BeerMeTwice • Drink Responsibly</p>
        <Link to="/my-data" className="mt-2 inline-block text-gray-400 hover:text-gray-500 underline">
          My Data
        </Link>
      </footer>
    </div>
  );
};

export default Layout;
