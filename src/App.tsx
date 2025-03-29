
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import LandingPage from "./components/LandingPage";
import USMap from "./components/USMap";
import BillsList from "./components/BillsList";
import BillDetail from "./components/BillDetail";
import Forum from "./components/Forum";
import MutualAid from "./components/MutualAid";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="*" 
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/map" element={<USMap />} />
                        <Route path="/bills/:state" element={<BillsList />} />
                        <Route path="/bill/:id" element={<BillDetail />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/mutual-aid" element={<MutualAid />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
