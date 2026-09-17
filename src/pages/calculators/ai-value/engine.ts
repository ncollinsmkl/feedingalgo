import type { FeatureAdoption } from "../types";
import { hasOpportunity, remainingFrac, resolveAdoptPct } from "../types";
import { AI_FEATURES, computeRange, TOTAL_CAP_MULTIPLE, type ChannelMix, type FeatureGroupId, type FeatureType } from "./featureLibrary";

export interface AiUsageInputs {
  sessions: number;
  conversions: number;
  aov: number;
  baseline: boolean;
  channels: ChannelMix;
  searchPct: number;
  dvPct: number;
  socialPct: number;
  searchSpend: number | null;
  dvSpend: number | null;
  socialSpend: number | null;
}

export interface Opportunity {
  key: string;
  name: string;
  group: FeatureGroupId;
  type: FeatureType;
  source: string;
  foundation: boolean;
  desc: string;
  adoptPct: number | null;
  baseNote?: string;
  convLo?: number | null;
  convHi?: number | null;
  revLo?: number;
  revHi?: number;
  upliftPct?: string;
  adoptNote?: string;
}

export interface AiResults {
  sessions: number;
  conversions: number;
  aov: number;
  currentRevenue: number;
  adSpend: number | null;
  baseline: boolean;
  channels: ChannelMix;
  searchPct: number;
  dvPct: number;
  socialPct: number;
  opportunities: Opportunity[];
}

/** "+18%" or "+18–31%", matching the original pctStr(). */
export function pctStr(min: number, max: number): string {
  if (min === max) return "+" + (min * 100).toFixed(0) + "%";
  return "+" + (min * 100).toFixed(0) + "–" + (max * 100).toFixed(0) + "%";
}

/**
 * Which conversion base a feature's uplift applies to, matching convBase()
 * in the original calculateAndShow().
 */
function convBase(
  scope: "search" | "video" | "all" | undefined,
  conversions: number,
  searchPct: number,
  dvPct: number
): { n: number; note: string } {
  if (scope === "search" && searchPct > 0) {
    return { n: (conversions * searchPct) / 100, note: `paid-search conversions (${searchPct}% of traffic)` };
  }
  if (scope === "video" && dvPct > 0) {
    return { n: (conversions * dvPct) / 100, note: `video conversions (${dvPct}% of traffic)` };
  }
  return { n: conversions, note: "total conversions" };
}

/**
 * Runs the full AI Value calculation for every feature with remaining
 * adoption opportunity. Ported 1:1 from calculateAndShow()'s opportunities
 * builder in the original ai-value-calculator.html.
 */
export function calculateAiValue(
  featureAdoption: Record<string, FeatureAdoption>,
  usage: AiUsageInputs,
  searchGroupVisible: boolean,
  videoGroupVisible: boolean
): AiResults {
  const { sessions, conversions, aov, searchPct, dvPct, socialPct } = usage;

  const spendVals = [usage.searchSpend, usage.dvSpend, usage.socialSpend].filter(
    (v): v is number => v !== null && v > 0
  );
  const adSpend = spendVals.length ? spendVals.reduce((a, b) => a + b, 0) : null;
  const currentRevenue = conversions * aov;

  // Channel mix: baseline counts as the full mix; otherwise use the selected channels.
  const mix: ChannelMix = usage.baseline
    ? { search: true, video: true, social: true }
    : usage.channels;

  const opportunities: Opportunity[] = AI_FEATURES.map((f) => {
    if (f.group === "search" && !searchGroupVisible) return null;
    if (f.group === "video" && !videoGroupVisible) return null;

    const adoption = featureAdoption[f.key];
    if (!adoption || !hasOpportunity(adoption)) return null;

    const rem = remainingFrac(adoption)!;
    const adoptPctVal = resolveAdoptPct(adoption);

    const r: Opportunity = {
      key: f.key,
      name: f.name,
      group: f.group,
      type: f.type,
      source: f.source,
      foundation: !!f.foundation,
      desc: f.desc,
      adoptPct: adoptPctVal,
    };
    if (f.type === "qual") return r;

    const range = computeRange(f.bench, mix);
    const scaledLo = range.lo * rem;
    const scaledHi = range.hi * rem;

    if (f.type === "conv") {
      const b = convBase(f.scope, conversions, searchPct, dvPct);
      r.baseNote = b.note;
      r.convLo = b.n * scaledLo;
      r.convHi = b.n * scaledHi;
      r.revLo = r.convLo * aov;
      r.revHi = r.convHi * aov;
      r.upliftPct = pctStr(scaledLo, scaledHi);
      r.adoptNote =
        rem < 1 ? `Scaled to your ${Math.round(rem * 100)}% remaining opportunity (currently ${adoptPctVal}% adopted).` : "";
    } else {
      // value
      const b = convBase(f.scope, conversions, searchPct, dvPct);
      r.baseNote = b.note;
      const rev = b.n * aov;
      r.revLo = rev * scaledLo;
      r.revHi = rev * scaledHi;
      r.convLo = null;
      r.convHi = null;
      r.upliftPct = pctStr(scaledLo, scaledHi) + " value";
      r.adoptNote =
        rem < 1 ? `Scaled to your ${Math.round(rem * 100)}% remaining opportunity (currently ${adoptPctVal}% adopted).` : "";
    }
    return r;
  }).filter((o): o is Opportunity => o !== null);

  return {
    sessions,
    conversions,
    aov,
    currentRevenue,
    adSpend,
    baseline: usage.baseline,
    channels: usage.channels,
    searchPct,
    dvPct,
    socialPct,
    opportunities,
  };
}

export interface TotalOpportunity {
  lo: number;
  hi: number;
  display: string;
  sub: string;
}

/**
 * "Total predicted opportunity": not a naive sum. The aggregated uplift is
 * passed through an exponential-saturation curve that scales up as more
 * features are added but can never exceed the cap (TOTAL_CAP_MULTIPLE x
 * current revenue). Ported 1:1 from renderResults().
 */
export function computeTotalOpportunity(results: AiResults, moneyShort: (n: number) => string): TotalOpportunity {
  const numeric = results.opportunities.filter((o) => o.type !== "qual");
  const cap = TOTAL_CAP_MULTIPLE * (results.currentRevenue || 0);
  const sumLo = numeric.reduce((a, o) => a + (o.revLo || 0), 0);
  const sumHi = numeric.reduce((a, o) => a + (o.revHi || 0), 0);
  const factored = (x: number) => (cap > 0 ? cap * (1 - Math.exp(-x / cap)) : x);
  const totalLo = factored(sumLo);
  const totalHi = factored(sumHi);
  const display = cap > 0 && numeric.length ? `${moneyShort(totalLo)}–${moneyShort(totalHi)}` : "—";
  const sub =
    cap > 0
      ? numeric.length
        ? `Adjusted for overlap · capped at ${TOTAL_CAP_MULTIPLE}× current revenue`
        : 'Mark features as "No" to model'
      : "Enter conversions & value to model";
  return { lo: totalLo, hi: totalHi, display, sub };
}
