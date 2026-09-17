import type { AdoptPct } from "../types";
import type { DataStrengthResults } from "./engine";
import { fmt, moneyShort, upliftStr, computeMascotMood, type FeatureTag } from "./resultsHelpers";
import BreakdownTable from "./BreakdownTable";
import ProjectionBarChart from "./ProjectionBarChart";
import ContributionChart from "./ContributionChart";
import styles from "./DataStrengthCalculator.module.css";

interface Step3Props {
  results: DataStrengthResults;
  featureTags: FeatureTag[];
  onBack: () => void;
  onDownloadPdf: () => void;
  onNext: () => void;
}

export default function Step3Results({
  results: d,
  featureTags,
  onBack,
  onDownloadPdf,
  onNext,
}: Step3Props) {
  const hasSessUp = d.sessionFeatures.length > 0 && d.sessions > 0;
  const hasConvUp = d.convFeatures.length > 0 && d.conversions > 0;

  const projSess = {
    lo: d.sessions + d.sess.lo,
    avg: d.sessions + d.sess.avg,
    hi: d.sessions + d.sess.hi,
  };
  const projConv = {
    lo: d.conversions + d.conv.lo,
    avg: d.conversions + d.conv.avg,
    hi: d.conversions + d.conv.hi,
  };

  const sessUp = hasSessUp
    ? upliftStr(d.sess.lo / d.sessions, d.sess.avg / d.sessions, d.sess.hi / d.sessions)
    : null;
  const convUp = hasConvUp
    ? upliftStr(d.conv.lo / d.conversions, d.conv.avg / d.conversions, d.conv.hi / d.conversions)
    : null;

  const answeredTags = featureTags.filter((f): f is { name: string; val: AdoptPct } => f.val !== null);
  const fullyDoneTags = answeredTags.filter((f) => f.val === 100);
  const partialOrNotStarted = answeredTags.filter((f) => f.val < 100);

  const mascot = computeMascotMood(featureTags);

  const revenueCard =
    d.aov && hasConvUp
      ? (() => {
          const revLo = d.conv.lo * d.aov!;
          const revAvg = d.conv.avg * d.aov!;
          const revHi = d.conv.hi * d.aov!;
          return (
            <div
              className={styles.metricCard}
              style={{ borderColor: "rgba(90,169,107,0.35)", background: "rgba(90,169,107,0.04)" }}
            >
              <div className={styles.metricLbl}>Est. Incremental Revenue</div>
              <div className={styles.metricVal} style={{ color: "var(--green)" }}>
                +{moneyShort(revAvg)}
              </div>
              <div className={styles.metricRange}>
                Low +{moneyShort(revLo)} · High +{moneyShort(revHi)}
              </div>
            </div>
          );
        })()
      : null;

  const bqCard = d.bqOn ? (
    <div
      className={styles.metricCard}
      style={{ borderColor: "rgba(76,134,214,0.35)", background: "rgba(76,134,214,0.04)" }}
    >
      <div className={styles.metricLbl}>BigQuery Opportunity</div>
      <div className={styles.metricVal} style={{ fontSize: "1rem", color: "var(--sky)" }}>
        Not yet enabled
      </div>
      <div className={styles.metricSub}>
        Enabling BigQuery unlocks raw event-level analysis, custom attribution & ML-ready
        audiences
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div id="resultsContent">
        {/* Summary */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>✨</div>
            <div>
              <div className={styles.cardTitle}>Your Data Strength Results</div>
              <div className={styles.cardSubtitle}>
                Estimated uplift from enabling Google data features: low / projection / high,
                all indicative ranges based on industry benchmarks
              </div>
            </div>
          </div>

          <div className={styles.mascotRow}>
            <img src={mascot.image} alt="Algo the bear" />
          </div>
          <div className={styles.mascotCaption}>{mascot.line}</div>

          {partialOrNotStarted.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--red)",
                  marginBottom: "0.5rem",
                }}
              >
                ✕ Room to grow — the gap between current adoption and 100% drives the uplift
                shown below
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {partialOrNotStarted.map((f) => (
                  <span key={f.name} className={`${styles.ftag} ${styles.ftagNo}`}>
                    ✕ {f.name} — {f.val}%
                  </span>
                ))}
              </div>
            </div>
          )}

          {fullyDoneTags.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--green)",
                  marginBottom: "0.5rem",
                }}
              >
                ✓ Fully implemented
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {fullyDoneTags.map((f) => (
                  <span key={f.name} className={`${styles.ftag} ${styles.ftagYes}`}>
                    ✓ {f.name} — {f.val}%
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.metricsRow}>
            <div className={styles.metricCard}>
              <div className={styles.metricLbl}>Current Sessions</div>
              <div className={styles.metricVal}>{fmt(d.sessions)}</div>
              <div className={styles.metricSub}>per month (observed)</div>
            </div>
            {hasSessUp ? (
              <div className={`${styles.metricCard} ${styles.uplift}`}>
                <div className={styles.metricLbl}>Projected Sessions</div>
                <div className={styles.metricVal}>{fmt(projSess.avg)}</div>
                <div className={styles.metricRange}>
                  Low {fmt(projSess.lo)} · High {fmt(projSess.hi)}
                </div>
                <div className={styles.metricUp}>
                  {sessUp!.avg} {sessUp!.range} uplift
                </div>
              </div>
            ) : (
              <div className={styles.metricCard} style={{ opacity: 0.5 }}>
                <div className={styles.metricLbl}>Projected Sessions</div>
                <div className={styles.metricVal}>—</div>
                <div className={styles.metricSub}>No session-recovering opportunity remaining</div>
              </div>
            )}
            {revenueCard ?? <div className={styles.metricCard} style={{ visibility: "hidden" }} />}
          </div>

          <div className={styles.metricsRow}>
            <div className={styles.metricCard}>
              <div className={styles.metricLbl}>Current Conversions</div>
              <div className={styles.metricVal}>{fmt(d.conversions)}</div>
              <div className={styles.metricSub}>per month (observed)</div>
            </div>
            {hasConvUp ? (
              <div className={`${styles.metricCard} ${styles.upliftConv}`}>
                <div className={styles.metricLbl}>Projected Conversions</div>
                <div className={styles.metricVal}>{fmt(projConv.avg)}</div>
                <div className={styles.metricRange}>
                  Low {fmt(projConv.lo)} · High {fmt(projConv.hi)}
                </div>
                <div className={styles.metricUp}>
                  {convUp!.avg} {convUp!.range} uplift
                </div>
              </div>
            ) : (
              <div className={styles.metricCard} style={{ opacity: 0.5 }}>
                <div className={styles.metricLbl}>Projected Conversions</div>
                <div className={styles.metricVal}>—</div>
                <div className={styles.metricSub}>No conversion opportunity remaining</div>
              </div>
            )}
            {bqCard ?? <div className={styles.metricCard} style={{ visibility: "hidden" }} />}
          </div>

          {!hasSessUp && !hasConvUp && (
            <div className={styles.callout}>
              <strong>No uplift features enabled.</strong> Mark one or more features as "No"
              in Step 1 and re-run the calculator to see your projected gains.
            </div>
          )}
        </div>

        {/* Charts */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>📈</div>
            <div>
              <div className={styles.cardTitle}>Uplift Visualisation</div>
              <div className={styles.cardSubtitle}>
                Current vs low / projection / high estimates, plus each feature's contribution
                range
              </div>
            </div>
          </div>

          <div>
            <div className={styles.chartTitle}>Feature Contribution to Uplift (range breakdown)</div>
            <ContributionChart
              sessionFeatures={d.sessionFeatures}
              convFeatures={d.convFeatures}
              sessions={d.sessions}
              conversions={d.conversions}
            />
          </div>

          <hr className={styles.sectionDivider} />

          <div className={styles.chartsGrid}>
            <ProjectionBarChart
              title="Sessions: Current vs Projected"
              current={d.sessions}
              projected={hasSessUp ? projSess : null}
              unitLabel="sessions"
              midLabel="Projection"
              colors={["rgba(239,127,59,0.45)", "rgba(239,127,59,0.85)", "rgba(239,127,59,1)"]}
              borders={["rgba(239,127,59,0.85)", "rgba(239,127,59,1)", "rgba(239,127,59,1)"]}
            />
            <ProjectionBarChart
              title="Conversions: Current vs Projected"
              current={d.conversions}
              projected={hasConvUp ? projConv : null}
              unitLabel="conversions"
              midLabel="Mid"
              colors={["rgba(155,101,201,0.45)", "rgba(155,101,201,0.85)", "rgba(155,101,201,1)"]}
              borders={["rgba(155,101,201,0.85)", "rgba(155,101,201,1)", "rgba(155,101,201,1)"]}
            />
          </div>
        </div>

        {(hasSessUp || d.cmSessionSkipped) && (
          <div className={styles.card}>
            <BreakdownTable
              caption="Sessions: observed vs recovered"
              observed={d.sessions}
              features={d.sessionFeatures}
              projected={projSess}
              metaEvents={null}
              skippedNote={d.cmSessionSkipped}
            />
          </div>
        )}
        {hasConvUp && (
          <div className={styles.card}>
            <BreakdownTable
              caption="Conversions: observed vs new"
              observed={d.conversions}
              features={d.convFeatures}
              projected={projConv}
              metaEvents={d.metaEvents}
              skippedNote={false}
            />
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
