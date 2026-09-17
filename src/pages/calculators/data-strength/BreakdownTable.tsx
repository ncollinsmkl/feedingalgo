import { fmt } from "./resultsHelpers";
import type { FeatureContribution, MetaEventUplift, Triple } from "./engine";
import styles from "./DataStrengthCalculator.module.css";

interface BreakdownTableProps {
  caption: string;
  observed: number;
  features: FeatureContribution[];
  projected: Triple;
  metaEvents: MetaEventUplift | null;
  skippedNote: boolean;
}

/**
 * "Observed vs projected" breakdown table, ported from buildBreakdown()
 * in the original renderResults().
 */
export default function BreakdownTable({
  caption,
  observed,
  features,
  projected,
  metaEvents,
  skippedNote,
}: BreakdownTableProps) {
  return (
    <table className={styles.breakdown}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th>Component</th>
          <th className="num">Projection (avg)</th>
          <th className="num">Low – High</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="feat obs">Observed (current)</td>
          <td className="num obs">{fmt(observed)}</td>
          <td className="num rng">—</td>
        </tr>
        {features.map((f, i) => (
          <tr key={i}>
            <td className="feat">{f.label}</td>
            <td className="num new-val">+{fmt(f.avg)}</td>
            <td className="num rng">
              {fmt(f.lo)} – {fmt(f.hi)}
            </td>
          </tr>
        ))}
        {metaEvents && (
          <tr>
            <td className="feat">
              Meta event-match rate <span className="rng">(events, not conversions)</span>
            </td>
            <td className="num new-val">+{metaEvents.avg}%</td>
            <td className="num rng">
              {metaEvents.lo}% – {metaEvents.hi}%
            </td>
          </tr>
        )}
        {skippedNote && (
          <tr>
            <td colSpan={3} className="rng">
              ⚠️ Add a consent opt-in rate (Step 2) to model Advanced Consent Mode session
              recovery.
            </td>
          </tr>
        )}
        <tr className="total">
          <td>Projected total</td>
          <td className="num">{fmt(projected.avg)}</td>
          <td className="num">
            {fmt(projected.lo)} – {fmt(projected.hi)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
