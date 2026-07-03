/** 
 * KeyBenefits — 4-card row sitting under the hero.
 * Maps to Figma frame 96:162.
*/

import styles from "./KeyBenefits.module.css";

const BENEFITS = [
  { icon: "/assets/Image_Icon_Measurement.png", title: "Better Media Measurement" },
  { icon: "/assets/Image_Icon_Targeting.png", title: "Better Media Targeting" },
  { icon: "/assets/Image_Icon_Optimisation.png", title: "Better Media Optimisation" },
  { icon: "/assets/Image_Icon_ROI.png", title: "Maximum Media ROI" },
];

export default function KeyBenefits() {
  return (
    <section className={styles.section} aria-labelledby="benefits-label">
      <div className="container">
        <p id="benefits-label" className={styles.label}>
          Key Benefits:
        </p>
        <div className={styles.grid}>
          {BENEFITS.map((b) => (
            <div className={styles.card} key={b.title}>
              <img src={b.icon} alt="" aria-hidden="true" />
              <h3>{b.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
