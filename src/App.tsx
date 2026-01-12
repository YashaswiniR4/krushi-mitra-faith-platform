import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScanCrop from "./pages/ScanCrop";
import SoilAnalysis from "./pages/SoilAnalysis";
import YieldPrediction from "./pages/YieldPrediction";
import Reports from "./pages/Reports";
import ReportView from "./pages/ReportView";
import History from "./pages/History";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/scan" element={<ScanCrop />} />
          <Route path="/dashboard/soil" element={<SoilAnalysis />} />
          <Route path="/dashboard/yield" element={<YieldPrediction />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/dashboard/history" element={<History />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/report/:id" element={<ReportView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
