import { useRef, useState } from "react";
import type { ChannelSelection, FeatureAdoption } from "../types";
import { makeDefaultAdoption, defaultChannelSelection } from "../types";
import { AI_FEATURES } from "./featureLibrary";
import { calculateAiValue, type AiResults } from "./engine";
import { saveSharedInputs, loadSharedInputs } from "../sharedInputs";
import type { UsageFormState } from "./engineTypes";
import { BASELINE_DEFAULTS, emptyUsage } from "./engineTypes";
import Step1AiFeatures from "./Step1AiFeatures";
import Step2AiUsage from "./Step2AiUsage";
import Step3AiResults from "./Step3AiResults";
import Step4AiNext from "./Step4AiNext";
import styles from "./AiValueCalculator.module.css";
import algoFavicon from "../assets/algo-favicon.png";
import algoThinking from "../assets/algo-thinking.png";

const STEP_LABELS = ["AI Ingredients", "Current Bowl", "Results", "What's Next"];

function defaultFeatureAdoption(): Record<string, FeatureAdoption> {
  const map: Record<string, FeatureAdoption> = {};
  AI_FEATURES.forEach((f) => {
    map[f.key] = makeDefaultAdoption();
  });
  return map;
}

function parseNum(v: string): number {
  return v !== "" ? parseFloat(v) || 0 : 0;
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
    // Original: `if (!shared.aov) el.value = 100;` -> only overridden to 100 when aov wasn't shared.
    aov: shared.aov !== undefined ? shared.aov : "100",
  };
}

export default function AiValueCalculator() {
  const [step, setStep] = useState(1);
  const [featureAdoption, setFeatureAdoption] = useState<Record<string, FeatureAdoption>>(defaultFeatureAdoption());
  const [searchGroupVisible, setSearchGroupVisible] = useState(true);
  const [videoGroupVisible, setVideoGroupVisible] = useState(true);
  const [channels, setChannels] = useState<ChannelSelection>(defaultChannelSelection());
  const [usage, setUsage] = useState<UsageFormState>(initialUsage);
  const [results, setResults] = useState<AiResults | null>(null);
  const resultsContentRef = useRef<HTMLDivElement>(null);

  const goToStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFeatureChange = (key: string, value: FeatureAdoption) => {
    setFeatureAdoption((prev) => ({ ...prev, [key]: value }));
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
    const computed = calculateAiValue(
      featureAdoption,
      {
        sessions: parseNum(usage.sessions),
        conversions: parseNum(usage.conversions),
        aov: parseNum(usage.aov),
        baseline: channels.baseline,
        channels: { search: channels.search, video: channels.video, social: channels.social },
        searchPct: parseNum(usage.paidSearchPct),
        dvPct: parseNum(usage.dvPct),
        socialPct: parseNum(usage.paidSocialPct),
        searchSpend: usage.searchSpend !== "" ? parseNum(usage.searchSpend) : null,
        dvSpend: usage.dvSpend !== "" ? parseNum(usage.dvSpend) : null,
        socialSpend: usage.socialSpend !== "" ? parseNum(usage.socialSpend) : null,
      },
      searchGroupVisible,
      videoGroupVisible
    );
    setResults(computed);
    goToStep(3);
    persistSharedInputs(usage);
  };

  const handleResetAll = () => {
    setFeatureAdoption(defaultFeatureAdoption());
    setSearchGroupVisible(true);
    setVideoGroupVisible(true);
    setChannels(defaultChannelSelection());
    setUsage(emptyUsage());
    setResults(null);
    goToStep(1);
  };

  const handleDownloadPdf = () => {
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
          <img src={algoThinking} alt="Algo the bear thinking" />
        </div>
        <div className={styles.hero}>
          <h1>AI Value Calculator</h1>
          <p>
            Once your Algo's diet is strong, see what it can really do. Estimate the
            incremental conversions and revenue that Google's AI-powered media, search &amp;
            video features could drive, based on which you've already fed it.
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
          <Step1AiFeatures
            featureAdoption={featureAdoption}
            onFeatureChange={handleFeatureChange}
            searchGroupVisible={searchGroupVisible}
            videoGroupVisible={videoGroupVisible}
            onSearchGroupToggle={setSearchGroupVisible}
            onVideoGroupToggle={setVideoGroupVisible}
            onNext={() => goToStep(2)}
          />
        </div>

        <div className={`${styles.step} ${step === 2 ? styles.active : ""}`}>
          <Step2AiUsage
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
            <Step3AiResults
              results={results}
              featureAdoption={featureAdoption}
              onBack={() => goToStep(2)}
              onDownloadPdf={handleDownloadPdf}
              onNext={() => goToStep(4)}
            />
          )}
        </div>

        <div className={`${styles.step} ${step === 4 ? styles.active : ""}`}>
          <Step4AiNext
            results={results}
            featureAdoption={featureAdoption}
            usage={usage}
            onBack={() => goToStep(3)}
            onDownloadPdf={handleDownloadPdf}
            onStartOver={handleResetAll}
            onOpenDataStrengthCalculator={() => persistSharedInputs(usage)}
          />
        </div>
      </div>

      <footer className={styles.footer}>© dentsu 2026 · Algo · AI Value Calculator</footer>
    </div>
  );
}
