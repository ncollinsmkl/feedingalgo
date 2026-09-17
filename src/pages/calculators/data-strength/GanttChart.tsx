import type { TimedFeature } from "./roadmap";
import styles from "./DataStrengthCalculator.module.css";

interface GanttChartProps {
  timedFeatures: TimedFeature[];
  totalWeeks: number;
}

/**
 * Renders the week-by-week Gantt bars for the implementation roadmap.
 * Ported from the weekLabels / ganttRows building in renderStep4().
 */
export default function GanttChart({ timedFeatures, totalWeeks }: GanttChartProps) {
  if (timedFeatures.length === 0) {
    return (
      <div className={styles.noFeaturesMsg}>
        🎉 All selected ingredients are already in the bowl, your Algo's diet is in great
        shape!
      </div>
    );
  }

  const hasGtg = timedFeatures.some((f) => f.key === "gtg");
  const hasSgtm = timedFeatures.some((f) => f.key === "sgtm");
  const showParallelNote = hasGtg && hasSgtm;

  return (
    <>
      <div className={styles.ganttWrap}>
        <div className={styles.gantt} style={{ "--tw": totalWeeks } as React.CSSProperties}>
          <div className={styles.ganttHeaderRow}>
            <div />
            <div className={styles.ganttWeeksHeader}>
              {Array.from({ length: totalWeeks }, (_, i) => (
                <div key={i} className={styles.ganttWeekLbl}>
                  W{i + 1}
                </div>
              ))}
            </div>
          </div>

          {timedFeatures.map((feature) => (
            <div key={feature.key} className={styles.ganttFeatureRow}>
              <div className={styles.ganttRowLabel}>{feature.label}</div>
              <div className={styles.ganttTrack}>
                {feature.phases.map((p, i) => {
                  const left = ((p.start / totalWeeks) * 100).toFixed(3);
                  const width = (((p.end - p.start) / totalWeeks) * 100).toFixed(3);
                  return (
                    <div
                      key={i}
                      className={`${styles.gbar} ${styles[p.type]}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ganttLegend}>
        <div className={styles.ganttLegendItem}>
          <div className={`${styles.legendSwatch} ${styles.lsAudit}`} />
          Audit &amp; Discovery
        </div>
        <div className={styles.ganttLegendItem}>
          <div className={`${styles.legendSwatch} ${styles.lsImpl}`} />
          Implementation
        </div>
        <div className={styles.ganttLegendItem}>
          <div className={`${styles.legendSwatch} ${styles.lsQa}`} />
          QA &amp; Review
        </div>
      </div>

      {showParallelNote && (
        <div className={styles.priorityNote}>
          💡 <strong>GTG &amp; Server-Side GTM are shown running in parallel.</strong> Due to
          their technical similarity we recommend implementing these together to reduce
          duplication of effort and streamline the overall delivery timeline.
        </div>
      )}
    </>
  );
}
