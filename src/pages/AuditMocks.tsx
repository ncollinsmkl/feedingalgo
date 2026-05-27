/**
 * AuditMocks — temporary comparison page at /mocks/audit.
 * Renders all 3 questionnaire designs stacked so the user can pick one.
 * Delete this page (and the route) once a final variant is chosen.
 */
import AlgoAudit from "../components/AlgoAudit";
import { Link } from "react-router-dom";

const wrap: React.CSSProperties = {
  padding: "48px 24px",
  maxWidth: 1280,
  margin: "0 auto",
  color: "white",
};
const heading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: 40,
  margin: "0 0 8px",
};
const sub: React.CSSProperties = {
  opacity: 0.7,
  marginBottom: 32,
};
const optionTitle: React.CSSProperties = {
  fontSize: 24,
  margin: "48px 0 12px",
  color: "white",
};

export default function AuditMocks() {
  return (
    <div style={wrap}>
      <Link to="/" style={{ color: "var(--c-orange-cta)" }}>
        ← Back to site
      </Link>
      <h1 style={heading}>Algo Audit — design options</h1>
      <p style={sub}>
        Three layouts for the same questionnaire. Pick one and we'll wire it
        into the Home page.
      </p>

      <h2 style={optionTitle}>Option A — Matrix table</h2>
      <AlgoAudit variant="matrix" embedded />

      <h2 style={optionTitle}>Option B — Stepper (one C per screen)</h2>
      <AlgoAudit variant="stepper" embedded />

      <h2 style={optionTitle}>Option C — Vertical accordion</h2>
      <AlgoAudit variant="accordion" embedded />
    </div>
  );
}
