import { Link } from "react-router-dom";

export default function CalculatorsIndex() {
  return (
    <div className="container">
      <div className="hero-stack">
        <div className="hero-mascot">
          <img src="/assets/hero.png" alt="Algo" />
        </div>
        <div className="hero">
          <h1>Which calculator would you like to use?</h1>
          <p>
            Two connected audits that work better together to measure how good your algorithmic diet is, first by showing the power of strong data, then see the value AI-powered media can unlock once your Algo is well fed.
          </p>
          <p className="hero-site-link">
            New to Algo?{" "}
            <a href="https://feedingalgo.com" target="_blank" rel="noopener noreferrer">
              Meet Algo and learn about data maturity at feedingalgo.com &rarr;
            </a>
          </p>
        </div>
      </div>

      <div className="choices">
        <Link className="choice data" to="/calculators/data-strength-calculator">
          <div className="choice-icon">🥣</div>
          <h2>Data Strength Calculator</h2>
          <p>
            Estimate the uplift in session visibility and conversion tracking
            from enabling data-strengthening features, including Consent Mode,
            Enhanced Conversions, server-side tagging and more.
          </p>
          <div className="tags">
            <span className="tag">Consent Mode</span>
            <span className="tag">Enhanced Conversions</span>
            <span className="tag">sGTM</span>
            <span className="tag">BigQuery</span>
          </div>
          <span className="choice-cta">Check your Algo's diet &rarr;</span>
        </Link>

        <Link className="choice ai" to="/calculators/ai-value-calculator">
          <div className="choice-icon">🤖</div>
          <h2>AI Value Calculator</h2>
          <p>
            Estimate the incremental conversions and revenue AI-powered
            features could drive such as; Performance Max, Broad Match, Demand
            Gen, Value-Based Bidding, propensity modelling and more.
          </p>
          <div className="tags">
            <span className="tag">Performance Max</span>
            <span className="tag">Broad Match</span>
            <span className="tag">Demand Gen</span>
            <span className="tag">VBB</span>
          </div>
          <span className="choice-cta">See what your Algo can do &rarr;</span>
        </Link>
      </div>

      <p className="link-note">
        💡 The two calculators share what you enter. Ingredients measured in one feed straight into the other, so it doesn't matter which bowl you start with.
      </p>

      <footer>&copy; dentsu 2026 &middot; Algo &middot; Calculator Suite</footer>
    </div>
  );
}