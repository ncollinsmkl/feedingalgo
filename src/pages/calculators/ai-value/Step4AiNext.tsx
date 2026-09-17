import { useState } from "react";
import { Link } from "react-router-dom";
import type { AiResults } from "./engine";
import { moneyShort } from "./resultsHelpers";
import { submitAiValueResults, type ContactDetails } from "./googleForm";
import type { FeatureAdoption } from "../types";
import type { UsageFormState } from "./engineTypes";
import styles from "./AiValueCalculator.module.css";

interface Step4Props {
  results: AiResults | null;
  featureAdoption: Record<string, FeatureAdoption>;
  usage: UsageFormState;
  onBack: () => void;
  onDownloadPdf: () => void;
  onStartOver: () => void;
  onOpenDataStrengthCalculator: () => void;
}

export default function Step4AiNext({
  results,
  featureAdoption,
  usage,
  onBack,
  onDownloadPdf,
  onStartOver,
  onOpenDataStrengthCalculator,
}: Step4Props) {
  const [contact, setContact] = useState<ContactDetails>({ name: "", email: "", client: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const d = results || { opportunities: [] as AiResults["opportunities"], conversions: 0 };
  const foundationGaps = d.opportunities.filter((o) => o.foundation);
  const numeric = d.opportunities.filter((o) => o.type !== "qual");
  const topThree = numeric
    .map((o) => ({ ...o, mid: ((o.revLo || 0) + (o.revHi || 0)) / 2 }))
    .sort((a, b) => b.mid - a.mid)
    .slice(0, 3);

  const haveData = d.conversions > 0;
  const foundationMsg = foundationGaps.length ? (
    <>
      You flagged{" "}
      <strong>
        {foundationGaps.length} foundational gap{foundationGaps.length > 1 ? "s" : ""}
      </strong>{" "}
      ({foundationGaps.map((f) => f.name).join(", ")}). These are exactly what the Data
      Strength Calculator checks your Algo's diet for, and they make every AI feature above
      work harder.
    </>
  ) : (
    <>
      Google's AI performs best on a strong, complete diet. The Data Strength Calculator shows
      how ingredients like Consent Mode, Enhanced Conversions and server-side tagging
      strengthen the very signals these AI features bid on.
    </>
  );

  const handleSend = () => {
    if (!results) return;
    const validationError = submitAiValueResults(
      contact,
      {
        sessions: usage.sessions,
        conversions: usage.conversions,
        paidSearchPct: usage.paidSearchPct,
        dvPct: usage.dvPct,
        paidSocialPct: usage.paidSocialPct,
        searchSpend: usage.searchSpend,
        dvSpend: usage.dvSpend,
        aov: usage.aov,
      },
      results,
      featureAdoption
    );
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
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🎯</div>
            <div>
              <div className={styles.cardTitle}>Your Top AI Opportunities</div>
              <div className={styles.cardSubtitle}>
                The unfed ingredients with the largest modelled monthly value, in priority
                order
              </div>
            </div>
          </div>
          {topThree.length > 0 ? (
            topThree.map((o) => (
              <div key={o.key} className={styles.featCard}>
                <div className={styles.fcTop}>
                  <div className={styles.fcName}>{o.name}</div>
                  <div className={styles.fcUplift}>
                    {moneyShort(o.revLo || 0)}–{moneyShort(o.revHi || 0)} / mo
                  </div>
                </div>
                <div className={styles.fcFoot}>{o.source}</div>
              </div>
            ))
          ) : (
            <div className={styles.noFeaturesMsg}>
              🎉 Your Algo's already feasting on every AI feature we model, your media stack
              is in great shape!
            </div>
          )}
        </div>

        <div
          className={styles.card}
          style={{
            border: "1px solid var(--orange)",
            background: "linear-gradient(180deg,var(--orange-dim),transparent)",
          }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🥣</div>
            <div>
              <div className={styles.cardTitle}>Strengthen the data underneath it all</div>
              <div className={styles.cardSubtitle}>AI value is only as strong as the diet feeding it</div>
            </div>
          </div>
          <p style={{ color: "var(--text)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            {foundationMsg}
            {haveData && (
              <>
                {" "}
                Using the {Math.round(d.conversions).toLocaleString()} conversions you entered,
                the Data Strength Calculator estimates how much measurable signal your Algo is
                missing out on.
              </>
            )}
          </p>
          <Link
            to="/calculators/data-strength"
            onClick={onOpenDataStrengthCalculator}
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
          >
            Open the Data Strength Calculator →
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>✉️</div>
            <div>
              <div className={styles.cardTitle}>Speak to our experts about your AI opportunities</div>
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
                <div style={{ color: "var(--red)", fontSize: "0.82rem", marginTop: "0.75rem" }}>{error}</div>
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
