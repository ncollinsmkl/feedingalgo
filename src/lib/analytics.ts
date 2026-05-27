/**
 * Google Tag Manager loader, gated on cookie consent.
 *
 * GTM is the tag-management layer — GA4 (and any future tags) live
 * inside the container, not in this file. We only inject the GTM
 * script after the visitor has explicitly accepted cookies. Reject
 * means no script, no network requests, no cookies.
 *
 * The `<noscript>` fallback iframe lives in `index.html` so it can be
 * the first child of <body> as Google recommends.
 *
 * ════════════════════════════════════════════════════════════════════
 * 👉 EDIT GTM CONTAINER ID HERE
 * ════════════════════════════════════════════════════════════════════
 * Change GTM_CONTAINER_ID if you ever swap to a new container.
 * Remember to update the matching id in `index.html` (<noscript> tag).
 * ════════════════════════════════════════════════════════════════════
 */
const GTM_CONTAINER_ID = "GTM-M7JGSV3P";

export const CONSENT_KEY = "algo-consent";
export type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    /** GTM dataLayer — push events here to forward them into tags. */
    dataLayer?: Record<string, unknown>[];
  }
}

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function setConsent(value: "accepted" | "rejected") {
  window.localStorage.setItem(CONSENT_KEY, value);
  if (value === "accepted") loadGTM();
  // We intentionally do NOT unload GTM mid-session if the user switches
  // from accepted → rejected; we just stop new sessions from loading
  // it. A full reload will then leave GTM (and everything fired by it)
  // out.
}

let loaded = false;

/**
 * Injects the GTM script tag. Safe to call repeatedly — only runs once
 * per page load. Push events onto `window.dataLayer` after this resolves
 * to forward custom interactions to tags configured in your container.
 */
export function loadGTM() {
  if (loaded) return;
  if (GTM_CONTAINER_ID.includes("XXXX")) {
    // eslint-disable-next-line no-console
    console.info(
      "[analytics] consent granted — placeholder GTM ID, skipping load"
    );
    return;
  }
  loaded = true;

  // Seed the dataLayer with the gtm.start event BEFORE the script tag
  // loads, so GTM picks up the start time as soon as it boots.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
}

/** Call on app boot to (re)load GTM if consent was previously granted. */
export function initAnalyticsIfConsented() {
  if (getConsent() === "accepted") loadGTM();
}

/* ----------------------------------------------------------------------
 * Backwards-compat shim.
 * Earlier components imported `loadGA`. Keep an alias so we don't have
 * to chase down every old import — GTM now does the work.
 * -------------------------------------------------------------------- */
export const loadGA = loadGTM;
