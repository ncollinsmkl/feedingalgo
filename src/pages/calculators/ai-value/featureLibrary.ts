/**
 * AI FEATURE LIBRARY
 * ------------------
 * Uplift figures are sourced from Google's "AI-Powered Media, Search & Video
 * Value Calculator" (Q2'2024). Value Drivers Consolidated tab.
 *
 * type:  'conv'  -> % uplift applied to conversions (then x value for revenue)
 *        'value' -> % uplift applied to conversion VALUE / revenue only
 *        'qual'  -> qualitative / efficiency driver (no modelled value, shown as context)
 * scope: 'search' | 'video' | 'all' -> which conversion base the uplift applies to
 * bench: the benchmark uplift(s) as fractions (0.18 = +18%). One of:
 *        number          -> a single published figure; a +/-20% band is applied (see SINGLE_BAND)
 *        [lo, hi]        -> an explicit published range, used as-is
 *        {search, video} -> channel-specific figures; the displayed range is built from
 *                          ONLY the channels in the user's mix (e.g. Search-only customers
 *                          see the Search figure, not the YouTube figure)
 */
export type FeatureType = "conv" | "value" | "qual";
export type FeatureScope = "search" | "video" | "all";
export type FeatureGroupId = "foundations" | "search" | "video" | "advanced";

export type Bench = number | [number, number] | { all?: number; search?: number; video?: number; social?: number };

export interface AiFeature {
  key: string;
  group: FeatureGroupId;
  name: string;
  desc: string;
  type: FeatureType;
  scope?: FeatureScope;
  bench?: Bench;
  foundation?: boolean;
  source: string;
}

export interface AiFeatureGroup {
  id: FeatureGroupId;
  icon: string;
  title: string;
  sub: string;
}

export const AI_GROUPS: AiFeatureGroup[] = [
  {
    id: "foundations",
    icon: "🧱",
    title: "Durable AI Foundations",
    sub: "The data layer Google's AI feeds on, also measured by the Data Strength Calculator",
  },
  {
    id: "search",
    icon: "🔍",
    title: "AI-Powered Search & Performance",
    sub: "Keywordless reach, automated bidding and creative across Search, PMax & Demand Gen",
  },
  {
    id: "video",
    icon: "🎬",
    title: "AI-Powered Video",
    sub: "YouTube campaign types supercharged by Google AI",
  },
  {
    id: "advanced",
    icon: "☁️",
    title: "Applied AI, Cloud & GenAI",
    sub: "Modelling, measurement and generative use cases",
  },
];

