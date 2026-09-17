import type { AiResults, Opportunity } from "./engine";
import { computeTotalOpportunity } from "./engine";
import { fmt, moneyShort, computeMascotMood } from "./resultsHelpers";
import { AI_GROUPS, AI_FEATURES } from "./featureLibrary";
import FeatureRevenueChart from "./FeatureRevenueChart";
import type { FeatureAdoption } from "../types";
import { resolveAdoptPct } from "../types";
import styles from "./AiValueCalculator.module.css";

interface Step3Props {
  results: AiResults;
  featureAdoption: Record<string, FeatureAdoption>;
  onBack: () => void;
  onDownloadPdf: () => void;
  onNext: () => void;
}

function FeatureCard({ o }: { o: Opportunity }) {
  if (o.type === "qual") {
    return (
      <div className={styles.featCard}>
        <div className={styles.fcTop}>
          <div className={styles.fcName}>{o.name}</div>
          <div className={`${styles.fcUplift} ${styles.qual}`}>Strategic / efficiency</div>
        </div>
        <div className={styles.fcWhy}>{o.desc}</div>
        <div className={styles.fcFoot}>
          {o.source}
          {o.foundation ? " · Measured in detail by the Data Strength Calculator." : ""}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.featCard}>
      <div className={styles.fcTop}>
        <div className={styles.fcName}>{o.name}</div>
        <div className={styles.fcUplift}>{o.upliftPct}</div>
      </div>
      <div style={{ marginTop: "0.4rem" }}>
        {o.convLo != null && (
          <>
            <span className={styles.fcMetric}>
              +{fmt(o.convLo)}–{fmt(o.convHi)} conversions
            </span>
            &nbsp;·&nbsp;
          </>
        )}
        <span className={styles.fcMetric}>
          {moneyShort(o.revLo || 0)}–{moneyShort(o.revHi || 0)} / month
        </span>
      </div>
      <div className={styles.fcWhy}>{o.desc}</div>
      <div className={styles.fcFoot}>
        Applied to {o.baseNote}. {o.source}
        {o.adoptNote ? " " + o.adoptNote : ""}
        {o.foundation ? " · Also covered by the Data Strength Calculator." : ""}
      </div>
    </div>
  );
}

export default function Step3AiResults({ results: d, featureAdoption, onBack, onDownloadPdf, onNext }: Step3Props) {
  const numeric = d.opportunities.filter((o) => o.type !== "qual");
  const enabled = AI_FEATURES.filter((f) => resolveAdoptPct(featureAdoption[f.key]) === 100);

  const withMid = numeric
    .map((o) => ({ ...o, mid: ((o.revLo || 0) + (o.revHi || 0)) / 2 }))
    .sort((a, b) => b.mid - a.mid);
  const top = withMid[0] || null;

  const total = computeTotalOpportunity(d, moneyShort);
  const mascot = computeMascotMood(featureAdoption);

  const groupedCards = AI_GROUPS.map((g) => {
    const items = d.opportunities.filter((o) => o.group === g.id);
    if (!items.length) return null;
    return (
      <div key={g.id}>
        <div className={styles.aiGroupHead}>
          <span className={styles.ghIcon}>{g.icon}</span>
          <div>
            <div className={styles.ghTitle}>{g.title}</div>
          </div>
        </div>
        {items.map((o) => (
          <FeatureCard key={o.key} o={o} />
        ))}
      </div>
    );
  });

  return (
    <div>
      <div id="resultsContent">
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🤖</div>
            <div>
              <div className={styles.cardTitle}>Your AI Value Opportunity</div>
              <div className={styles.cardSubtitle}>
                Estimated incremental value from AI ingredients not yet in your Algo's bowl.
                Each feature is shown independently; ranges are indicative and not additive.
              </div>
            </div>
          </div>

          <div className={styles.mascotRow}>
            <img src={mascot.image} alt="Algo the bear" />
          </div>
          <div className={styles.mascotCaption}>{mascot.line}</div>

          <div className={styles.metricsRow}>
            <div className={`${styles.metricCard} ${styles.uplift}`}>
              <div className={styles.metricLbl}>Total predicted opportunity</div>
              <div className={styles.metricVal}>{total.display}</div>
              <div className={styles.metricSub}>{total.sub}</div>
            </div>
            <div className={`${styles.metricCard} ${styles.upliftConv}`}>
              <div className={styles.metricLbl}>AI ingredients not yet fed</div>
              <div className={styles.metricVal}>{d.opportunities.length}</div>
              <div className={styles.metricSub}>{numeric.length} with a modelled value range</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLbl}>Largest single opportunity</div>
              <div className={styles.metricVal}>
                {top ? `${moneyShort(top.revLo || 0)}–${moneyShort(top.revHi || 0)}` : "—"}
              </div>
              <div className={styles.metricSub}>
                {top ? `${top.name} / month` : 'Mark features as "No" to model'}
              </div>
            </div>
          </div>

          {d.opportunities.length === 0 && (
            <div className={styles.callout}>
              No opportunities modelled yet. Mark one or more AI features as{" "}
              <strong>"No"</strong> in Step 1 to see what your Algo's missing.
            </div>
          )}

          {enabled.length > 0 && (
            <div className={styles.callout} style={{ marginTop: "1rem" }}>
              ✅ <strong>Already in the bowl: {enabled.length} AI ingredient{enabled.length > 1 ? "s" : ""}:</strong>{" "}
              {enabled.map((f) => f.name).join(", ")}. Nice, these are already working for you,
              so no incremental opportunity is shown.
            </div>
          )}
        </div>

        {numeric.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📈</div>
              <div>
                <div className={styles.cardTitle}>Monthly Revenue Opportunity by Feature</div>
                <div className={styles.cardSubtitle}>
                  Low → high estimated incremental revenue per feature (shown separately, not
                  summed)
                </div>
              </div>
            </div>
            <FeatureRevenueChart numericOpportunities={numeric} />
          </div>
        )}

        {d.opportunities.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📋</div>
              <div>
                <div className={styles.cardTitle}>Feature-by-Feature Breakdown</div>
                <div className={styles.cardSubtitle}>
                  What each unused feature could contribute, grouped by driver category
                </div>
              </div>
            </div>
            {groupedCards}
            <div className={styles.disclaimerBox}>
              ⚠️ <strong>Indicative estimates.</strong> Ranges are derived from Google's
              published benchmark and case-study data, supplemented by our internal data, and
              applied to the figures you entered. Actual results vary by account, vertical,
              creative and competitive context. Per-feature uplifts are shown{" "}
              <strong>independently and are not additive</strong>. The{" "}
              <strong>Total predicted opportunity</strong> is therefore not a simple sum, it
              applies a diminishing-returns adjustment and is capped at 2× your current
              revenue, since overlapping features cannot all deliver their full uplift at once.
            </div>
          </div>
        )}
      </div>

      <div className={styles.btnActions}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onBack}>
          ← Revise Inputs
        </button>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className={`${styles.btn} ${styles.btnPdf}`} onClick={onDownloadPdf}>
            ⬇ Download PDF
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNext}>
            What's Next →
          </button>
        </div>
      </div>
    </div>
  );
}
