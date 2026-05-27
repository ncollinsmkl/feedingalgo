/**
 * AlgoAudit — interactive 5-C questionnaire.
 *
 * Supports three layouts (variant prop) so the user can pick one
 * after seeing the /mocks/audit comparison page:
 *   - "matrix"    : table with rows = Cs, columns = 4 score options
 *   - "stepper"   : one-C-per-screen with Next button
 *   - "accordion" : vertical accordion with sticky running total
 *
 * Once a final variant is chosen, the others can be deleted to slim
 * the bundle, but they live together while we iterate.
 */
import { useEffect, useMemo, useState } from "react";
import { AUDIT_COLUMNS, AUDIT_ROWS, scoreBand } from "../data/auditQuestions";
import AuditResultModal from "./AuditResultModal";
import styles from "./AlgoAudit.module.css";

type Variant = "matrix" | "stepper" | "accordion";

/**
 * useMediaQuery — tiny hook for responsive variant switching.
 * Re-evaluates on resize so rotating a phone / shrinking the window
 * works as expected.
 */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

interface Props {
  variant?: Variant;
  /** When true, render without the outer section wrapper (for the mocks page). */
  embedded?: boolean;
}

type Answers = Partial<Record<(typeof AUDIT_ROWS)[number]["key"], number>>;

export default function AlgoAudit({ variant = "matrix", embedded = false }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [resultOpen, setResultOpen] = useState(false);

  // On mobile, the matrix layout doesn't fit nicely, so we transparently
  // swap to the Stepper (Option B). The `/mocks/audit` page passes
  // explicit variants and isn't affected (those previews are embedded
  // and stay as-authored).
  const isMobile = useMediaQuery("(max-width: 700px)");
  const effectiveVariant: Variant =
    !embedded && variant === "matrix" && isMobile ? "stepper" : variant;

  const total = useMemo(
    () => Object.values(answers).reduce((a, b) => a + (b || 0), 0),
    [answers]
  );
  const complete = Object.keys(answers).length === AUDIT_ROWS.length;
  const band = scoreBand(total);

  const body = (() => {
    if (effectiveVariant === "stepper")
      return (
        <StepperVariant
          answers={answers}
          setAnswers={setAnswers}
          onFinish={() => setResultOpen(true)}
        />
      );
    if (effectiveVariant === "accordion")
      return (
        <AccordionVariant
          answers={answers}
          setAnswers={setAnswers}
        />
      );
    return <MatrixVariant answers={answers} setAnswers={setAnswers} />;
  })();

  // Shared footer (used by matrix + accordion). Stepper has its own
  // back/next nav so we skip it there.
  const footer = effectiveVariant !== "stepper" && (
    <div className={styles.footerRow}>
      <p className={styles.progress}>
        {Object.keys(answers).length} of {AUDIT_ROWS.length} answered
      </p>
      <button
        type="button"
        className="btn-cta"
        disabled={!complete}
        onClick={() => setResultOpen(true)}
      >
        Check Your Score
      </button>
    </div>
  );

  // The audit panel — light tinted box that wraps the instruction banner,
  // the questionnaire body and the footer in one container.
  const panel = (
    <div className={styles.auditPanel}>
      <div className={styles.auditPanelHead}>
        Select one option from each of the 5Cs below to see your score
      </div>
      <div className={styles.auditPanelBody}>
        {body}
        {footer}
      </div>
    </div>
  );

  const resultModal = (
    <AuditResultModal
      open={resultOpen}
      onClose={() => setResultOpen(false)}
      score={total}
      band={band}
      answers={answers}
    />
  );

  if (embedded)
    return (
      <div className={styles.embedded}>
        {panel}
        {resultModal}
      </div>
    );

  return (
    <section id="how-strong" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          How Strong Is Your Data?
          <span className={styles.sub}>
            Take our “Algo Audit” and see how happy your data makes him
          </span>
        </h2>
        {panel}
      </div>
      {resultModal}
    </section>
  );
}

/* ---------- VARIANT A: matrix table ---------- */