export const AI_FEATURES: AiFeature[] = [
  // -- Foundations --
  {
    key: "measurement_foundation",
    group: "foundations",
    name: "Measurement Foundation (Google tag + GA4)",
    desc: "Robust sitewide tagging via the Google tag and GA4, the most essential component of the AI measurement stack.",
    type: "qual",
    foundation: true,
    source: "Privacy capability building that unlocks downstream value (+17–200% conversions in case studies).",
  },
  {
    key: "enhanced_conversions",
    group: "foundations",
    name: "Enhanced Conversions",
    desc: "Unlock higher quality and more accurate conversion data, providing significant long-term benefit for all AI-powered bidding.",
    type: "conv",
    scope: "all",
    bench: { search: 0.05, video: 0.17 },
    foundation: true,
    source: "Benchmark: +5% conversion rate (Search), +17% (YouTube for Action) range reflects channels in your mix.",
  },
  {
    key: "consent_mode",
    group: "foundations",
    name: "Consent Mode",
    desc: "Collects & communicates consent signals while preserving comprehensive measurement via modelling.",
    type: "conv",
    scope: "all",
    bench: 0.07,
    foundation: true,
    source: "Benchmark: +7% conversions globally, shown ±20% (case studies +3–44%).",
  },

  // -- Search & Performance --
  {
    key: "budgets_targets",
    group: "search",
    name: "Demand-Led Budgeting",
    desc: "Agile budgets and growth-oriented targets let the AI capitalise on peak demand without missing sales.",
    type: "qual",
    source: "Budget-agile marketers are 25% more likely to report stronger performance (case studies +88% conversions).",
  },
  {
    key: "broad_match",
    group: "search",
    name: "Broad Match (with Smart Bidding)",
    desc: "Captures more demand within your profitability constraints, using AI to prioritise the most relevant keywords.",
    type: "conv",
    scope: "search",
    bench: [0.12, 0.35],
    source: "Benchmark: +12–35% more conversions upgrading exact → broad match with Smart Bidding.",
  },
  {
    key: "rsa",
    group: "search",
    name: "Responsive Search Ads (excellent ad strength)",
    desc: "AI-powered Search ads show the most relevant ad for every query; higher Ad Strength lifts performance.",
    type: "conv",
    scope: "search",
    bench: 0.12,
    source: "Benchmark: +12% conversions improving ad strength from Poor to Excellent, shown ±20%.",
  },
  {
    key: "ai_max",
    group: "search",
    name: "AI Max",
    desc: "AI-driven optimization layer within Google Search campaigns that automatically expands reach, generates dynamic ad text, and routes landing pages using broad match, keywordless technology, and real-time user intent signals.",
    type: "conv",
    scope: "search",
    bench: [0.14, 0.27],
    source: "Benchmark: +14% typical uplift in conversions, rising to +27% at the higher end.",
  },
  {
    key: "pmax",
    group: "search",
    name: "Performance Max",
    desc: "AI-driven Google Ads campaign type that automatically finds additional converting customers across all of Google's channels, including; Search, YouTube, Display, and Discover, using a single, unified setup",
    type: "conv",
    scope: "search",
    bench: [0.18, 0.31],
    source: "Benchmark: +18% more conversions at similar CPA (case studies +30–31%).",
  },
  {
    key: "demand_gen",
    group: "search",
    name: "Demand Gen",
    desc: "Google's AI-powered mid-funnel solution to find and engage new audiences at scale across YouTube, Discover & Gmail.",
    type: "conv",
    scope: "search",
    bench: [0.04, 0.06],
    source: "Benchmark: +4–6% more conversions per dollar running image + video.",
  },
  {
    key: "vbb",
    group: "search",
    name: "Value-Based Bidding (VBB)",
    desc: "AI bids flexibly, combined with your data, to win the customers that maximise overall business value.",
    type: "value",
    scope: "search",
    bench: 0.14,
    source: "Benchmark: +14% more conversion value at similar ROAS, shown ±20% (case studies +11–50%).",
  },
  {
    key: "cross_vbb",
    group: "search",
    name: "Cross-Platform VBB (Demand Gen + PMax)",
    desc: "Demand Gen for mid-funnel demand with PMax driving low-funnel actions, a complementary AI strategy.",
    type: "conv",
    scope: "search",
    bench: [0.13, 0.35],
    source: "Benchmark: +13–35% conversions, +82–387% clicks, –8–69% lower CPA.",
  },
  {
    key: "dynamic_creative",
    group: "search",
    name: "Dynamic / Data-Driven Creative",
    desc: "Selects individual creative elements in real time for dynamic serving across your campaigns.",
    type: "conv",
    scope: "all",
    bench: [0.15, 0.5],
    source: "Benchmark: data-driven creatives generate ~50% more conversions than standard HTML5 (+40% CTR).",
  },
  {
    key: "dda",
    group: "search",
    name: "Data-Driven Attribution (Smart Bidding)",
    desc: "ML assigns fractional credit across touchpoints; Smart Bidding reacts to those insights for performance gains.",
    type: "conv",
    scope: "all",
    bench: 0.06,
    source: "Benchmark: +6% more conversions switching to data-driven attribution, shown ±20% (case studies +8–23%).",
  },
  {
    key: "customer_match",
    group: "search",
    name: "Customer Match / refreshed 1P data",
    desc: "Fresh first-party data pipelines give the AI richer signals for bid optimisation, lifting traffic & conversions.",
    type: "conv",
    scope: "all",
    bench: [0.053, 0.17],
    source: "Benchmark: +5.3% to +17% conversions (Customer Match, refreshed lists).",
  },
  {
    key: "propensity",
    group: "search",
    name: "Purchase Probability / Propensity Modelling",
    desc: "Activate predictive GA4 audiences (purchase probability, LTV, segmentation) to bid to your highest-value users.",
    type: "value",
    scope: "all",
    bench: [0.2, 0.25],
    source: "Benchmark: +20–25% average increase in ROAS from GA4-based AI audiences.",
  },
  {
    key: "high_value_modeling",
    group: "search",
    name: "High-Value Action Modelling",
    desc: "AI identifies on-site actions correlated with sales; outputs define the conversion values used in VBB.",
    type: "value",
    scope: "all",
    bench: 0.14,
    source: "Benchmark: +14% more conversion value (bidding to high-value actions), shown ±20%.",
  },

  // -- Video --
  {
    key: "video_action",
    group: "video",
    name: "Video Action Campaigns",
    desc: "Drives consideration, engagement and action with video, supercharged by Google AI optimised targeting.",
    type: "conv",
    scope: "video",
    bench: 0.2,
    source: "Benchmark: +20% more conversions with Optimised Targeting at comparable CPA, shown ±20%.",
  },
  {
    key: "video_reach",
    group: "video",
    name: "Video Reach Campaigns",
    desc: "Google AI finds as many people as possible in your target audience at the lowest possible price.",
    type: "qual",
    source: "Benchmark: 3.7× higher ROAS, +54% unique reach, –42% lower costs vs manual.",
  },
  {
    key: "video_view",
    group: "video",
    name: "Video View Campaigns",
    desc: "Maximises views and lowers cost-per-view, building brand consideration with Google AI.",
    type: "qual",
    source: "Benchmark: +40% more views at –42% lower cost-per-view than manual campaigns.",
  },
  {
    key: "ctv",
    group: "video",
    name: "Connected TV (CTV)",
    desc: "Google AI supercharges your unification strategy on the living-room screen with frequency management.",
    type: "qual",
    source: "Benchmark: +13% unique reach, +35–165% higher ROAS, frequency-managed.",
  },

  // -- Advanced / Cloud & GenAI --
  {
    key: "mmm",
    group: "advanced",
    name: "Media Mix Modelling (MMM)",
    desc: "Closes measurement gaps, attributes ROI across channels and forecasts the impact of future plans.",
    type: "qual",
    source: "Benchmark: +84–108% YouTube ROAS understanding (Nielsen meta-analysis).",
  },
  {
    key: "cloud_consult",
    group: "advanced",
    name: "Cloud Consultation / data readiness",
    desc: "Assess readiness to harness 1P data with privacy in mind, and map marketing AI use cases.",
    type: "qual",
    source: "Assessment unlocking downstream AI use cases (value realised via the solutions it enables).",
  },
  {
    key: "gen_ai",
    group: "advanced",
    name: "GenAI Creative (Ads Creative Studio)",
    desc: "Use Google AI to generate new versions of images and assets to use across your campaigns.",
    type: "qual",
    source: "Early testing and development: case studies show +40% CTR, –58% CPLU, –32% CPV.",
  },
];

