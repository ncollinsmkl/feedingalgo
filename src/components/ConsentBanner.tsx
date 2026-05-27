/**
 * ConsentBanner — cookie consent banner.
 *
 * On first visit (no stored preference) we show the banner.
 * Accept = Google Analytics loads (lib/analytics.ts).
 * Reject = no GA script ever injected, no cookies set.
 *
 * Footer can re-open this banner by dispatching `open-consent-banner`.
 */
import { useEffect, useState } from "react";
import { getConsent, initAnalyticsIfConsented, setConsent } from "../lib/analytics";
import styles from "./ConsentBanner.module.css";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Boot: if previously accepted, load GA. If unset, show the banner.
    initAnalyticsIfConsented();
    if (getConsent() === null) setShow(true);
    const onOpen = () => setShow(true);
    window.addEventListener("open-consent-banner", onOpen);
    return () => window.removeEventListener("open-consent-banner", onOpen);
  }, []);

  if (!show) return null;

  const choose = (v: "accepted" | "rejected") => {
    setConsent(v);
    setShow(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <div className={styles.content}>
        <p>
          We use <strong>Google Tag Manager</strong> (which loads Google
          Analytics) to understand how visitors use this site. No other
          tracking is in place. You can change this at any time via &quot;Cookie
          preferences&quot; in the footer. See our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reject}
            onClick={() => choose("rejected")}
          >
            Reject
          </button>
          <button
            type="button"
            className={styles.accept}
            onClick={() => choose("accepted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
