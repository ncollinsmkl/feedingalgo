import type { AdoptPct, FeatureAdoption } from "./types";
import { ADOPT_LABELS } from "./types";
import styles from "./AdoptSlider.module.css";

const ADOPT_COLORS: Record<AdoptPct, string> = {
  0: "var(--red)",
  25: "#E08A3E",
  50: "var(--collect)",
  75: "#8FB84A",
  100: "var(--green)",
};
const ADOPT_BG: Record<AdoptPct, string> = {
  0: "rgba(225,92,79,0.1)",
  25: "rgba(224,138,62,0.1)",
  50: "rgba(239,154,59,0.12)",
  75: "rgba(143,184,74,0.12)",
  100: "rgba(90,169,107,0.1)",
};

interface FeatureRowProps {
  id: string;
  name: string;
  description: string;
  value: FeatureAdoption;
  onChange: (next: FeatureAdoption) => void;
  /** Use the smaller sub-feature name style (for features nested under a parent, e.g. Meta CAPI). */
  compact?: boolean;
}

/**
 * A single feature row: name + "Not applicable" toggle on one line, a
 * description, and the 0/25/50/75/100% adoption slider with a live
 * readout beneath it. Mirrors the original .feature-row + .adopt-slider-wrap
 * markup and behaviour (toggleNotApplicable / updateAdoptReadout).
 */
export default function AdoptSliderRow({
  id,
  name,
  description,
  value,
  onChange,
  compact = false,
}: FeatureRowProps) {
  const { pct, notApplicable } = value;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value) as AdoptPct;
    onChange({ pct: next, notApplicable });
  };

  const handleNaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ pct, notApplicable: e.target.checked });
  };

  return (
    <div className={compact ? undefined : styles.featureRow}>
      <div>
        <div className={styles.featureNameRow}>
          <div className={compact ? undefined : styles.featureName}>{name}</div>
          <div className={styles.naToggleInline}>
            <input
              type="checkbox"
              id={`${id}_na`}
              checked={notApplicable}
              onChange={handleNaChange}
            />
            <label htmlFor={`${id}_na`}>Not applicable</label>
          </div>
        </div>
        <div className={styles.featureDesc}>{description}</div>
      </div>
      <div className={`${styles.sliderWrap} ${notApplicable ? styles.isNa : ""}`}>
        <input
          type="range"
          id={`${id}_slider`}
          min={0}
          max={100}
          step={25}
          value={pct}
          disabled={notApplicable}
          className={styles.slider}
          onChange={handleSliderChange}
        />
        <div className={styles.ticks}>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div
          className={styles.readout}
          style={
            notApplicable
              ? { color: "var(--muted)", background: "rgba(107,114,128,0.08)" }
              : { color: ADOPT_COLORS[pct], background: ADOPT_BG[pct] }
          }
        >
          {notApplicable ? (
            "Not applicable"
          ) : (
            <>
              <span className={styles.readoutPct}>{pct}%</span> {ADOPT_LABELS[pct]}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
