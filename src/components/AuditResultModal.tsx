/**
 * AuditResultModal — shown after the user completes the Algo Audit.
 *
 * Displays the score band, the matching Algo image, and a short form
 * that silently POSTs to the Google Form configured in
 * `src/lib/googleForm.ts`. The per-C scores travel as separate form
 * fields so they show up as individual columns in the response sheet.
 *
 * UX states mirror LeadGen.tsx: idle → submitting → success | error.
 * On network failure we surface a friendly fallback `mailto:` link so
 * the user is never stranded.
 */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { buildLeadMailto } from "../lib/mailto";
import { submitToGoogleForm } from "../lib/googleForm";
import { AUDIT_ROWS, scoreBand } from "../data/auditQuestions";
import type { CKey } from "../data/fiveCs";
import styles from "./AuditResultModal.module.css";

/** Map answers state shape (kept compatible with AlgoAudit). */
type Answers = Partial<Record<CKey, number>>;
type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  open: boolean;
  onClose: () => void;
  score: number;
  band: ReturnType<typeof scoreBand>;
  /** Per-C answers — sent as separate fields to the Google Form. */
  answers: Answers;
}

/**
 * Build a human-readable breakdown string. Only used in the fallback
 * mailto: link, since the Google Form receives the scores as discrete
 * fields, not a single text blob.
 */
function buildBreakdown(answers: Answers): string {
  const lines = AUDIT_ROWS.map((row) => {
    const s = answers[row.key];
    if (s === undefined) return `- ${row.title}: (no answer)`;
    return `- ${row.title}: ${s}/4`;
  });
  return ["Breakdown by C:", ...lines].join("\n");
}

export default function AuditResultModal({
  open,
  onClose,
  score,
  band,
  answers,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Reset state when the modal opens for a new attempt — otherwise the
  // "thanks" message would persist across closing and reopening.
  useEffect(() => {
    if (open) setStatus("idle");
  }, [open]);

  const canSubmit =
    status === "idle" &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    company.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    try {
      await submitToGoogleForm({
        name,
        email,
        company,
        // Pass the five score fields directly so each lands in its own
        // column in the response sheet.
        scores: answers,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Used only by the fallback link if the network POST fails.
  const fallbackMailto = buildLeadMailto(
    {
      name,
      email,
      company,
      context: [
        `Algo Audit score: ${score}/20 — ${band.headline}`,
        "",
        buildBreakdown(answers),
      ].join("\n"),
    },
    "audit"
  );

  return (
    <Modal open={open} onClose={onClose} title={band.headline}>
      <div className={styles.layout}>
        <img
          className={styles.algo}
          src={band.image}
          alt={`Algo — ${band.band}`}
        />
        <div className={styles.copy}>
          <p className={styles.score}>
            Your score: <strong>{score}/20</strong>
          </p>
          <h3>{band.headline}</h3>
          <p className={styles.message}>{band.message}</p>

          {status === "success" ? (
            <div className={styles.successState}>
              <h4>Sent — Algo's chewing it over 🐻</h4>
              <p>
                Your results are on their way to the team. We'll be in
                touch with a detailed breakdown shortly.
              </p>
            </div>
          ) : (
            <>
              <h4 className={styles.formHeading}>
                Speak to our team to discuss how to improve your Data Strength
              </h4>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <label>
                  <span>Company</span>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <button
                  type="submit"
                  className="btn-cta"
                  disabled={!canSubmit && status !== "submitting"}
                >
                  {status === "submitting" ? "Sending…" : "Send My Results"}
                </button>
                {status === "error" && (
                  <p className={styles.errorState}>
                    Couldn't send right now — please try again, or{" "}
                    <a href={fallbackMailto}>email the team directly</a>.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
