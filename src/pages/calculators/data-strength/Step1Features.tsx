import AdoptSliderRow from "../AdoptSlider";
import type { FeatureAdoption } from "../types";
import type { DataStrengthFeatures } from "./engine";
import styles from "./DataStrengthCalculator.module.css";
import subFeatureStyles from "../AdoptSlider.module.css";

interface Step1Props {
  features: DataStrengthFeatures;
  onChange: (key: keyof DataStrengthFeatures, value: FeatureAdoption) => void;
  onNext: () => void;
}

export default function Step1Features({ features, onChange, onNext }: Step1Props) {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>⚙️</div>
          <div>
            <div className={styles.cardTitle}>What's in Your Algo's Bowl?</div>
            <div className={styles.cardSubtitle}>
              To what extent, if any, are these features applied to your advertising or
              tracking?
            </div>
          </div>
        </div>

        <AdoptSliderRow
          id="consent_mode"
          name="Advanced Consent Mode"
          description="Enables modelled conversions and session recovery for users who decline cookies, using Google's AI to fill the measurement gap."
          value={features.consentMode}
          onChange={(v) => onChange("consentMode", v)}
        />

        <AdoptSliderRow
          id="enhanced_conv"
          name="Enhanced Conversions"
          description="Supplements existing conversion tags with hashed first-party data, improving accuracy for Paid Search campaigns."
          value={features.enhancedConversions}
          onChange={(v) => onChange("enhancedConversions", v)}
        />

        <AdoptSliderRow
          id="gtg"
          name="Google Tag Gateway (GTG)"
          description="Routes Google tags through a first-party subdomain, reducing tag blocking and improving session data completeness."
          value={features.gtg}
          onChange={(v) => onChange("gtg", v)}
        />

        <AdoptSliderRow
          id="sgtm"
          name="Server-Side Google Tag Manager (sGTM)"
          description="Processes tags through a first-party server, improving data governance, enrichment for analysis and activation, as well as potentially site speed."
          value={features.sgtm}
          onChange={(v) => onChange("sgtm", v)}
        />

        {/* Meta CAPI / TikTok EAPI - delivered via sGTM, only modelled for Paid Social */}
        <div className={styles.subFeature}>
          <div className={styles.subFeatureTitle}>
            ↳ Delivered via Server-Side GTM · modelled when Paid Social is selected
          </div>
          <div className={subFeatureStyles.sfItem}>
            <AdoptSliderRow
              id="meta_capi"
              name="Meta CAPI (Conversions API)"
              description="Sends conversions & events to Meta server-side via sGTM, recovering signal lost to browser/ITP restrictions."
              value={features.metaCapi}
              onChange={(v) => onChange("metaCapi", v)}
              compact
            />
          </div>
          <div className={subFeatureStyles.sfItem}>
            <AdoptSliderRow
              id="tiktok_eapi"
              name="TikTok EAPI (Events API)"
              description="Server-side event forwarding to TikTok via sGTM for more complete conversion measurement."
              value={features.tiktokEapi}
              onChange={(v) => onChange("tiktokEapi", v)}
              compact
            />
          </div>
        </div>

        <AdoptSliderRow
          id="bigquery"
          name="BigQuery Integration"
          description="Exports raw GA4 event data to BigQuery for advanced analysis, custom attribution, and audience activation."
          value={features.bigquery}
          onChange={(v) => onChange("bigquery", v)}
        />
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