const SINGLE_BAND = 0.2; // single-point benchmarks get a +/-20% lower/upper band
export const TOTAL_CAP_MULTIPLE = 2; // combined opportunity can't exceed this x current revenue

export interface ChannelMix {
  search: boolean;
  video: boolean;
  social: boolean;
}

/** Resolves a feature's `bench` into a {lo, hi} fractional range given the channel mix. */
export function computeRange(bench: Bench | undefined, mix: ChannelMix): { lo: number; hi: number } {
  if (bench === undefined) return { lo: 0, hi: 0 };
  if (Array.isArray(bench)) return { lo: bench[0], hi: bench[1] };
  if (typeof bench === "number") {
    return { lo: bench * (1 - SINGLE_BAND), hi: bench * (1 + SINGLE_BAND) };
  }
  // Channel-specific object: collect figures for the channels actually in the mix.
  const pts: number[] = [];
  if (bench.all != null) pts.push(bench.all);
  if (mix.search && bench.search != null) pts.push(bench.search);
  if (mix.video && bench.video != null) pts.push(bench.video);
  if (mix.social && bench.social != null) pts.push(bench.social);
  // No matching channel selected -> fall back to every published figure so we still show something.
  if (!pts.length) {
    Object.values(bench).forEach((v) => {
      if (typeof v === "number") pts.push(v);
    });
  }
  let lo = Math.min(...pts);
  let hi = Math.max(...pts);
  if (lo === hi) {
    // single resulting figure -> band it
    lo = lo * (1 - SINGLE_BAND);
    hi = hi * (1 + SINGLE_BAND);
  }
  return { lo, hi };
}
