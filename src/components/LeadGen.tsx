/**
 * LeadGen — "Want to discuss how to upgrade your Cereal?" form.
 * Maps to Figma frame 24:117.
 *
 * Submits silently to a Google Form via `submitToGoogleForm()` — see
 * `src/lib/googleForm.ts` for the form/field configuration. The form's
 * styling is preserved exactly; only the submit path changes.
 *
 * UX states:
 *   • idle       — initial form
 *   • submitting — button shows "Sending…" and is disabled
 *   • success    — form is replaced by a thank-you message
 *   • error      — friendly fallback with a mailto: link offered
 */
import { useState } from "react";
import { submitToGoogleForm } from "../lib/googleForm";
import { buildLeadMailto } from "../lib/mailto";
import styles from "./LeadGen.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadGen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
      await submitToGoogleForm({ name, email, company });
      setStatus("success");
    } catch {
      // Network-level failure (offline, DNS, etc.) — fall back gracefully.
      setStatus("error");
    }
  }

  return (
    <section id="lead-gen" className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          {status === "success" ? (
            <div className={styles.successState}>
              <h2>Thanks — Algo's heard you 🐻</h2>
              <p className={styles.lede}>
                Your details are on their way to the team. We'll be in touch
                shortly to discuss how to upgrade your Cereal.
              </p>
            </div>
          ) : (
            <>
              <h2>Want to discuss how to upgrade your Cereal?</h2>
              <p className={styles.lede}>
                Enter your details below to send your Data Strength results to the team,
                and we'll be in touch to discuss how we can improve your Data Strength
              </p>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  <span>NAME</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Algo Smith"
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <label>
                  <span>EMAIL</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="algo@strongdata.co"
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <label>
                  <span>COMPANY</span>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Analytics"
                    required
                    disabled={status === "submitting"}
                  />
                </label>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={!canSubmit && status !== "submitting"}
                >
                  {status === "submitting" ? "Sending…" : "Email Algo"}
                </button>
                {status === "error" && (
                  <p className={styles.errorState}>
                    Sorry, something went wrong sending that. You can try
                    again, or{" "}
                    <a href={buildLeadMailto({ name, email, company }, "lab")}>
                      email the team directly
                    </a>
                    .
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
