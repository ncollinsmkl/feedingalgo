/**
 * CalculatorsHome — landing page for the Algo Calculator suite.
 * Routed at /calculators. Links out to the two calculator tools and
 * back to the main marketing site at feedingalgo.com.
 */
import { Link } from "react-router-dom";
import styles from "./CalculatorsHome.module.css";
import algoFavicon from "./assets/algo-favicon.png";
import algoReaching from "./assets/algo-reaching.png";

export default function CalculatorsHome() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="https://feedingalgo.com" className={styles.navLogo}>
          <img src={algoFavicon} alt="Algo" />
          <span>Algo.</span>
        </a>
        <div className={styles.navRight}>Calculator Suite</div>
      </nav>

      <div className={styles.heroStack}>
        <div className={styles.heroMascot}>
          <img src={algoReaching} alt="Algo the bear reaching out" />
        </div>
        <div className={styles.hero}>
          <h1>Which calculator would you like to use?</h1>
          <p>
            Two connected tools that work better together. Measure how
            strong your data diet is, then see the value Google's
            AI-powered media can unlock once your Algo is well fed.
          </p>
          <p className={styles.heroSiteLink}>
            New to Algo?{" "}
            <a
              href="https://feedingalgo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet Algo and learn about data maturity at feedingalgo.com →
            </a>
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.choices}>
          <Link
            className={`${styles.choice} ${styles.choiceData}`}
            to="/calculators/data-strength"
          >
            <div className={styles.choiceIcon}>🥣</div>
            <h2>Data Strength Calculator</h2>
            <p>
              Estimate the uplift in session visibility and conversion
              tracking from enabling Google's data-strengthening features,
              including Consent Mode, Enhanced Conversions, server-side
              tagging and more.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>Consent Mode</span>
              <span className={styles.tag}>Enhanced Conversions</span>
              <span className={styles.tag}>sGTM</span>
              <span className={styles.tag}>BigQuery</span>
            </div>
            <span className={styles.choiceCta}>
              Check your Algo's diet →
            </span>
          </Link>

          <Link
            className={`${styles.choice} ${styles.choiceAi}`}
            to="/calculators/ai-value"
          >
            <div className={styles.choiceIcon}>🤖</div>
            <h2>AI Value Calculator</h2>
            <p>
              Estimate the incremental conversions and revenue Google's
              AI-powered features could drive such as; Performance Max,
              Broad Match, Demand Gen, Value-Based Bidding, propensity
              modelling and more.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>Performance Max</span>
              <span className={styles.tag}>Broad Match</span>
              <span className={styles.tag}>Demand Gen</span>
              <span className={styles.tag}>VBB</span>
            </div>
            <span className={styles.choiceCta}>
              See what your Algo can do →
            </span>
          </Link>
        </div>

        <p className={styles.linkNote}>
          💡 The two calculators share what you enter. Ingredients measured
          in one feed straight into the other, so it doesn't matter which
          bowl you start with.
        </p>
      </div>

      <footer className={styles.footer}>
        © dentsu 2026 · Algo · Calculator Suite
      </footer>
    </div>
  );
}
