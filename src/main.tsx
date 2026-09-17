import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import AuditMocks from "./pages/AuditMocks";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./components/ScrollToTop";
import CalculatorsHome from "./pages/calculators/CalculatorsHome";
import DataStrengthCalculator from "./pages/calculators/data-strength/DataStrengthCalculator";
import AiValueCalculator from "./pages/calculators/ai-value/AiValueCalculator";

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
        <Route path="/calculators" element={<CalculatorsHome />} />
        <Route path="/calculators/data-strength" element={<DataStrengthCalculator />} />
        <Route path="/calculators/ai-value" element={<AiValueCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);