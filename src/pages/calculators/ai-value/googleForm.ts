import type { FeatureAdoption } from "../types";
import { resolveAdoptPct } from "../types";
import type { AiResults } from "./engine";

const AI_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSeMGdr5gGdfGBLd1hD99DE7LLQZ6SeLVgt9Y2rWs5mkaxDHlQ/formResponse";

// Feature key -> exact Google Form checkbox option string (must match the form's options verbatim).
const AI_FORM_NAMES: Record<string, string> = {
  measurement_foundation: "Measurement Foundation",
  enhanced_conversions: "Enhanced Conversions",
  consent_mode: "Consent Mode",
  pmax: "Performance Max",
  broad_match: "Broad Match",
  rsa: "Responsive Search Ads",
  ai_max: "AI Max",
  demand_gen: "Demand Gen",
  cross_vbb: "Cross-platform VBB",
  vbb: "Value-based Bidding",
  dda: "Data-Driven Attribution",
  customer_match: "Customer Match",
  propensity: "Purchase Probability / Propensity Modelling",
  high_value_modeling: "High-Value Action Modelling",
  dynamic_creative: "Dynamic / Data-Driven Creative",
  budgets_targets: "Demand-Led Budgeting",
  video_action: "Video Action Campaigns",
  video_reach: "Video Reach Campaigns",
  video_view: "Video View Campaigns",
  ctv: "Connected TV",
  mmm: "Media Mix Modelling",
  cloud_consult: "Cloud Consultation / data readiness",
  gen_ai: "GenAI Creative",
};

export interface ContactDetails {
  name: string;
  email: string;
  client: string;
}

function submitToGoogleForm(actionUrl: string, entries: [string, string][]): void {
  let iframe = document.getElementById("gform_sink") as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = "gform_sink";
    iframe.id = "gform_sink";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }
  const form = document.createElement("form");
  form.action = actionUrl;
  form.method = "POST";
  form.target = "gform_sink";
  form.style.display = "none";
  entries.forEach(([k, val]) => {
    if (val == null || val === "") return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "entry." + k;
    input.value = val;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 2000);
}

/**
 * Validates and submits the AI Value Calculator's CTA form to Google Forms.
 * Returns an error message if validation fails, or null on success.
 * Ported from sendResults() in the original.
 */
export function submitAiValueResults(
  contact: ContactDetails,
  usage: { sessions: string; conversions: string; paidSearchPct: string; dvPct: string; paidSocialPct: string; searchSpend: string; dvSpend: string; aov: string },
  results: AiResults,
  featureAdoption: Record<string, FeatureAdoption>
): string | null {
  const name = contact.name.trim();
  const email = contact.email.trim();
  const client = contact.client.trim();

  if (!name || !email) {
    return "Please enter at least your name and email so we can follow up.";
  }

  // Numeric opportunities ranked by mid-point -> largest + top 3
  const ranked = results.opportunities
    .filter((o) => o.type !== "qual")
    .map((o) => ({ ...o, mid: ((o.revLo || 0) + (o.revHi || 0)) / 2 }))
    .sort((a, b) => b.mid - a.mid);
  const nameFor = (o: { key: string; name: string }) => AI_FORM_NAMES[o.key] || o.name;
  const largest = ranked[0] ? nameFor(ranked[0]) : "";
  const top3 = ranked.slice(0, 3).map(nameFor).join(", ");

  const entries: [string, string][] = [
    ["1366306938", name],
    ["692283891", email],
    ["1956057909", client],
    ["1401280302", usage.sessions],
    ["952886595", usage.conversions],
    ["1434693218", usage.paidSearchPct],
    ["1264975808", usage.dvPct],
    ["1478664110", usage.paidSocialPct],
    ["1054934050", usage.searchSpend],
    ["1985673667", usage.dvSpend],
    ["1710412418", usage.aov],
    ["340726697", largest],
    ["1050235816", top3],
  ];

  // Features with remaining adoption opportunity (i.e. not at 100% / not N/A) get their
  // adoption % appended to the checkbox entry.
  Object.keys(AI_FORM_NAMES).forEach((key) => {
    const pct = resolveAdoptPct(featureAdoption[key]);
    if (pct !== null && pct < 100) {
      entries.push(["1804245660", `${AI_FORM_NAMES[key]} (${pct}% adopted)`]);
    }
  });

  submitToGoogleForm(AI_FORM_ACTION, entries);
  return null;
}
