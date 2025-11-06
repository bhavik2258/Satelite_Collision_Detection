import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimulationProvider } from "@/context/SimulationProvider";
import Index from "./pages/Index";
import OrbitalMechanicsPage from "./pages/OrbitalMechanicsPage";
import RealTrackingPage from "./pages/RealTrackingPage";
import CollisionsPage from "./pages/CollisionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SimulationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orbital-mechanics" element={<OrbitalMechanicsPage />} />
            <Route path="/real-tracking" element={<RealTrackingPage />} />
            <Route path="/collisions" element={<CollisionsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SimulationProvider>
  </QueryClientProvider>
);

export default App;
