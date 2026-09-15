import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import "../../styles/calculators.css";
import Home from "./pages/Home";
import AuditMocks from "./pages/AuditMocks";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./components/ScrollToTop";

import CalculatorsIndex from "./pages/calculators/Index";
import AIValueCalculator from "./pages/calculators/AIValueCalculator";
import DataStrengthCalculator from "./pages/calculators/DataStrengthCalculator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/mocks/audit" element={<AuditMocks />} />

        {/* Calculator Routes */}
        <Route path="/calculators" element={<CalculatorsIndex />} />
        <Route path="/calculators/ai-value-calculator" element={<AIValueCalculator />} />
        <Route path="/calculators/data-strength-calculator" element={<DataStrengthCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);