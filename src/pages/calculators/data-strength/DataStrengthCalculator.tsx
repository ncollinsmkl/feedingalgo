import { useRef, useState } from "react";
import type { FeatureAdoption, ChannelSelection } from "../types";
import { makeDefaultAdoption, defaultChannelSelection } from "../types";
import { calculateDataStrength, type DataStrengthFeatures, type DataStrengthResults, type UsageFormState, BASELINE_DEFAULTS } from "./engine";
import { saveSharedInputs, loadSharedInputs } from "../sharedInputs";
import Step1Features from "./Step1Features";
import Step2Usage from "./Step2Usage";
import Step3Results from "./Step3Results";
import Step4Roadmap from "./Step4Roadmap";
import type { FeatureTag } from "./resultsHelpers";
import styles from "./DataStrengthCalculator.module.css";
import algoFavicon from "../assets/algo-favicon.png";
import algoFlexing from "../assets/algo-flexing.png";

const STEP_LABELS = ["Ingredients", "Current Bowl", "Results", "What's Next"];

function emptyUsage(): UsageFormState {
  return {
    sessions: "",
    conversions: "",
    paidSearchPct: "",
    dvPct: "",
    paidSocialPct: "",
    searchSpend: "",
    dvSpend: "",
    socialSpend: "",
    safariPct: "40",
    aov: "",
    consentRate: "",
  };
}

function defaultFeatures(): DataStrengthFeatures {
  return {
    consentMode: makeDefaultAdoption(),
    enhancedConversions: makeDefaultAdoption(),
    gtg: makeDefaultAdoption(),
    sgtm: makeDefaultAdoption(),
    metaCapi: makeDefaultAdoption(),
    tiktokEapi: makeDefaultAdoption(),
    bigquery: makeDefaultAdoption(),
  };
}

function parseNum(v: string): number | null {
  return v !== "" ? parseFloat(v) : null;
}

function initialUsage(): UsageFormState {
  const base = { ...BASELINE_DEFAULTS };
  const shared = loadSharedInputs();
  if (!shared) return base;
  return {
    ...base,
    ...(shared.sessions !== undefined && { sessions: shared.sessions }),
    ...(shared.conversions !== undefined && { conversions: shared.conversions }),
    ...(shared.paid_search_pct !== undefined && { paidSearchPct: shared.paid_search_pct }),
    ...(shared.dv_pct !== undefined && { dvPct: shared.dv_pct }),
    ...(shared.paid_social_pct !== undefined && { paidSocialPct: shared.paid_social_pct }),
    ...(shared.search_spend !== undefined && { searchSpend: shared.search_spend }),
    ...(shared.dv_spend !== undefined && { dvSpend: shared.dv_spend }),
    ...(shared.social_spend !== undefined && { socialSpend: shared.social_spend }),
    ...(shared.aov !== undefined && { aov: shared.aov }),
  };
}

