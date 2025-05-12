import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/Sidebar";
import MobileMenuButton from "@/components/MobileMenuButton";
import MainContent from "@/components/MainContent";
import { useState, useEffect } from "react";
import { RTLProvider } from "@/hooks/useRTL";

function Router() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ id: 1, username: "demo" });
  
  useEffect(() => {
    // In a real app, we would check the user's authentication status here
    // For this demo, we'll just simulate a loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-500 rounded-md flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="text-lg font-medium text-neutral-800">Loading Elastic Habits...</div>
        </div>
      </div>
    );
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={toggleMobileMenu} />

      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <MainContent>
        <Switch>
          <Route path="/" component={() => <Dashboard user={user} />} />
          <Route path="/analytics" component={() => <Analytics user={user} />} />
          <Route path="/settings" component={() => <Settings user={user} />} />
          <Route path="/help" component={() => <Help user={user} />} />
          <Route component={NotFound} />
        </Switch>
      </MainContent>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RTLProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </RTLProvider>
    </QueryClientProvider>
  );
}

export default App;
