/**
 * Privacy Policy page.
 *
 * NOTE: this is a first-draft, plain-English policy aligned with UK / EU
 * expectations for a Google-Analytics-only site. It is NOT a substitute
 * for legal review — please have the DAAT team's legal/compliance contact
 * confirm before public launch.
 */
import { Link } from "react-router-dom";
import styles from "./StaticPage.module.css";

export default function Privacy() {
  return (
    <main className={styles.page}>
      <div className="container">
        <Link className={styles.back} to="/">
          ← Back to Strong Data
        </Link>
        <h1>Privacy Policy</h1>
        <p className={styles.meta}>Last updated: May 2026</p>

        <h2>1. Who we are</h2>
        <p>
          This website (“Strong Data”) is operated by the DAAT team. If you
          have any questions about this policy you can reach us at{" "}
          <a href="mailto:team@feedingalgo.com">team@feedingalgo.com</a>.
        </p>

        <h2>2. What we collect</h2>
        <p>
          We use <strong>Google Tag Manager</strong> to load{" "}
          <strong>Google Analytics</strong> for site-traffic measurement.
          Both are loaded only after you click <em>Accept</em> on the cookie
          banner. If you click <em>Reject</em>, Google Tag Manager is never
          loaded and no analytics cookies are set.
        </p>
        <p>When loaded, Google Analytics collects:</p>
        <ul>
          <li>Pages viewed and the order they are viewed in</li>
          <li>An anonymised version of your IP address</li>
          <li>Approximate location (country / region)</li>
          <li>Device type, browser, operating system and screen size</li>
          <li>Referrer (the site that sent you here)</li>
          <li>A randomly generated user identifier stored in a cookie</li>
        </ul>
        <p>
          We do not collect names, email addresses or other identifying data
          unless you choose to submit them via one of the forms on this site.
          When you do, the form is processed by <strong>Google Forms</strong>,
          acting as a data processor on our behalf, and the response is stored
          in a Google spreadsheet that only the DAAT team can access.
        </p>

        <h2>3. Why we collect it</h2>
        <p>
          We use Google Analytics to understand which pages are useful, how
          people navigate the site, and where to improve. We do not use the
          data for advertising or share it with third parties beyond Google
          in its role as our analytics processor.
        </p>

        <h2>4. How long we keep it</h2>
        <p>
          Google Analytics data is retained for the default period configured
          in our property (currently 14 months). Information you send us via
          a form is retained for as long as we need it to respond.
        </p>

        <h2>5. Your rights</h2>
        <p>
          You can change your cookie choice at any time via the "Cookie Preference" link in the site footer. You also have the right to 
          ask us what we hold about you, to correct it, or to have it deleted —
          contact us at <a href="mailto:team@feedingalgo.com">team@feedingalgo.com</a>.
        </p>

        <h2>6. Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          highlighted on this page with a new “Last updated” date.
        </p>
      </div>
    </main>
  );
}
