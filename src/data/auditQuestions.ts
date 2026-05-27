/**
 * Audit questionnaire: 5 rows (one per C) × 4 columns (score 1..4).
 * Column 1 = "Hardly Any Data", Column 4 = "Strong Data".
 *
 * ════════════════════════════════════════════════════════════════════
 * 👉 EDIT QUESTIONNAIRE WORDING HERE
 * ════════════════════════════════════════════════════════════════════
 * • To change the four column headers (Hardly Any Data … Strong Data),
 *   edit AUDIT_COLUMNS below.
 * • To change the four option labels that appear inside each cell for
 *   a given C, edit the `options` array on that row in AUDIT_ROWS.
 *   The order is always [score 1, score 2, score 3, score 4].
 * • To change the score-band messages or images, edit `scoreBand` at
 *   the bottom of this file.
 * No other files need to be touched for copy edits.
 * ════════════════════════════════════════════════════════════════════
 */
import type { CKey } from "./fiveCs";

// 👉 Column headers (and their score weights). Editable.
// `image` is the Algo mood image shown at the top of each column in the
// matrix layout — sad → ambivalent → happy → very happy as scores climb.
// `label` is the caption beneath the image (also used as accessible text).
// The columns read left-to-right as a gradient from Hungry → Feasting.
export const AUDIT_COLUMNS = [
  { score: 1, label: "Hungry",   image: "/assets/1- Image_Algo_Sad.png" },
  { score: 2, label: "Peckish",  image: "/assets/2- Image_Algo_Ambivalent.png" },
  { score: 3, label: "Munching",  image: "/assets/3- Image_Algo_Happy.png" },
  { score: 4, label: "Feasting", image: "/assets/4- Image_Algo_VeryHappy.png" },
] as const;

export interface AuditRow {
  key: CKey;
  title: string;
  options: [string, string, string, string]; // index 0 = score 1, etc.
}

// 👉 Per-C cell text. Each `options` array is left-to-right across the matrix.
export const AUDIT_ROWS: AuditRow[] = [
  {
    key: "consent",
    title: "Consent",
    options: [
      "No user consent is capture, or cookie banners are entirely unintegrated",
      "A basic cookie banner is implemented with standard compliance",
      "Consent Mode is active to model lost conversion data",
      "Advanced Consent Mode is fully deployed across all global tags and regions",
    ],
  },
  {
    key: "collect",
    title: "Collect",
    options: [
      "Basic browser tracking is unmanaged, lacking regular Tagging Reviews",
      "Core user events are cleanly deployed via Google Tag Gateway",
      "Enhanced Conversions and Conversion APIs (CAPI) are integrated",
      "Infrastructure runs on server-side Google Tag Manager (sGTM) with routine validation",
    ],
  },
  {
    key: "curate",
    title: "Curate",
    options: [
      "No standardised naming convention exists across marketing teams",
      "Basic UTM mapping and platform event structures are loosely followed",
      "Dedicated Taxonomy support ensures consistent naming across channels",
      "An automated, enterprise-wise taxonomy governs all data feeds seamlessly",
    ],
  },
  {
    key: "combine",
    title: "Combine",
    options: [
      "Data lives in separate silos with manual spreadsheet exports",
      "Native platform integrations link basic reporting and analytics views",
      "Raw marketing and web data are automatically centralised into a cloud data warehouse (like BigQuery)",
      "Cloud data warehouse blends offline CRM data with real-time media feeds for a complete view",
    ],
  },
  {
    key: "connect",
    title: "Connect",
    options: [
      "Data is not shared directly with ad platforms for targeting",
      "Utilising audiences in Google Analytics to sync basic remarketing lists to Google Ads",
      "First-party data flows directly into the broader adtech ecosystem for custom targeting",
      "Utilising tools to instantly activate data across the entire media ecosystem",
    ],
  },
];

/**
 * ════════════════════════════════════════════════════════════════════
 * 👉 EDIT AUDIT RESULT TEXT HERE
 * ════════════════════════════════════════════════════════════════════
 * Each `if` block below is one of the four score bands shown in the
 * "Check Your Score" pop-up at the end of the audit.
 *   • Change `headline` to change the bold heading the user sees.
 *   • Change `message` to change the explanatory paragraph.
 *   • Do NOT change `image` — that pairs the result with the right
 *     Algo bear (sad / ambivalent / happy / very happy).
 *
 * Score bands:
 *   0–8   → sad        (Algo is hungry)
 *   9–12  → ambivalent (Algo is unsure)
 *   13–16 → happy      (Algo is pleased)
 *   17–20 → veryHappy  (Algo is feasting)
 * ════════════════════════════════════════════════════════════════════
 */
export function scoreBand(total: number) {
  if (total <= 8)
    return {
      band: "sad" as const,
      headline: "Algo's gone hungry",
      message:
        "Your data isn't giving Algo much to work with yet. The good news — there's huge upside once the basics are in place.",
      image: "/assets/1- Image_Algo_Sad.png",
    };
  if (total <= 12)
    return {
      band: "ambivalent" as const,
      headline: "Algo's a bit unsure",
      message:
        "You've got some solid foundations, but the data is still siloed in places. Tightening up Curate and Combine would move the needle quickly.",
      image: "/assets/2- Image_Algo_Ambivalent.png",
    };
  if (total <= 16)
    return {
      band: "happy" as const,
      headline: "Algo's pretty pleased",
      message:
        "Your data is in good shape and starting to drive real value. A few targeted upgrades and you'll be in the top tier.",
      image: "/assets/3- Image_Algo_Happy.png",
    };
  // 17–20 — only the strongest data sets land here.
  return {
    band: "veryHappy" as const,
    headline: "Algo's feasting!",
    message:
      "Your data is genuinely strong — well consented, well collected, well curated, well combined, and well connected. Let's talk about what's next.",
    image: "/assets/4- Image_Algo_VeryHappy.png",
  };
}
