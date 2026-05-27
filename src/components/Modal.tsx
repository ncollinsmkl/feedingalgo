/**
 * Modal — accessible dialog with focus trap, ESC + click-outside close.
 * Reused by CModal (Tell me more) and AuditResultModal.
 */
import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Visible title (also used as aria-label). */
  title: string;
  /** Optional CSS variable to tint the modal accent (e.g. --c-red). */
  accentVar?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  accentVar,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Focus the dialog so screen readers announce it and ESC works.
    dialogRef.current?.focus();
    // Lock background scroll while open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={styles.dialog}
        style={
          accentVar
            ? ({ borderTopColor: `var(${accentVar})` } as React.CSSProperties)
            : undefined
        }
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
