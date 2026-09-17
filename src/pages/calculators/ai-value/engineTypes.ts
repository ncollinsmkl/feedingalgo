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
  aov: string;
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
  aov: "50",
};

export function emptyUsage(): UsageFormState {
  return {
    sessions: "",
    conversions: "",
    paidSearchPct: "",
    dvPct: "",
    paidSocialPct: "",
    searchSpend: "",
    dvSpend: "",
    socialSpend: "",
    aov: "100",
  };
}
