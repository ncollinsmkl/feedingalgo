/**
 * Hero — Strong Data. Superfood for Algorithms.
 * Maps to Figma block 42:38 (hero rect + headline + CTA + Algo image).
 */
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <img
            className={styles.logoImg}
            src="/assets/Image_Strong_Data_Logo.webp"
            alt="Strong Data."
          />
          <img
            className={styles.subtitleImg}
            src="/assets/Image_Superfood_For_Algorithms_Text.png"
            alt="Superfood for Algorithms"
          />
          <p className={styles.lede}>
            Feed your Algo a breakfast of first-party, offline, and
            server-side data to drive maximum media ROI!
          </p>
          <a className="btn-cta" href="#how-strong">
            Get Strong Data
          </a>
        </div>
        <div className={styles.imageWrap}>
          <img
            src="/assets/Image_Algo_Holding_Cereal_Box.webp"
            alt="Algo the bear holding a Strong Data cereal box"
          />
        </div>
      </div>
    </section>
  );
}
