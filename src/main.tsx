import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/Home";
import AuditMocks from "./pages/AuditMocks";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./components/ScrollToTop";

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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
