import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SurveyProvider } from "@/contexts/SurveyContext";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SurveyProvider>
          <Sonner />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SurveyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