export default function DataStrengthCalculator() {
  const [step, setStep] = useState(1);
  const [features, setFeatures] = useState<DataStrengthFeatures>(defaultFeatures());
  const [channels, setChannels] = useState<ChannelSelection>(defaultChannelSelection());
  const [usage, setUsage] = useState<UsageFormState>(initialUsage);
  const [results, setResults] = useState<DataStrengthResults | null>(null);
  const resultsContentRef = useRef<HTMLDivElement>(null);


  const goToStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFeatureChange = (key: keyof DataStrengthFeatures, value: FeatureAdoption) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  const persistSharedInputs = (u: UsageFormState) => {
    saveSharedInputs({
      sessions: u.sessions,
      conversions: u.conversions,
      paid_search_pct: u.paidSearchPct,
      dv_pct: u.dvPct,
      paid_social_pct: u.paidSocialPct,
      search_spend: u.searchSpend,
      dv_spend: u.dvSpend,
      social_spend: u.socialSpend,
      aov: u.aov,
    });
  };

  const handleCalculate = () => {
    const computed = calculateDataStrength(features, {
      channels,
      sessions: parseNum(usage.sessions),
      conversions: parseNum(usage.conversions),
      paidSearchPct: parseNum(usage.paidSearchPct),
      dvPct: parseNum(usage.dvPct),
      paidSocialPct: parseNum(usage.paidSocialPct),
      searchSpend: parseNum(usage.searchSpend),
      dvSpend: parseNum(usage.dvSpend),
      socialSpend: parseNum(usage.socialSpend),
      safariPct: parseNum(usage.safariPct),
      aov: parseNum(usage.aov),
      consentRatePct: parseNum(usage.consentRate),
    });
    setResults(computed);
    goToStep(3);
    persistSharedInputs(usage);
  };

  const handleResetAll = () => {
    setFeatures(defaultFeatures());
    setChannels(defaultChannelSelection());
    setUsage(emptyUsage());
    setResults(null);
    goToStep(1);
  };

  const handleDownloadPdf = () => {
    // Snapshot every Chart.js canvas as a static <img> so it prints reliably.
    const container = resultsContentRef.current;
    if (!container) {
      window.print();
      return;
    }
    const canvases = Array.from(container.querySelectorAll("canvas"));
    const swaps: { canvas: HTMLCanvasElement; img: HTMLImageElement }[] = [];

    canvases.forEach((canvas) => {
      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png", 1.0);
      img.style.cssText = "width:100%;display:block;";
      canvas.parentNode?.insertBefore(img, canvas);
      canvas.style.display = "none";
      swaps.push({ canvas, img });
    });

    const restore = () => {
      swaps.forEach(({ canvas, img }) => {
        canvas.style.display = "";
        img.remove();
      });
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  };

  const featureTags: FeatureTag[] = [
    { name: "Advanced Consent Mode", val: features.consentMode.notApplicable ? null : features.consentMode.pct },
    {
      name: "Enhanced Conversions",
      val: features.enhancedConversions.notApplicable ? null : features.enhancedConversions.pct,
    },
    { name: "Google Tag Gateway", val: features.gtg.notApplicable ? null : features.gtg.pct },
    { name: "Server-Side GTM", val: features.sgtm.notApplicable ? null : features.sgtm.pct },
    { name: "Meta CAPI", val: features.metaCapi.notApplicable ? null : features.metaCapi.pct },
    { name: "TikTok EAPI", val: features.tiktokEapi.notApplicable ? null : features.tiktokEapi.pct },
    { name: "BigQuery", val: features.bigquery.notApplicable ? null : features.bigquery.pct },
  ];

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="https://feedingalgo.com" className={styles.navLogo}>
          <img src={algoFavicon} alt="Algo" />
          <span>Algo.</span>
        </a>
        <div className={styles.navRight}>
          <a href="/calculators">← All calculators</a>
        </div>
      </nav>

      <div className={styles.heroStack}>
        <div className={styles.heroMascotBig}>
          <img src={algoFlexing} alt="Algo the bear flexing" />
        </div>
        <div className={styles.hero}>
          <h1>Data Strength Calculator</h1>
          <p>
            This is the "Algo Audit", check what's in your Algo's bowl today, and see the
            estimated uplift in session visibility and conversion tracking from feeding it
            Google's data-strengthening features.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.progressBar}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isActive = n === step;
            return (
              <div key={label} style={{ display: "contents" }}>
                <div className={styles.stepItem}>
                  <div
                    className={`${styles.stepCircle} ${isActive ? styles.active : ""} ${isDone ? styles.done : ""}`}
                  >
                    {isDone ? "✓" : n}
                  </div>
                  <div
                    className={`${styles.stepLabel} ${isActive ? styles.active : ""} ${isDone ? styles.done : ""}`}
                  >
                    {label}
                  </div>
                </div>
                {n < STEP_LABELS.length && (
                  <div className={`${styles.stepConnector} ${n < step ? styles.done : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className={`${styles.step} ${step === 1 ? styles.active : ""}`}>
          <Step1Features features={features} onChange={handleFeatureChange} onNext={() => goToStep(2)} />
        </div>

        <div className={`${styles.step} ${step === 2 ? styles.active : ""}`}>
          <Step2Usage
            channels={channels}
            onChannelsChange={setChannels}
            usage={usage}
            onUsageChange={setUsage}
            onBack={() => goToStep(1)}
            onCalculate={handleCalculate}
          />
        </div>

        <div className={`${styles.step} ${step === 3 ? styles.active : ""}`} ref={resultsContentRef}>
          {results && (
            <Step3Results
              results={results}
              featureTags={featureTags}
              onBack={() => goToStep(2)}
              onDownloadPdf={handleDownloadPdf}
              onNext={() => goToStep(4)}
            />
          )}
        </div>

        <div className={`${styles.step} ${step === 4 ? styles.active : ""}`}>
          <Step4Roadmap
            features={features}
            channels={channels}
            usage={usage}
            onBack={() => goToStep(3)}
            onDownloadPdf={handleDownloadPdf}
            onStartOver={handleResetAll}
            onOpenAiCalculator={() => persistSharedInputs(usage)}
          />
        </div>
      </div>

      <footer className={styles.footer}>© Strong Data 2026 · Algo · Data Strength Calculator</footer>
    </div>
  );
}
