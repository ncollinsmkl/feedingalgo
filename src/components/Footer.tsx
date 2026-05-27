/**
 * Footer — site links + copyright.
 * Maps to Figma frame 24:147. The "Cookie preferences" button
 * re-opens the consent banner via a global event so the user can
 * change their mind at any time.
 */
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.logo}>Strong Data.</span>
        <nav className={styles.links} aria-label="Footer">
          <Link to="/privacy">Privacy Policy</Link>
          <a href="#lead-gen">Contact</a>
          <button
            type="button"
            className={styles.cookieBtn}
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-consent-banner"))
            }
          >
            Cookie preferences
          </button>
        </nav>
        <p className={styles.copy}>© 2026 STRONG DATA</p>
      </div>
    </footer>
  );
}
