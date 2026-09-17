import { useState } from "react";
import { Link } from "react-router-dom";
import type { DataStrengthFeatures } from "./engine";
import { hasOpportunity } from "../types";
import type { ChannelSelection } from "../types";
import { FEATURE_META, buildDynamicTimeline, type RoadmapFeatureMeta } from "./roadmap";
import GanttChart from "./GanttChart";
import { submitDataStrengthResults, type ContactDetails } from "./googleForm";
import type { UsageFormState } from "./engine";
import styles from "./DataStrengthCalculator.module.css";

interface Step4Props {
  features: DataStrengthFeatures;
  channels: ChannelSelection;
  usage: UsageFormState;
  onBack: () => void;
  onDownloadPdf: () => void;
  onStartOver: () => void;
  onOpenAiCalculator: () => void;
}

const FEATURE_ADOPTION_LOOKUP: Record<RoadmapFeatureMeta["key"], (f: DataStrengthFeatures) => boolean> = {
  consent_mode: (f) => hasOpportunity(f.consentMode),
  enhanced_conv: (f) => hasOpportunity(f.enhancedConversions),
  gtg: (f) => hasOpportunity(f.gtg),
  sgtm: (f) => hasOpportunity(f.sgtm),
  bigquery: (f) => hasOpportunity(f.bigquery),
  // meta_tik is a synthetic combined key handled separately below.
  meta_tik: () => false,
};

export default function Step4Roadmap({
  features,
  channels,
  usage,
  onBack,
  onDownloadPdf,
  onStartOver,
  onOpenAiCalculator,
}: Step4Props) {
  const [contact, setContact] = useState<ContactDetails>({ name: "", email: "", client: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const socialActive = channels.baseline || channels.social;
  const toImplement = FEATURE_META.filter((f) => {
    if (f.key === "meta_tik") {
      return socialActive && (hasOpportunity(features.metaCapi) || hasOpportunity(features.tiktokEapi));
    }
    return FEATURE_ADOPTION_LOOKUP[f.key](features);
  });

  const { features: timedFeatures, totalWeeks } =
    toImplement.length > 0 ? buildDynamicTimeline(toImplement) : { features: [], totalWeeks: 0 };

  const haveData = usage.sessions !== "" || usage.conversions !== "";
  const crossPromoText = (
    <>
      The ingredients above improve the <strong>quality and completeness</strong> of your
      measurement data. That same data powers Google's AI bidding and targeting, so the
      stronger your Algo's diet, the harder features like Performance Max, Broad Match and
      Value-Based Bidding work.
      {haveData && (
        <>
          {" "}
          Using the{" "}
          {usage.sessions && `${Number(usage.sessions).toLocaleString()} sessions`}
          {usage.sessions && usage.conversions && " and "}
          {usage.conversions && `${Number(usage.conversions).toLocaleString()} conversions`}{" "}
          you entered, the AI Value Calculator estimates the incremental conversions and
          revenue those features could drive.
        </>
      )}
    </>
  );

  const handleSend = () => {
    const validationError = submitDataStrengthResults(contact, usage, features);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div>
      <div id="step4Content">
        {/* Roadmap card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🗓️</div>
            <div>
              <div className={styles.cardTitle}>Recommended Implementation Roadmap</div>
              <div className={styles.cardSubtitle}>
                A suggested delivery plan for the ingredients not yet in your Algo's bowl
              </div>
            </div>
          </div>

          {timedFeatures.length > 0 && (
            <div className={styles.callout}>
              ⚠️ <strong>Please note:</strong> this roadmap reflects <em>typical</em>{" "}
              implementation timescales and is intended as a guide only. Actual timelines may
              vary depending on your client's technical environment, internal resource
              availability, consent platform configuration, and broader project objectives.
            </div>
          )}

          <GanttChart timedFeatures={timedFeatures} totalWeeks={totalWeeks} />
        </div>

        {/* Cross-promo: AI Value Calculator */}
        <div
          className={styles.card}
          style={{
            border: "1px solid var(--purple)",
            background: "linear-gradient(180deg,var(--purple-dim),transparent)",
          }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🤖</div>
            <div>
              <div className={styles.cardTitle}>Now see what that data could unlock</div>
              <div className={styles.cardSubtitle}>
                A stronger diet is exactly what Google's AI-powered features feed on
              </div>
            </div>
          </div>
          <p style={{ color: "var(--text)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            {crossPromoText}
          </p>
          <Link
            to="/calculators/ai-value"
            onClick={onOpenAiCalculator}
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              background: "var(--purple)",
            }}
          >
            Open the AI Value Calculator →
          </Link>
        </div>

        {/* CTA card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>✉️</div>
            <div>
              <div className={styles.cardTitle}>Speak to our experts about your Data Strength</div>
              <div className={styles.cardSubtitle}>
                Send your results to the team and we'll be in touch to discuss next steps
              </div>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "1.25rem 0.5rem" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>✅</div>
              <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.4rem" }}>
                Thank you, your results are on their way
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                The Merkle DAAT team has received your submission and will be in touch to
                discuss next steps.
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.ctaForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="cta_name">Your Name</label>
                  <input
                    type="text"
                    id="cta_name"
                    placeholder="e.g. Jane Smith"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cta_email">Your Email Address</label>
                  <input
                    type="email"
                    id="cta_email"
                    placeholder="e.g. jane@agency.com"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.full}`}>
                  <label htmlFor="cta_client">Client / Account Name</label>
                  <input
                    type="text"
                    id="cta_client"
                    placeholder="e.g. Acme Corporation"
                    value={contact.client}
                    onChange={(e) => setContact({ ...contact, client: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div style={{ color: "var(--red)", fontSize: "0.82rem", marginTop: "0.75rem" }}>
                  {error}
                </div>
              )}

              <div style={{ marginTop: "1.25rem" }}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  onClick={handleSend}
                >
                  Send Results →
                </button>
              </div>

              <div className={styles.formNote}>
                🔒 Your details and results are sent securely to the team. We'll only use them
                to follow up on your enquiry.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.btnActions}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onBack}>
          ← Back to Results
        </button>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className={`${styles.btn} ${styles.btnPdf}`} onClick={onDownloadPdf}>
            ⬇ Download PDF
          </button>
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onStartOver}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
