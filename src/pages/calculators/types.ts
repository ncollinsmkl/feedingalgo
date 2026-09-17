/**
 * Shared types for the Algo Calculator suite (Data Strength + AI Value).
 */

/** The five discrete adoption-scale stops used by every feature slider. */
export type AdoptPct = 0 | 25 | 50 | 75 | 100;

/** State for a single feature's adoption slider + "Not applicable" toggle. */
export interface FeatureAdoption {
  /** Current slider position. Ignored (treated as inapplicable) when notApplicable is true. */
  pct: AdoptPct;
  notApplicable: boolean;
}

export function makeDefaultAdoption(): FeatureAdoption {
  return { pct: 0, notApplicable: false };
}

/**
 * Resolves a feature's adoption % to null when marked "Not applicable",
 * mirroring the original `adoptPct()` helper.
 */
export function resolveAdoptPct(f: FeatureAdoption): number | null {
  return f.notApplicable ? null : f.pct;
}

/** Remaining (not-yet-adopted) share of a feature's published uplift, as a fraction 0-1. */
export function remainingFrac(f: FeatureAdoption): number | null {
  const pct = resolveAdoptPct(f);
  return pct !== null ? (100 - pct) / 100 : null;
}

/** True whenever there's still uplift opportunity to model for this feature. */
export function hasOpportunity(f: FeatureAdoption): boolean {
  const r = remainingFrac(f);
  return r !== null && r > 0;
}

export const ADOPT_LABELS: Record<AdoptPct, string> = {
  0: "Not implemented",
  25: "Limited testing",
  50: "Scaling adoption",
  75: "Advanced",
  100: "Fully implemented",
};

/** Which marketing channels are active, or "baseline" for industry-average defaults. */
export interface ChannelSelection {
  baseline: boolean;
  search: boolean;
  video: boolean;
  social: boolean;
}

export function defaultChannelSelection(): ChannelSelection {
  return { baseline: true, search: false, video: false, social: false };
}

/** Fields shared between the two calculators via localStorage, keyed by field name. */
export interface SharedInputs {
  sessions?: string;
  conversions?: string;
  paid_search_pct?: string;
  dv_pct?: string;
  paid_social_pct?: string;
  search_spend?: string;
  dv_spend?: string;
  social_spend?: string;
  aov?: string;
}

export const SHARED_STORAGE_KEY = "peregrineSharedInputs";
