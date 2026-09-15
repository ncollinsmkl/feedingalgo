import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/hero.png";
import heroImg from "../../assets/data_strength_algo_hero.png";

interface DataFeatureDef {
  id: string;
  name: string;
  desc: string;
  loUplift: number;
  hiUplift: number;
  isSubFeature?: boolean;
}

const DATA_FEATURES: DataFeatureDef[] = [
  {
    id: "consent_mode",
    name: "Advanced Consent Mode",
    desc: "Enables modelled conversions and session recovery for users who decline cookies, using AI to fill the measurement gap.",
    loUplift: 0.05,
    hiUplift: 0.15
  },
  {
    id: "enhanced_conv",
    name: "Enhanced Conversions",
    desc: "Supplements existing conversion tags with hashed first-party data, improving accuracy for Paid Search campaigns.",
    loUplift: 0.05,
    hiUplift: 0.12
  },
  {
    id: "gtg",
    name: "Google Tag Gateway (GTG)",
    desc: "Routes Google tags through a first-party subdomain, reducing tag blocking and improving session data completeness.",
    loUplift: 0.03,
    hiUplift: 0.08
  },
  {
    id: "sgtm",
    name: "Server-Side Google Tag Manager (sGTM)",
    desc: "Processes tags through a first-party server, improving data governance, enrichment for analysis and activation, as well as potentially site speed.",
    loUplift: 0.04,
    hiUplift: 0.10
  },
  {
    id: "meta_capi",
    name: "Meta CAPI (Conversions API)",
    desc: "Sends conversions & events to Meta server-side via sGTM, recovering signal lost to browser/ITP restrictions.",
    loUplift: 0.06,
    hiUplift: 0.15,
    isSubFeature: true
  },
  {
    id: "tiktok_eapi",
    name: "TikTok EAPI (Events API)",
    desc: "Server-side event forwarding to TikTok via sGTM for more complete conversion measurement.",
    loUplift: 0.05,
    hiUplift: 0.12,
    isSubFeature: true
  },
  {
    id: "bigquery",
    name: "BigQuery Integration",
    desc: "Exports raw GA4 event data to BigQuery for advanced analysis, custom attribution, and audience activation.",
    loUplift: 0.03,
    hiUplift: 0.07
  }
];

const ADOPT_LABELS: Record<number, string> = {
  0: "Not implemented",
  25: "Limited testing",
  50: "Scaling adoption",
  75: "Advanced",
  100: "Fully implemented"
};

const ADOPT_COLORS: Record<number, string> = {
  0: "var(--red)",
  25: "#E08A3E",
  50: "var(--collect)",
  75: "#8FB84A",
  100: "var(--green)"
};

const ADOPT_BG: Record<number, string> = {
  0: "rgba(225,92,79,0.1)",
  25: "rgba(224,138,62,0.1)",
  50: "rgba(239,154,59,0.12)",
  75: "rgba(143,184,74,0.12)",
  100: "rgba(90,169,107,0.1)"
};

function fmt(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "—";
  const round = Math.round(n);
  if (round >= 1000000) return (round / 1000000).toFixed(1) + "M";
  if (round >= 1000) return (round / 1000).toFixed(1) + "K";
  return round.toLocaleString();
}

