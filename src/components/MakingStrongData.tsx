/**
 * MakingStrongData — the 5 Cs grid.
 * Maps to Figma frames 47:142, 47:143, 47:144 etc.
 * Each card has a Tell-me-more button that opens a Modal with solutions.
 */
import { useState } from "react";
import { FIVE_CS, type CKey } from "../data/fiveCs";
import Modal from "./Modal";
import styles from "./MakingStrongData.module.css";

export default function MakingStrongData() {
  const [openKey, setOpenKey] = useState<CKey | null>(null);
  const openC = FIVE_CS.find((c) => c.key === openKey) ?? null;

  return (
    <section id="making-strong-data" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          Making Strong Data
          <span className={styles.sub}>
            The 5Cs that make Strong Data an algorithm Superfood
          </span>
        </h2>
        <div className={styles.grid}>
          {FIVE_CS.map((c) => (
            <article
              key={c.key}
              className={styles.card}
              style={{ ["--accent" as string]: `var(${c.accentVar})` }}
            >
              <img className={styles.cereal} src={c.cereal} alt="" aria-hidden="true" />
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <button
                type="button"
                className="btn-pill"
                onClick={() => setOpenKey(c.key)}
              >
                Tell me more
              </button>
            </article>
          ))}
        </div>
      </div>

      <Modal
        open={!!openC}
        onClose={() => setOpenKey(null)}
        title={openC?.title ?? ""}
        accentVar={openC?.accentVar}
      >
        {openC && (
          <>
            <h3 className={styles.modalTitle}>{openC.title}</h3>
            <p className={styles.modalBody}>{openC.modalBody}</p>
            <h4 className={styles.solutionsHeading}>Solutions</h4>
            <ul className={styles.solutionsList}>
              {openC.solutions.map((s) => (
                <li key={s.name}>
                  <strong className={styles.solutionName}>{s.name}</strong>
                  <span className={styles.solutionDesc}>{s.description}</span>
                  {s.subItems && s.subItems.length > 0 && (
                    <ul className={styles.subSolutionsList}>
                      {s.subItems.map((sub) => (
                        <li key={sub.name}>
                          <strong className={styles.solutionName}>
                            {sub.name}
                          </strong>
                          <span className={styles.solutionDesc}>
                            {sub.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {/* CTA: closes the modal and smooth-scrolls the user to the
                Lead Gen form so they can drop their details and get a
                follow-up from the team about this C. */}
            <a
              className={`btn-cta ${styles.modalCta}`}
              href="#lead-gen"
              onClick={() => setOpenKey(null)}
            >
              Talk to us about {openC.title}
            </a>
          </>
        )}
      </Modal>
    </section>
  );
}
