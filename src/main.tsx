import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import "./styles/calculators.css";
import Home from "./pages/Home";
import AuditMocks from "./pages/AuditMocks";
import Privacy from "./pages/Privacy";
import ScrollToTop from "./components/ScrollToTop";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/mocks/audit" element={<AuditMocks />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);