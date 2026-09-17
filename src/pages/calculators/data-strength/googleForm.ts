import type { DataStrengthFeatures } from "./engine";
import { resolveAdoptPct } from "../types";
import type { UsageFormState } from "./engine";

const DS_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSf13-nS8gG75xCFwIo_NeX8jwrWWPrmFvRZiZjzQM_Q3Uhs4g/formResponse";

// Feature -> exact Google Form checkbox option string (must match the form verbatim).
const DS_FORM_NAMES: Record<keyof DataStrengthFeatures, string> = {
  consentMode: "Advanced Consent Mode",
  enhancedConversions: "Enhanced Conversions",
  gtg: "Google Tag Gateway",
  sgtm: "Server-side Google Tag Manager",
  metaCapi: "Meta CAPI",
  tiktokEapi: "TikTok EAPI",
  bigquery: "BigQuery",
};

export interface ContactDetails {
  name: string;
  email: string;
  client: string;
}

/**
 * Posts an array of [entryId, value] pairs to a Google Form in the background,
 * via a hidden iframe, matching submitToGoogleForm() in the original.
 */
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
 * Validates and submits the Data Strength Calculator's CTA form to Google Forms.
 * Returns an error message if validation fails, or null on success.
 * Ported from sendResults() in the original.
 */
export function submitDataStrengthResults(
  contact: ContactDetails,
  usage: UsageFormState,
  features: DataStrengthFeatures
): string | null {
  const name = contact.name.trim();
  const email = contact.email.trim();
  const client = contact.client.trim();

  if (!name || !email) {
    return "Please enter at least your name and email so we can follow up.";
  }

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
    ["882960992", usage.safariPct],
    ["1710412418", usage.aov],
    ["239413727", usage.consentRate],
  ];

  // Features with remaining adoption opportunity (i.e. not at 100% / not N/A) get their
  // adoption % appended to the checkbox entry.
  (Object.keys(DS_FORM_NAMES) as (keyof DataStrengthFeatures)[]).forEach((key) => {
    const pct = resolveAdoptPct(features[key]);
    if (pct !== null && pct < 100) {
      entries.push(["1804245660", `${DS_FORM_NAMES[key]} (${pct}% adopted)`]);
    }
  });

  submitToGoogleForm(DS_FORM_ACTION, entries);
  return null;
}