export default function DataStrengthCalculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Adoption & NA States
  const [featureState, setFeatureState] = useState<Record<string, { adoption: number; na: boolean }>>(() => {
    const initial: Record<string, { adoption: number; na: boolean }> = {};
    DATA_FEATURES.forEach(f => {
      initial[f.id] = { adoption: 0, na: false };
    });
    return initial;
  });

  // Inputs for Step 2
  const [useBaseline, setUseBaseline] = useState<boolean>(true);
  const [sessionsInput, setSessionsInput] = useState<string>("");
  const [conversionsInput, setConversionsInput] = useState<string>("");
  const [consentRateInput, setConsentRateInput] = useState<string>("75");
  const [aovInput, setAovInput] = useState<string>("50");

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSliderChange = (id: string, value: number) => {
    setFeatureState(prev => ({
      ...prev,
      [id]: { ...prev[id], adoption: value }
    }));
  };

  const handleNaToggle = (id: string, checked: boolean) => {
    setFeatureState(prev => ({
      ...prev,
      [id]: { ...prev[id], na: checked }
    }));
  };

  // Results Calculation for Step 3
  const results = useMemo(() => {
    const baseSessions = parseFloat(sessionsInput) || (useBaseline ? 500000 : 0);
    const baseConversions = parseFloat(conversionsInput) || (useBaseline ? 5000 : 0);
    const consentRate = parseFloat(consentRateInput) || 75;
    const aov = parseFloat(aovInput) || 50;

    // Session Recovery Calculation (Advanced Consent Mode)
    const consentState = featureState["consent_mode"] || { adoption: 0, na: false };
    const unconsentedFraction = (100 - consentRate) / 100;
    const unconsentedSessions = baseSessions * unconsentedFraction;
    const consentModeOpportunity = consentState.na ? 0 : (100 - consentState.adoption) / 100;
    const recoveredSessions = unconsentedSessions * consentModeOpportunity * 0.6;

    // Conversion Recovery Calculation
    let totalExtraConversions = 0;

    const breakdown: Array<{
      feature: DataFeatureDef;
      adoption: number;
      avgUpliftPct: number;
      extraConversions: number;
      extraRevenue: number;
    }> = [];

    DATA_FEATURES.forEach(f => {
      const st = featureState[f.id] || { adoption: 0, na: false };
      if (st.na || st.adoption >= 100) return;

      const unlockedRatio = (100 - st.adoption) / 100;
      const avgUplift = (f.loUplift + f.hiUplift) / 2;
      const extraConv = baseConversions * avgUplift * unlockedRatio;

      totalExtraConversions += extraConv;

      breakdown.push({
        feature: f,
        adoption: st.adoption,
        avgUpliftPct: avgUplift * 100,
        extraConversions: extraConv,
        extraRevenue: extraConv * aov
      });
    });

    const conversionUpliftPct = baseConversions > 0 ? (totalExtraConversions / baseConversions) * 100 : 0;
    const totalExtraRevenue = totalExtraConversions * aov;

    return {
      baseSessions,
      baseConversions,
      recoveredSessions,
      totalExtraConversions,
      conversionUpliftPct,
      totalExtraRevenue,
      aov,
      breakdown
    };
  }, [sessionsInput, conversionsInput, consentRateInput, aovInput, useBaseline, featureState]);

  return (
    <div className="calculator-page">
      <nav>
        <div className="nav-logo">
          <Link to="/calculators" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <img src={logoImg} alt="Algo" />
            <span>Algo.</span>
          </Link>
        </div>
        <div className="nav-right">
          <Link to="/calculators" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
            &larr; All calculators
          </Link>
        </div>
      </nav>

      <div className="hero-stack">
        <div className="hero-mascot-big">
          <img src={heroImg} alt="Algo the bear flexing" />
        </div>
        <div className="hero">
          <h1>Data Strength Calculator</h1>
          <p>
            This is the "Algo Audit", check what's in your Algo's bowl today, and see the estimated uplift in session visibility and conversion tracking from feeding it data-strengthening features.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="step-item">
            <div className={`step-circle ${currentStep === 1 ? "active" : currentStep > 1 ? "done" : ""}`}>
              {currentStep > 1 ? "✓" : "1"}
            </div>
            <div className={`step-label ${currentStep === 1 ? "active" : currentStep > 1 ? "done" : ""}`}>
              Ingredients
            </div>
          </div>

          <div className={`step-connector ${currentStep > 1 ? "done" : ""}`} />

          <div className="step-item">
            <div className={`step-circle ${currentStep === 2 ? "active" : currentStep > 2 ? "done" : ""}`}>
              {currentStep > 2 ? "✓" : "2"}
            </div>
            <div className={`step-label ${currentStep === 2 ? "active" : currentStep > 2 ? "done" : ""}`}>
              Current Bowl
            </div>
          </div>

          <div className={`step-connector ${currentStep > 2 ? "done" : ""}`} />

          <div className="step-item">
            <div className={`step-circle ${currentStep === 3 ? "active" : currentStep > 3 ? "done" : ""}`}>
              {currentStep > 3 ? "✓" : "3"}
            </div>
            <div className={`step-label ${currentStep === 3 ? "active" : currentStep > 3 ? "done" : ""}`}>
              Results
            </div>
          </div>

          <div className={`step-connector ${currentStep > 3 ? "done" : ""}`} />

          <div className="step-item">
            <div className={`step-circle ${currentStep === 4 ? "active" : ""}`}>4</div>
            <div className={`step-label ${currentStep === 4 ? "active" : ""}`}>What's Next</div>
          </div>
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">⚙️</div>
                <div>
                  <div className="card-title">What's in Your Algo's Bowl?</div>
                  <div className="card-subtitle">
                    To what extent, if any, are these features applied to your advertising or tracking?
                  </div>
                </div>
              </div>

              {DATA_FEATURES.map(f => {
                const st = featureState[f.id] || { adoption: 0, na: false };
                return (
                  <div className={`feature-row ${f.isSubFeature ? "sub-feature" : ""}`} key={f.id}>
                    <div>
                      <div className="feature-name-row">
                        <div className="feature-name">{f.name}</div>
                        <div className="na-toggle-inline">
                          <input
                            type="checkbox"
                            id={`${f.id}_na`}
                            checked={st.na}
                            onChange={e => handleNaToggle(f.id, e.target.checked)}
                          />
                          <label htmlFor={`${f.id}_na`}>Not applicable</label>
                        </div>
                      </div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>

                    <div className={`adopt-slider-wrap ${st.na ? "is-na" : ""}`}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="25"
                        value={st.adoption}
                        disabled={st.na}
                        className="adopt-slider"
                        style={{ accentColor: "var(--navy)" }}
                        onChange={e => handleSliderChange(f.id, parseInt(e.target.value))}
                      />
                      <div className="adopt-ticks">
                        <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                      </div>
                      <div
                        className="adopt-readout"
                        style={{
                          color: st.na ? "var(--muted)" : ADOPT_COLORS[st.adoption],
                          background: st.na ? "rgba(107,114,128,0.08)" : ADOPT_BG[st.adoption]
                        }}
                      >
                        {st.na ? (
                          "Not applicable"
                        ) : (
                          <>
                            <span className="ar-pct">{st.adoption}%</span> {ADOPT_LABELS[st.adoption]}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="btn-actions">
              <div />
              <button className="btn btn-primary" type="button" onClick={() => goToStep(2)}>
                Next: Current Bowl &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🎛️</div>
                <div>
                  <div className="card-title">How would you like to model usage?</div>
                  <div className="card-subtitle">Use our industry baseline, or enter your own figures</div>
                </div>
              </div>

              <div className="toggle-pills">
                <input
                  type="checkbox"
                  id="ch_baseline"
                  className="baseline-check"
                  checked={useBaseline}
                  onChange={e => setUseBaseline(e.target.checked)}
                />
                <label htmlFor="ch_baseline">📐 Use baseline assumptions</label>
              </div>
              <div className="mode-hint">
                💡 <strong>Baseline assumptions</strong> pre-fill every field with industry averages so you can see an indicative result instantly.
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div>
                  <div className="card-title">Current Monthly Performance</div>
                  <div className="card-subtitle">Enter your average monthly figures (use GA4 or Google Ads as appropriate)</div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="sessions">Avg Monthly Sessions</label>
                  <input
                    type="number"
                    id="sessions"
                    placeholder="e.g. 500,000"
                    value={sessionsInput}
                    onChange={e => setSessionsInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="conversions">Avg Monthly Conversions / Leads</label>
                  <input
                    type="number"
                    id="conversions"
                    placeholder="e.g. 5,000"
                    value={conversionsInput}
                    onChange={e => setConversionsInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="consent_rate">Consent Opt-In Rate (%)</label>
                  <div className="input-wrap">
                    <input
                      type="number"
                      id="consent_rate"
                      placeholder="e.g. 75"
                      min="0"
                      max="100"
                      value={consentRateInput}
                      onChange={e => setConsentRateInput(e.target.value)}
                      style={{ paddingRight: "2rem" }}
                    />
                    <span className="suffix">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="aov">Average Order / Lead Value (£)</label>
                  <div className="input-wrap">
                    <input
                      type="number"
                      id="aov"
                      placeholder="e.g. 50"
                      value={aovInput}
                      onChange={e => setAovInput(e.target.value)}
                      style={{ paddingLeft: "1.6rem" }}
                    />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(1)}>&larr; Back</button>
              <button className="btn btn-primary" type="button" onClick={() => goToStep(3)}>
                Calculate Uplift &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📈</div>
                <div>
                  <div className="card-title">Estimated Monthly Data Strength Uplift</div>
                  <div className="card-subtitle">
                    Here is your projected session recovery and conversion tracking uplift.
                  </div>
                </div>
              </div>

              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-lbl">Est. Recovered Sessions</div>
                  <div className="metric-val">+{fmt(results.recoveredSessions)}</div>
                  <div className="metric-sub">via Consent Mode &amp; GTG</div>
                </div>

                <div className="metric-card uplift">
                  <div className="metric-lbl">Est. Extra Tracked Conversions</div>
                  <div className="metric-val">+{fmt(results.totalExtraConversions)}</div>
                  <div className="metric-up">+{results.conversionUpliftPct.toFixed(1)}% Uplift</div>
                </div>

                <div className="metric-card uplift-conv">
                  <div className="metric-lbl">Est. Monthly Inc. Revenue</div>
                  <div className="metric-val">&pound;{fmt(results.totalExtraRevenue)}</div>
                  <div className="metric-sub">at &pound;{results.aov} per conversion</div>
                </div>
              </div>

              {results.breakdown.length === 0 ? (
                <div className="no-features-msg">
                  🎉 Excellent! All data strengthening features are fully enabled in your bowl!
                </div>
              ) : (
                <>
                  <div className="card-title" style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>
                    Opportunity Breakdown by Feature
                  </div>
                  {results.breakdown.map(b => (
                    <div className="feat-card" key={b.feature.id}>
                      <div className="fc-top">
                        <div className="fc-name">{b.feature.name}</div>
                        <div className="fc-uplift">
                          +{fmt(b.extraConversions)} extra tracked conversions/mo
                        </div>
                      </div>
                      <div className="fc-metric">
                        Est. +&pound;{fmt(b.extraRevenue)} / month
                      </div>
                      <div className="fc-why">{b.feature.desc}</div>
                      <div className="fc-foot">
                        Current adoption: {b.adoption}% &bull; Unlocked potential: +{b.avgUpliftPct.toFixed(1)}% max uplift
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(2)}>&larr; Revise Inputs</button>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-pdf" type="button" onClick={() => window.print()}>⬇ Download PDF</button>
                <button className="btn btn-primary" type="button" onClick={() => goToStep(4)}>What's Next &rarr;</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🚀</div>
                <div>
                  <div className="card-title">Implementation Roadmap &amp; Next Steps</div>
                  <div className="card-subtitle">Recommended priority sequence to strengthen your data layer</div>
                </div>
              </div>

              <div className="priority-note">
                <strong>Recommended Priority:</strong> Implement Consent Mode v2 and Enhanced Conversions first to establish baseline recovery, followed by Server-Side GTM and BigQuery for advanced signal enrichment.
              </div>

              <hr className="section-divider" />

              <div className="card-title" style={{ marginBottom: "0.75rem" }}>
                Request an Algo Data Audit
              </div>
              <div className="cta-form">
                <div className="form-group">
                  <label htmlFor="cta_name">Name</label>
                  <input type="text" id="cta_name" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="cta_email">Work Email</label>
                  <input type="email" id="cta_email" placeholder="name@company.com" />
                </div>
                <div className="form-group full">
                  <label htmlFor="cta_company">Company Name</label>
                  <input type="text" id="cta_company" placeholder="Company Ltd" />
                </div>
              </div>
              <div className="form-note">
                🔒 Your details will only be used by dentsu/Algo specialists to provide your custom data audit.
              </div>
            </div>

            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(3)}>&larr; Back to Results</button>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-pdf" type="button" onClick={() => window.print()}>⬇ Download PDF</button>
                <button className="btn btn-ghost" type="button" onClick={() => goToStep(1)}>Start Over</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer>&copy; dentsu 2026 &middot; Algo &middot; Data Strength Calculator</footer>
    </div>
  );
}