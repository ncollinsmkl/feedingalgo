import AdoptSliderRow from "../AdoptSlider";
import type { FeatureAdoption } from "../types";
import { AI_GROUPS, AI_FEATURES } from "./featureLibrary";
import styles from "./AiValueCalculator.module.css";

interface Step1Props {
  featureAdoption: Record<string, FeatureAdoption>;
  onFeatureChange: (key: string, value: FeatureAdoption) => void;
  searchGroupVisible: boolean;
  videoGroupVisible: boolean;
  onSearchGroupToggle: (checked: boolean) => void;
  onVideoGroupToggle: (checked: boolean) => void;
  onNext: () => void;
}

export default function Step1AiFeatures({
  featureAdoption,
  onFeatureChange,
  searchGroupVisible,
  videoGroupVisible,
  onSearchGroupToggle,
  onVideoGroupToggle,
  onNext,
}: Step1Props) {
  let filterHint: React.ReactNode;
  if (searchGroupVisible && videoGroupVisible) {
    filterHint = "💡 Showing all features, untick a channel to hide its features from the list below.";
  } else if (!searchGroupVisible && !videoGroupVisible) {
    filterHint = (
      <>
        💡 Showing <strong>Foundations</strong> and <strong>Applied AI / Cloud</strong> only.
        Tick Search or Video to add their features.
      </>
    );
  } else {
    filterHint = (
      <>
        💡 Showing <strong>{searchGroupVisible ? "Search & Performance" : "Video"}</strong>{" "}
        features (plus Foundations and Applied AI / Cloud).
      </>
    );
  }

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>🎛️</div>
          <div>
            <div className={styles.cardTitle}>Which channels are you interested in?</div>
            <div className={styles.cardSubtitle}>
              Focus the ingredient list on the channels that matter to you. Foundations always
              apply
            </div>
          </div>
        </div>
        <div className={styles.togglePills}>
          <input
            type="checkbox"
            id="ff_search"
            className={styles.pillInput}
            checked={searchGroupVisible}
            onChange={(e) => onSearchGroupToggle(e.target.checked)}
          />
          <label
            htmlFor="ff_search"
            className={`${styles.pillLabel} ${searchGroupVisible ? styles.pillChecked : ""}`}
          >
            🔍 Search &amp; Performance
          </label>
          <input
            type="checkbox"
            id="ff_video"
            className={styles.pillInput}
            checked={videoGroupVisible}
            onChange={(e) => onVideoGroupToggle(e.target.checked)}
          />
          <label
            htmlFor="ff_video"
            className={`${styles.pillLabel} ${videoGroupVisible ? styles.pillChecked : ""}`}
          >
            🎬 Video
          </label>
        </div>
        <div className={styles.modeHint}>{filterHint}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>🤖</div>
          <div>
            <div className={styles.cardTitle}>AI Feature Adoption</div>
            <div className={styles.cardSubtitle}>
              Tell us which of Google's AI-powered features are already in your Algo's bowl.
              We'll estimate the opportunity from the ones you're <strong>not</strong> yet
              feeding it.
            </div>
          </div>
        </div>

        {AI_GROUPS.map((g) => {
          const groupFeatures = AI_FEATURES.filter((f) => f.group === g.id);
          const hidden = (g.id === "search" && !searchGroupVisible) || (g.id === "video" && !videoGroupVisible);
          if (hidden) return null;
          return (
            <div key={g.id}>
              <div className={styles.aiGroupHead}>
                <span className={styles.ghIcon}>{g.icon}</span>
                <div>
                  <div className={styles.ghTitle}>{g.title}</div>
                  <div className={styles.ghSub}>{g.sub}</div>
                </div>
              </div>
              {groupFeatures.map((f) => (
                <AdoptSliderRow
                  key={f.key}
                  id={f.key}
                  name={f.name}
                  description={f.desc}
                  value={featureAdoption[f.key]}
                  onChange={(v) => onFeatureChange(f.key, v)}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className={styles.btnActions}>
        <div />
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNext}>
          Next: Current Bowl →
        </button>
      </div>
    </div>
  );
}
