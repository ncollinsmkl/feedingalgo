import { Link } from "react-router-dom";

export default function AIValueCalculator() {
  return (
    <div className="container">
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link to="/calculators" className="btn btn-ghost">
          &larr; All calculators
        </Link>
      </nav>

      <div className="hero-stack">
        <div className="hero-mascot-big">
          <img src="/assets/ai_value_algo_hero.png" alt="Algo the bear thinking" />
        </div>
        <div className="hero">
          <h1>AI Value Calculator</h1>
          <p>
            Once your Algo's diet is strong, see what it can really do. Estimate the incremental conversions and revenue that AI-powered media, search &amp; video features could drive, based on which you've already fed it.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🤖</div>
          <div>
            <div className="card-title">AI Feature Adoption</div>
            <div className="card-subtitle">
              Tell us which AI-powered features are already in your Algo's bowl. We'll estimate the opportunity from the ones you're <strong>not</strong> yet feeding it.
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label htmlFor="sessions">Avg Monthly Sessions</label>
            <input type="number" id="sessions" placeholder="e.g. 500,000" min="0" />
          </div>

          <div className="form-group full">
            <label htmlFor="conversions">Avg Monthly Conversions / Leads</label>
            <input type="number" id="conversions" placeholder="e.g. 5,000" min="0" />
          </div>

          <div className="form-group full">
            <label htmlFor="aov">Average Order / Lead Value (&pound;)</label>
            <input type="number" id="aov" placeholder="e.g. 100" min="0" defaultValue="100" />
          </div>
        </div>
      </div>

      <div className="btn-actions">
        <button className="btn btn-primary" type="button">
          Calculate AI Value &rarr;
        </button>
      </div>

      <footer>&copy; dentsu 2026 &middot; Algo &middot; AI Value Calculator</footer>
    </div>
  );
}