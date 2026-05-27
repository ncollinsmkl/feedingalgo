/**
 * Header — sticky top nav.
 * Maps to Figma node 24:160. Smooth-scrolls to in-page anchors.
 */
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const LINKS = [
  { href: "#meet-algo", label: "Meet Algo" },
  { href: "#making-strong-data", label: "Making Strong Data" },
  { href: "#how-strong", label: "How Strong Is Your Data?" },
];

export default function Header() {
  const [active, setActive] = useState<string>("");

  // Highlight the nav link for whichever section is currently in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (n): n is Element => !!n
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo}>
          Strong Data.
        </a>
        <nav className={styles.nav} aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? styles.active : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