function MatrixVariant({
  answers,
  setAnswers,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  return (
    <div className={styles.matrixWrap}>
      <table className={styles.matrix}>
        {/* colgroup pins column widths so every cell is the same size,
            regardless of how much text is inside it. */}
        <colgroup>
          <col className={styles.colLabel} />
          <col className={styles.colData} />
          <col className={styles.colData} />
          <col className={styles.colData} />
          <col className={styles.colData} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={styles.matrixCorner}></th>
            {AUDIT_COLUMNS.map((c) => (
              <th scope="col" key={c.score} className={styles.matrixColHead}>
                <img
                  src={c.image}
                  alt={c.label}
                  className={styles.matrixColImg}
                />
              </th>
            ))}
          </tr>
          {/* Gradient progression row — sits below the row of Algo
              images as one continuous bar spanning all four image
              columns. "Hungry" is centred under the sad bear (col 1)
              and "Feasting" under the very happy bear (col 4), both
              sitting on top of the gradient. */}
          <tr className={styles.gradientRow} aria-hidden="true">
            <th></th>
            <th colSpan={4} className={styles.gradientCell}>
              <div className={styles.gradientBar}>
                <span className={styles.gradientLabel}>Hungry</span>
                <span className={styles.gradientLabel} />
                <span className={styles.gradientLabel} />
                <span className={styles.gradientLabel}>Feasting</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {AUDIT_ROWS.map((row, rowIdx) => (
            <tr key={row.key}>
              <th scope="row" className={styles.matrixRowLabel}>
                <span
                  className={styles.swatch}
                  style={{ background: rowAccent(rowIdx) }}
                  aria-hidden="true"
                />
                {row.title}
              </th>
              {AUDIT_COLUMNS.map((col, i) => {
                const selected = answers[row.key] === col.score;
                return (
                  <td key={col.score}>
                    <button
                      type="button"
                      className={`${styles.cell} ${selected ? styles.cellSelected : ""}`}
                      style={
                        selected
                          ? ({ background: rowAccent(rowIdx) } as React.CSSProperties)
                          : undefined
                      }
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [row.key]: col.score }))
                      }
                      aria-pressed={selected}
                      aria-label={`${row.title}: ${col.label}`}
                    >
                      {row.options[i]}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- VARIANT B: stepper ---------- */

function StepperVariant({
  answers,
  setAnswers,
  onFinish,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);
  const row = AUDIT_ROWS[step];
  const last = step === AUDIT_ROWS.length - 1;
  const picked = answers[row.key];

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperBar}>
        {AUDIT_ROWS.map((r, i) => (
          <span
            key={r.key}
            className={`${styles.stepDot} ${i <= step ? styles.stepDotActive : ""}`}
            aria-label={`Step ${i + 1} ${r.title}`}
          />
        ))}
      </div>
      <h3 className={styles.stepperTitle}>
        <span
          className={styles.swatch}
          style={{ background: rowAccent(step) }}
          aria-hidden="true"
        />
        {row.title}
      </h3>
      <div className={styles.stepperOptions}>
        {row.options.map((opt, i) => {
          const score = AUDIT_COLUMNS[i].score;
          const selected = picked === score;
          return (
            <button
              type="button"
              key={opt}
              className={`${styles.optCard} ${selected ? styles.optCardSelected : ""}`}
              style={
                selected
                  ? ({ borderColor: rowAccent(step) } as React.CSSProperties)
                  : undefined
              }
              onClick={() => setAnswers((a) => ({ ...a, [row.key]: score }))}
              aria-pressed={selected}
            >
              <span className={styles.optHeader}>{AUDIT_COLUMNS[i].label}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.stepperNav}>
        <button
          type="button"
          className={styles.btnGhost}
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </button>
        <p className={styles.progress}>
          {step + 1} of {AUDIT_ROWS.length}
        </p>
        <button
          type="button"
          className="btn-cta"
          disabled={picked === undefined}
          onClick={() => (last ? onFinish() : setStep((s) => s + 1))}
        >
          {last ? "Check Your Score" : "Next"}
        </button>
      </div>
    </div>
  );
}

/* ---------- VARIANT C: accordion ---------- */

function AccordionVariant({
  answers,
  setAnswers,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  const [open, setOpen] = useState<string | null>(AUDIT_ROWS[0].key);
  return (
    <div className={styles.accordion}>
      {AUDIT_ROWS.map((row, idx) => {
        const isOpen = open === row.key;
        const picked = answers[row.key];
        return (
          <div
            key={row.key}
            className={`${styles.accItem} ${picked ? styles.accAnswered : ""}`}
            style={{ ["--accent" as string]: rowAccent(idx) }}
          >
            <button
              type="button"
              className={styles.accHeader}
              onClick={() => setOpen(isOpen ? null : row.key)}
              aria-expanded={isOpen}
            >
              <span
                className={styles.swatch}
                style={{ background: rowAccent(idx) }}
                aria-hidden="true"
              />
              <span className={styles.accTitle}>{row.title}</span>
              {picked !== undefined && (
                <span className={styles.accTick} aria-label={`Score ${picked}`}>
                  ✓ {AUDIT_COLUMNS[picked - 1].label}
                </span>
              )}
              <span className={styles.accChevron} aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className={styles.accBody}>
                {row.options.map((opt, i) => {
                  const score = AUDIT_COLUMNS[i].score;
                  const selected = picked === score;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.accOpt} ${selected ? styles.accOptSelected : ""}`}
                      onClick={() => {
                        setAnswers((a) => ({ ...a, [row.key]: score }));
                        // Auto-advance to next unanswered C for snappier UX.
                        const next = AUDIT_ROWS.find(
                          (r) => answers[r.key] === undefined && r.key !== row.key
                        );
                        setOpen(next ? next.key : null);
                      }}
                      aria-pressed={selected}
                    >
                      <strong>{AUDIT_COLUMNS[i].label}</strong>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const ACCENTS = ["--c-red", "--c-orange", "--c-blue", "--c-green", "--c-purple"];
function rowAccent(idx: number) {
  return `var(${ACCENTS[idx % ACCENTS.length]})`;
}
