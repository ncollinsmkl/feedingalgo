/**
 * Step 4 implementation roadmap — dynamic Gantt timeline builder.
 * Ported 1:1 from buildDynamicTimeline() in data-strength-calculator.html.
 */

export type RoadmapFeatureKey =
  | "consent_mode"
  | "enhanced_conv"
  | "gtg"
  | "sgtm"
  | "meta_tik"
  | "bigquery";

export interface RoadmapFeatureMeta {
  key: RoadmapFeatureKey;
  label: string;
}

export const FEATURE_META: RoadmapFeatureMeta[] = [
  { key: "consent_mode", label: "Advanced Consent Mode" },
  { key: "enhanced_conv", label: "Enhanced Conversions" },
  { key: "gtg", label: "Google Tag Gateway" },
  { key: "sgtm", label: "Server-Side GTM" },
  { key: "meta_tik", label: "Meta CAPI / TikTok EAPI" },
  { key: "bigquery", label: "BigQuery" },
];

interface Duration {
  audit: number;
  impl: number;
  qa: number;
}

const FEATURE_DURATIONS: Record<RoadmapFeatureKey, Duration> = {
  consent_mode: { audit: 2, impl: 2, qa: 1 },
  enhanced_conv: { audit: 2, impl: 3, qa: 1 },
  gtg: { audit: 2, impl: 3, qa: 3 },
  sgtm: { audit: 2, impl: 6, qa: 3 },
  meta_tik: { audit: 1, impl: 3, qa: 2 },
  bigquery: { audit: 2, impl: 3, qa: 2 },
};

export type PhaseType = "audit" | "impl" | "qa";

export interface Phase {
  type: PhaseType;
  start: number;
  end: number;
}

export interface TimedFeature extends RoadmapFeatureMeta {
  phases: Phase[];
}

interface ComputedSpan {
  auditStart: number;
  auditEnd: number;
  implStart: number;
  implEnd: number;
  qaStart: number;
  qaEnd: number;
}

/**
 * Builds a dependency-aware Gantt timeline for the given features.
 *
 * Track 1 - Tagging (GTG + sGTM): always start at Week 1, independent of
 * everything else.
 *
 * Track 2 - Measurement (Consent Mode -> Enhanced Conversions): sequential
 * chain, each step's audit shifted right to butt against the previous
 * step's impl start, so there are no gaps.
 *
 * BigQuery - positioned by its own dependency rule (in priority order):
 *   1. If sGTM is selected, BQ impl starts when sGTM impl finishes.
 *   2. Else if GTG is selected, BQ impl starts when GTG impl finishes.
 *   3. Else if EC is selected, BQ audit starts alongside EC's audit.
 *   4. Else if CM is selected, BQ impl starts when CM impl finishes.
 *   5. Else BQ starts at Week 1.
 *
 * Meta CAPI / TikTok EAPI ride on top of the sGTM build.
 */
export function buildDynamicTimeline(toImplement: RoadmapFeatureMeta[]): {
  features: TimedFeature[];
  totalWeeks: number;
} {
  const selectedKeys = new Set(toImplement.map((f) => f.key));
  const computed: Partial<Record<RoadmapFeatureKey, ComputedSpan>> = {};

  // Track 1: GTG + sGTM - always start at Week 1
  (["gtg", "sgtm"] as const)
    .filter((k) => selectedKeys.has(k))
    .forEach((key) => {
      const d = FEATURE_DURATIONS[key];
      const auditStart = 0;
      const auditEnd = d.audit;
      const implStart = auditEnd;
      const implEnd = implStart + d.impl;
      const qaStart = implEnd;
      const qaEnd = qaStart + d.qa;
      computed[key] = { auditStart, auditEnd, implStart, implEnd, qaStart, qaEnd };
    });

  // Track 2: Consent Mode -> Enhanced Conversions
  let nextAuditStart = 0;
  let nextImplStart = 0;

  (
    [["consent_mode"], ["enhanced_conv"]] as RoadmapFeatureKey[][]
  ).forEach((groupKeys) => {
    const activeKeys = groupKeys.filter((k) => selectedKeys.has(k));
    if (activeKeys.length === 0) return;

    let groupLatestImplStart = nextImplStart;
    let groupLatestImplEnd = 0;

    activeKeys.forEach((key) => {
      const d = FEATURE_DURATIONS[key];
      const auditStart = Math.max(nextAuditStart, nextImplStart - d.audit);
      const auditEnd = auditStart + d.audit;
      const implStart = auditEnd;
      const implEnd = implStart + d.impl;
      const qaStart = implEnd;
      const qaEnd = qaStart + d.qa;
      computed[key] = { auditStart, auditEnd, implStart, implEnd, qaStart, qaEnd };
      groupLatestImplStart = Math.max(groupLatestImplStart, implStart);
      groupLatestImplEnd = Math.max(groupLatestImplEnd, implEnd);
    });

    nextAuditStart = groupLatestImplStart;
    nextImplStart = groupLatestImplEnd;
  });

  // BigQuery - positioned by its own dependency rules
  if (selectedKeys.has("bigquery")) {
    const d = FEATURE_DURATIONS.bigquery;
    let bqImplStart: number;
    let bqAuditStart: number;

    if (computed.sgtm) {
      bqImplStart = computed.sgtm.implEnd;
      bqAuditStart = bqImplStart - d.audit;
    } else if (computed.gtg) {
      bqImplStart = computed.gtg.implEnd;
      bqAuditStart = bqImplStart - d.audit;
    } else if (computed.enhanced_conv) {
      bqAuditStart = computed.enhanced_conv.auditStart;
      bqImplStart = bqAuditStart + d.audit;
    } else if (computed.consent_mode) {
      bqImplStart = computed.consent_mode.implEnd;
      bqAuditStart = bqImplStart - d.audit;
    } else {
      bqAuditStart = 0;
      bqImplStart = d.audit;
    }

    // Guard against negative audit start (very short prior phases)
    bqAuditStart = Math.max(0, bqAuditStart);

    const bqAuditEnd = bqAuditStart + d.audit;
    const bqImplEnd = bqImplStart + d.impl;
    const bqQaStart = bqImplEnd;
    const bqQaEnd = bqQaStart + d.qa;
    computed.bigquery = {
      auditStart: bqAuditStart,
      auditEnd: bqAuditEnd,
      implStart: bqImplStart,
      implEnd: bqImplEnd,
      qaStart: bqQaStart,
      qaEnd: bqQaEnd,
    };
  }

  // Meta CAPI / TikTok EAPI - delivered on top of sGTM
  if (selectedKeys.has("meta_tik")) {
    const d = FEATURE_DURATIONS.meta_tik;
    const implStart = computed.sgtm ? computed.sgtm.implEnd : d.audit;
    const auditStart = Math.max(0, implStart - d.audit);
    const auditEnd = auditStart + d.audit;
    const implEnd = implStart + d.impl;
    const qaStart = implEnd;
    const qaEnd = qaStart + d.qa;
    computed.meta_tik = { auditStart, auditEnd, implStart, implEnd, qaStart, qaEnd };
  }

  const totalWeeks = Math.max(...Object.values(computed).map((p) => p!.qaEnd));

  const features: TimedFeature[] = toImplement.map((f) => {
    const c = computed[f.key]!;
    return {
      ...f,
      phases: [
        { type: "audit", start: c.auditStart, end: c.auditEnd },
        { type: "impl", start: c.implStart, end: c.implEnd },
        { type: "qa", start: c.qaStart, end: c.qaEnd },
      ],
    };
  });

  return { features, totalWeeks };
}
