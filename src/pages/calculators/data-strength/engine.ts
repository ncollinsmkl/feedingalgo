import type { ChannelSelection, FeatureAdoption } from "../types";
import { hasOpportunity, remainingFrac } from "../types";

/** A single feature's contribution to a projected metric (sessions or conversions). */
export interface FeatureContribution {
  label: string;
  color: string;
  lo: number;
  avg: number;
  hi: number;
  note: string;
}

export interface DataStrengthFeatures {
  consentMode: FeatureAdoption;
  enhancedConversions: FeatureAdoption;
  gtg: FeatureAdoption;
  sgtm: FeatureAdoption;
  metaCapi: FeatureAdoption;
  tiktokEapi: FeatureAdoption;
  bigquery: FeatureAdoption;
}

/** Raw string form-field state for Step 2's usage inputs (kept as strings to match <input> values). */
export interface UsageFormState {
  sessions: string;
  conversions: string;
  paidSearchPct: string;
  dvPct: string;
  paidSocialPct: string;
  searchSpend: string;
  dvSpend: string;
  socialSpend: string;
  safariPct: string;
  aov: string;
  consentRate: string;
}

export const BASELINE_DEFAULTS: UsageFormState = {
  sessions: "500000",
  conversions: "1000",
  paidSearchPct: "45",
  dvPct: "15",
  paidSocialPct: "20",
  searchSpend: "50000",
  dvSpend: "",
  socialSpend: "",
  safariPct: "40",
  aov: "50",
  consentRate: "75",
};

export interface DataStrengthUsageInputs {
  channels: ChannelSelection;
  sessions: number | null;
  conversions: number | null;
  paidSearchPct: number | null;
  dvPct: number | null;
  paidSocialPct: number | null;
  searchSpend: number | null;
  dvSpend: number | null;
  socialSpend: number | null;
  safariPct: number | null;
  aov: number | null;
  consentRatePct: number | null;
}

export interface Triple {
  lo: number;
  avg: number;
  hi: number;
}

export interface MetaEventUplift {
  lo: number;
  avg: number;
  hi: number;
}

export interface DataStrengthResults {
  cmOn: boolean;
  ecOn: boolean;
  gtgOn: boolean;
  sgtmOn: boolean;
  bqOn: boolean;
  sessions: number;
  conversions: number;
  optIn: number | null;
  safariPct: number;
  searchPct: number;
  dvPct: number;
  socialPct: number;
  hasSearch: boolean;
  hasVideo: boolean;
  hasSocial: boolean;
  adSpend: number | null;
  aov: number | null;
  sessionFeatures: FeatureContribution[];
  convFeatures: FeatureContribution[];
  metaEvents: MetaEventUplift | null;
  sess: Triple;
  conv: Triple;
  cmSessionSkipped: boolean;
}

/** Two-segment linear interpolation (anchors x0/y0 -> x1/y1 -> x2/y2), clamped 0-100. */
export function twoSeg(
  xRaw: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const x = Math.max(0, Math.min(100, xRaw));
  if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
}

function sumTriple(features: FeatureContribution[]): Triple {
  return {
    lo: features.reduce((a, f) => a + f.lo, 0),
    avg: features.reduce((a, f) => a + f.avg, 0),
    hi: features.reduce((a, f) => a + f.hi, 0),
  };
}

/**
 * Runs the full Data Strength calculation. Ported 1:1 from the original
 * calculateAndShow() in data-strength-calculator.html, with DOM reads
 * replaced by the two input objects.
 */
