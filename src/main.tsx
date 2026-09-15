import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import AuditMocks from "./pages/AuditMocks";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./components/ScrollToTop";

// Import the new calculator pages
import CalculatorsIndex from "./pages/calculators/Index";
import AIValueCalculator from "./pages/calculators/AIValueCalculator";
import DataStrengthCalculator from "./pages/calculators/DataStrengthCalculator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Reset scroll position on every route change. */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Comparison page for the user to pick a questionnaire design.
            Remove once a design is chosen. */}
        <Route path="/mocks/audit" element={<AuditMocks />} />
        
        {/* Calculator Routes */}
        <Route path="/calculators" element={<CalculatorsIndex />} />
        <Route path="/calculators/ai-value-calculator" element={<AIValueCalculator />} />
        <Route path="/calculators/data-strength-calculator" element={<DataStrengthCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);