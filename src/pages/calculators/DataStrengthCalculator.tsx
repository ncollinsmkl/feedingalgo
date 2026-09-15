import { Link } from "react-router-dom";

export default function DataStrengthCalculator() {
  return (
    <div className="container">
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link to="/calculators" className="btn btn-ghost">
          &larr; All calculators
        </Link>
      </nav>

      <div className="hero-stack">
        <div className="hero-mascot-big">
          <img src="/assets/hero.png" alt="Algo the bear flexing" />
        </div>
        <div className="hero">
          <h1>Data Strength Calculator</h1>
          <p>
            This is the "Algo Audit", check what's in your Algo's bowl today, and see the estimated uplift in session visibility and conversion tracking from feeding it data-strengthening features.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">⚙️</div>
          <div>
            <div className="card-title">What's in Your Algo's Bowl?</div>
            <div className="card-subtitle">
              To what extent, if any, are these features applied to your advertising or tracking?
            </div>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-name-row">
            <div className="feature-name">Advanced Consent Mode</div>
            <div className="na-toggle-inline">
              <input type="checkbox" id="consent_mode_na" />
              <label htmlFor="consent_mode_na">Not applicable</label>
            </div>
          </div>
          <div className="feature-desc">
            Enables modelled conversions and session recovery for users who decline cookies, using AI to fill the measurement gap.
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-name-row">
            <div className="feature-name">Enhanced Conversions</div>
            <div className="na-toggle-inline">
              <input type="checkbox" id="enhanced_conv_na" />
              <label htmlFor="enhanced_conv_na">Not applicable</label>
            </div>
          </div>
          <div className="feature-desc">
            Supplements existing conversion tags with hashed first-party data, improving accuracy for Paid Search campaigns.
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-name-row">
            <div className="feature-name">Server-Side Google Tag Manager (sGTM)</div>
            <div className="na-toggle-inline">
              <input type="checkbox" id="sgtm_na" />
              <label htmlFor="sgtm_na">Not applicable</label>
            </div>
          </div>
          <div className="feature-desc">
            Processes tags through a first-party server, improving data governance, enrichment for analysis and activation, as well as potentially site speed.
          </div>
        </div>
      </div>

      <div className="btn-actions">
        <button className="btn btn-primary" type="button">
          Calculate Uplift &rarr;
        </button>
      </div>

      <footer>&copy; dentsu 2026 &middot; Algo &middot; Data Strength Calculator</footer>
    </div>
  );
}