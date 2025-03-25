
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import MyData from "./pages/MyData";
import AddDrink from "./pages/AddDrink";
import DateDetail from "./pages/DateDetail";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-data" element={<Layout><MyData /></Layout>} />
            <Route path="/my-data/:dateId" element={<Layout><DateDetail /></Layout>} />
            <Route path="/add-drink" element={<Layout><AddDrink /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
