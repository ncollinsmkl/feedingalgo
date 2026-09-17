import type { ChannelSelection } from "../types";
import type { UsageFormState } from "./engineTypes";
import { BASELINE_DEFAULTS } from "./engineTypes";
import styles from "./AiValueCalculator.module.css";

interface Step2Props {
  channels: ChannelSelection;
  onChannelsChange: (next: ChannelSelection) => void;
  usage: UsageFormState;
  onUsageChange: (next: UsageFormState) => void;
  onBack: () => void;
  onCalculate: () => void;
}

function setField(
  usage: UsageFormState,
  onUsageChange: (next: UsageFormState) => void,
  field: keyof UsageFormState
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    onUsageChange({ ...usage, [field]: e.target.value });
  };
}

export default function Step2AiUsage({
  channels,
  onChannelsChange,
  usage,
  onUsageChange,
  onBack,
  onCalculate,
}: Step2Props) {
  const handleBaselineToggle = (checked: boolean) => {
    if (checked) {
      onChannelsChange({ baseline: true, search: false, video: false, social: false });
      onUsageChange({ ...BASELINE_DEFAULTS });
    } else {
      onChannelsChange({ ...channels, baseline: false });
    }
  };

  const handleChannelToggle = (key: "search" | "video" | "social", checked: boolean) => {
    const next: ChannelSelection = { ...channels, [key]: checked };
    if (next.search || next.video || next.social) {
      next.baseline = false;
    }
    onChannelsChange(next);
  };

  const { baseline, search, video, social } = channels;

  let hint: React.ReactNode;
  if (baseline) {
    hint = (
      <>
        💡 <strong>Baseline assumptions</strong> pre-fill every field with industry averages so
        you can see an indicative result instantly. Switch to channel selection to enter your
        own figures.
      </>
    );
  } else if (!search && !video && !social) {
    hint = (
      <>
        💡 Select <strong>baseline assumptions</strong> for an instant indicative result, or
        tick the marketing channels you run to tailor the inputs.
      </>
    );
  } else {
    const names = [search && "Search", video && "Video", social && "Social"]
      .filter(Boolean)
      .join(" + ");
    hint = (
      <>
        💡 Modelling for <strong>{names}</strong>. Enter your figures below, only the relevant
        fields are shown.
      </>
    );
  }

  const showSearchFields = baseline || search;
  const showVideoFields = baseline || video;
  const showSocialFields = baseline || social;
  const showSearchSpend = baseline || search;
  const showVideoSpend = baseline || video;
  const showSocialSpend = !baseline && social;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>🎛️</div>
          <div>
            <div className={styles.cardTitle}>How would you like to model usage?</div>
            <div className={styles.cardSubtitle}>
              Use our industry baseline, or select the marketing channels you're active in to
              tailor the inputs
            </div>
          </div>
        </div>

        <div className={styles.togglePills}>
          <input
            type="checkbox"
            id="ch_baseline"
            className={styles.pillInput}
            checked={baseline}
            onChange={(e) => handleBaselineToggle(e.target.checked)}
          />
          <label
            htmlFor="ch_baseline"
            className={`${styles.pillLabel} ${baseline ? styles.pillCheckedBaseline : ""}`}
          >
            📐 Use baseline assumptions
          </label>
          <span className={styles.modeOr}>or select channels</span>
          <input
            type="checkbox"
            id="ch_search"
            className={styles.pillInput}
            checked={search}
            onChange={(e) => handleChannelToggle("search", e.target.checked)}
          />
          <label
            htmlFor="ch_search"
            className={`${styles.pillLabel} ${search ? styles.pillChecked : ""}`}
          >
            🔍 Search
          </label>
          <input
            type="checkbox"
            id="ch_video"
            className={styles.pillInput}
            checked={video}
            onChange={(e) => handleChannelToggle("video", e.target.checked)}
          />
          <label
            htmlFor="ch_video"
            className={`${styles.pillLabel} ${video ? styles.pillChecked : ""}`}
          >
            🎬 Video
          </label>
          <input
            type="checkbox"
            id="ch_social"
            className={styles.pillInput}
            checked={social}
            onChange={(e) => handleChannelToggle("social", e.target.checked)}
          />
          <label
            htmlFor="ch_social"
            className={`${styles.pillLabel} ${social ? styles.pillChecked : ""}`}
          >
            📱 Social
          </label>
        </div>
        <div className={styles.modeHint}>{hint}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>📊</div>
          <div>
            <div className={styles.cardTitle}>Current Monthly Performance</div>
            <div className={styles.cardSubtitle}>
              Enter your average monthly figures, use Google Analytics or Google Ads as
              appropriate
            </div>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="sessions">
              Avg Monthly Sessions{" "}
              <span className={styles.lblHint}>(GA4 → Reports → Traffic)</span>
            </label>
            <input
              type="number"
              id="sessions"
              placeholder="e.g. 500,000"
              min={0}
              value={usage.sessions}
              onChange={setField(usage, onUsageChange, "sessions")}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="conversions">
              Avg Monthly Conversions / Leads{" "}
              <span className={styles.lblHint}>(GA4 → Conversions)</span>
            </label>
            <input
              type="number"
              id="conversions"
              placeholder="e.g. 5,000"
              min={0}
              value={usage.conversions}
              onChange={setField(usage, onUsageChange, "conversions")}
            />
          </div>

          {showSearchFields && (
            <div className={styles.formGroup}>
              <label htmlFor="paid_search_pct">
                Traffic from Paid Search <span className={styles.lblHint}>(%)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="paid_search_pct"
                  placeholder="e.g. 45"
                  min={0}
                  max={100}
                  style={{ paddingRight: "2rem" }}
                  value={usage.paidSearchPct}
                  onChange={setField(usage, onUsageChange, "paidSearchPct")}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          )}

          {showVideoFields && (
            <div className={styles.formGroup}>
              <label htmlFor="dv_pct">
                Traffic from Display &amp; Video <span className={styles.lblHint}>(%)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="dv_pct"
                  placeholder="e.g. 15"
                  min={0}
                  max={100}
                  style={{ paddingRight: "2rem" }}
                  value={usage.dvPct}
                  onChange={setField(usage, onUsageChange, "dvPct")}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          )}

          {showSocialFields && (
            <div className={styles.formGroup}>
              <label htmlFor="paid_social_pct">
                Traffic from Paid Social <span className={styles.lblHint}>(%)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="paid_social_pct"
                  placeholder="e.g. 20"
                  min={0}
                  max={100}
                  style={{ paddingRight: "2rem" }}
                  value={usage.paidSocialPct}
                  onChange={setField(usage, onUsageChange, "paidSocialPct")}
                />
                <span className={styles.suffix}>%</span>
              </div>
            </div>
          )}

          {showSearchSpend && (
            <div className={styles.formGroup}>
              <label htmlFor="search_spend">
                Monthly Google Ads Spend{" "}
                <span className={styles.lblHint}>(optional, for ROAS)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="search_spend"
                  placeholder="e.g. 1,000,000"
                  min={0}
                  style={{ paddingLeft: "1.6rem" }}
                  value={usage.searchSpend}
                  onChange={setField(usage, onUsageChange, "searchSpend")}
                />
                <span className={`${styles.suffix} ${styles.suffixLeft}`}>£</span>
              </div>
            </div>
          )}

          {showVideoSpend && (
            <div className={styles.formGroup}>
              <label htmlFor="dv_spend">
                Display &amp; Video Ad Spend{" "}
                <span className={styles.lblHint}>(optional, for ROAS)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="dv_spend"
                  placeholder="e.g. 25,000"
                  min={0}
                  style={{ paddingLeft: "1.6rem" }}
                  value={usage.dvSpend}
                  onChange={setField(usage, onUsageChange, "dvSpend")}
                />
                <span className={`${styles.suffix} ${styles.suffixLeft}`}>£</span>
              </div>
            </div>
          )}

          {showSocialSpend && (
            <div className={styles.formGroup}>
              <label htmlFor="social_spend">
                Social Ad Spend <span className={styles.lblHint}>(optional, for ROAS)</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  id="social_spend"
                  placeholder="e.g. 20,000"
                  min={0}
                  style={{ paddingLeft: "1.6rem" }}
                  value={usage.socialSpend}
                  onChange={setField(usage, onUsageChange, "socialSpend")}
                />
                <span className={`${styles.suffix} ${styles.suffixLeft}`}>£</span>
              </div>
            </div>
          )}

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label htmlFor="aov">
              Average Conversion Value{" "}
              <span className={styles.lblHint}>
                (used to translate extra conversions into revenue)
              </span>
            </label>
            <div className={styles.inputWrap}>
              <input
                type="number"
                id="aov"
                placeholder="e.g. 100"
                min={0}
                style={{ paddingLeft: "1.6rem" }}
                value={usage.aov}
                onChange={setField(usage, onUsageChange, "aov")}
              />
              <span className={`${styles.suffix} ${styles.suffixLeft}`}>£</span>
            </div>
            <div className={styles.hintBox}>
              💡 This is the average revenue (or lead value) per conversion. We pre-fill £50 as
              an industry default. Please edit to match your business, or it will carry over
              from the Data Strength Calculator (your Algo's diet check) if you've used it.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnActions}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onBack}>
          ← Back
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onCalculate}>
          Calculate AI Value →
        </button>
      </div>
    </div>
  );
}