export function calculateDataStrength(
  features: DataStrengthFeatures,
  usage: DataStrengthUsageInputs
): DataStrengthResults {
  const cmRem = remainingFrac(features.consentMode);
  const ecRem = remainingFrac(features.enhancedConversions);
  const gtgRem = remainingFrac(features.gtg);
  const sgtmRem = remainingFrac(features.sgtm);
  const metaRem = remainingFrac(features.metaCapi);
  const tiktokRem = remainingFrac(features.tiktokEapi);

  const cmOn = hasOpportunity(features.consentMode);
  const ecOn = hasOpportunity(features.enhancedConversions);
  const gtgOn = hasOpportunity(features.gtg);
  const sgtmOn = hasOpportunity(features.sgtm);
  const bqOn = hasOpportunity(features.bigquery);
  const metaOn = hasOpportunity(features.metaCapi);
  const tiktokOn = hasOpportunity(features.tiktokEapi);

  const sessions = usage.sessions ?? 0;
  const conversions = usage.conversions ?? 0;
  const safariPct = usage.safariPct ?? 40;
  const aov = usage.aov;
  const optIn = usage.consentRatePct !== null ? usage.consentRatePct / 100 : null;

  const base = usage.channels.baseline;
  const hasSearch = base || usage.channels.search;
  const hasVideo = !base && usage.channels.video;
  const hasSocial = base || usage.channels.social;

  const searchPct = usage.paidSearchPct ?? 0;
  const dvPct = usage.dvPct ?? 0;
  const socialPct = usage.paidSocialPct ?? 0;

  const spendVals = [usage.searchSpend, usage.dvSpend, usage.socialSpend].filter(
    (v): v is number => v !== null && v > 0
  );
  const adSpend = spendVals.length ? spendVals.reduce((a, b) => a + b, 0) : null;

  // -- Session-recovering features (absolute recovered sessions) --
  const sessionFeatures: FeatureContribution[] = [];
  if (cmOn && optIn !== null && cmRem !== null) {
    const lost = sessions * (1 - optIn); // opted-out share of current sessions
    sessionFeatures.push({
      label: "Advanced Consent Mode",
      color: "#EF7F3B",
      lo: lost * 0.3 * cmRem,
      avg: lost * 0.5 * cmRem,
      hi: lost * 0.7 * cmRem,
      note:
        "recovers 30–70% of opted-out sessions (avg 50%)" +
        (cmRem < 1 ? `, scaled to ${Math.round(cmRem * 100)}% remaining opportunity` : ""),
    });
  }
  if (gtgOn && gtgRem !== null) {
    sessionFeatures.push({
      label: "Google Tag Gateway",
      color: "#9B65C9",
      lo: sessions * 0.11 * gtgRem,
      avg: sessions * 0.11 * gtgRem,
      hi: sessions * 0.14 * gtgRem,
      note:
        "+11–14% of sessions (avg 11%)" +
        (gtgRem < 1 ? `, scaled to ${Math.round(gtgRem * 100)}% remaining opportunity` : ""),
    });
  }
  if (sgtmOn && sgtmRem !== null) {
    const avgP = twoSeg(safariPct, 0, 5, 40, 20, 100, 30);
    const loP = Math.max(5, avgP * 0.6);
    const hiP = Math.min(30, avgP * 1.5);
    sessionFeatures.push({
      label: "Server-Side GTM",
      color: "#4C86D6",
      lo: (sessions * loP * sgtmRem) / 100,
      avg: (sessions * avgP * sgtmRem) / 100,
      hi: (sessions * hiP * sgtmRem) / 100,
      note:
        `scales with ${safariPct}% Safari traffic (avg +${avgP.toFixed(0)}%)` +
        (sgtmRem < 1 ? `, scaled to ${Math.round(sgtmRem * 100)}% remaining opportunity` : ""),
    });
  }

  // -- Conversion-uplift features (absolute additional conversions) --
  const convFeatures: FeatureContribution[] = [];
  if (cmOn && cmRem !== null) {
    convFeatures.push({
      label: "Advanced Consent Mode",
      color: "#EF7F3B",
      lo: conversions * 0.1 * cmRem,
      avg: conversions * 0.18 * cmRem,
      hi: conversions * 0.3 * cmRem,
      note:
        "+10–30% observed conversions (avg 18%)" +
        (cmRem < 1 ? `, scaled to ${Math.round(cmRem * 100)}% remaining opportunity` : ""),
    });
  }
  if (ecOn && ecRem !== null) {
    let r: [number, number, number] | null = null;
    let scope = "";
    if (hasSearch && hasVideo) {
      r = [0.05, 0.1, 0.17];
      scope = "Search + Display & Video";
    } else if (hasVideo) {
      r = [0.1, 0.2, 0.31];
      scope = "Display & Video";
    } else if (hasSearch) {
      r = [0.05, 0.08, 0.15];
      scope = "Paid Search";
    }
    // Social-only -> Enhanced Conversions not applicable
    if (r) {
      convFeatures.push({
        label: "Enhanced Conversions",
        color: "#5AA96B",
        lo: conversions * r[0] * ecRem,
        avg: conversions * r[1] * ecRem,
        hi: conversions * r[2] * ecRem,
        note:
          `+${(r[0] * 100).toFixed(0)}–${(r[2] * 100).toFixed(0)}% (${scope})` +
          (ecRem < 1 ? `, scaled to ${Math.round(ecRem * 100)}% remaining opportunity` : ""),
      });
    }
  }
  if (gtgOn && gtgRem !== null) {
    convFeatures.push({
      label: "Google Tag Gateway",
      color: "#9B65C9",
      lo: conversions * 0.09 * gtgRem,
      avg: conversions * 0.14 * gtgRem,
      hi: conversions * 0.18 * gtgRem,
      note:
        "+9–18% observed conversions (avg 14%)" +
        (gtgRem < 1 ? `, scaled to ${Math.round(gtgRem * 100)}% remaining opportunity` : ""),
    });
  }
  if (sgtmOn && sgtmRem !== null) {
    const avgP = twoSeg(safariPct, 0, 10, 40, 20, 100, 60);
    const loP = Math.max(10, avgP * 0.65);
    const hiP = Math.min(60, avgP * 1.6);
    convFeatures.push({
      label: "Server-Side GTM",
      color: "#4C86D6",
      lo: (conversions * loP * sgtmRem) / 100,
      avg: (conversions * avgP * sgtmRem) / 100,
      hi: (conversions * hiP * sgtmRem) / 100,
      note:
        `scales with ${safariPct}% Safari traffic (avg +${avgP.toFixed(0)}%)` +
        (sgtmRem < 1 ? `, scaled to ${Math.round(sgtmRem * 100)}% remaining opportunity` : ""),
    });
  }

  // Meta CAPI / TikTok EAPI - delivered via sGTM, only modelled for Paid Social.
  const socialConv = conversions * (socialPct / 100);
  const socialModellable = hasSocial && socialConv > 0;
  let metaEvents: MetaEventUplift | null = null;
  if (socialModellable && metaOn && metaRem !== null) {
    convFeatures.push({
      label: "Meta CAPI (Paid Social)",
      color: "#1877F2",
      lo: socialConv * 0.1 * metaRem,
      avg: socialConv * 0.13 * metaRem,
      hi: socialConv * 0.2 * metaRem,
      note:
        "+10–20% of social conversions (avg 13%)" +
        (metaRem < 1 ? `, scaled to ${Math.round(metaRem * 100)}% remaining opportunity` : ""),
    });
    metaEvents = { lo: 20, avg: 25, hi: 40 }; // Meta event-match uplift (%)
  }
  if (socialModellable && tiktokOn && tiktokRem !== null) {
    convFeatures.push({
      label: "TikTok EAPI (Paid Social)",
      color: "#EE1D52",
      lo: socialConv * 0.13 * tiktokRem,
      avg: socialConv * 0.14 * tiktokRem,
      hi: socialConv * 0.19 * tiktokRem,
      note:
        "+13–19% of social conversions (avg 14%)" +
        (tiktokRem < 1 ? `, scaled to ${Math.round(tiktokRem * 100)}% remaining opportunity` : ""),
    });
  }

  const sess = sumTriple(sessionFeatures);
  const conv = sumTriple(convFeatures);

  return {
    cmOn,
    ecOn,
    gtgOn,
    sgtmOn,
    bqOn,
    sessions,
    conversions,
    optIn,
    safariPct,
    searchPct,
    dvPct,
    socialPct,
    hasSearch,
    hasVideo,
    hasSocial,
    adSpend,
    aov,
    sessionFeatures,
    convFeatures,
    metaEvents,
    sess,
    conv,
    cmSessionSkipped: cmOn && optIn === null,
  };
}
