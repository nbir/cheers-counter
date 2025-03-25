
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import DrinkCounter from "@/components/DrinkCounter";

const Index = () => {
  // Add meta tag to prevent zoom on double-tap
  useEffect(() => {
    // Check if the meta tag already exists
    const existingMeta = document.querySelector('meta[name="viewport"]');
    
    if (existingMeta) {
      // Update existing viewport meta tag
      existingMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      // Create a new meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
    
    // Clean up when component unmounts
    return () => {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);
  
  return (
    <Layout>
      <DrinkCounter />
    </Layout>
  );
};

export default Index;
