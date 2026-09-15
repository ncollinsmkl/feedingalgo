import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/hero.png";
import heroImg from "../../assets/ai_value_algo_hero.png";

interface FeatureDef {
  id: string;
  name: string;
  desc: string;
  group: string;
  groupIcon: string;
  channel?: "search" | "video";
  priority: number;
  startWeek: number;
  implWeeks: number;
  qaWeeks: number;
  loUplift: number;
  hiUplift: number;
}

const AI_FEATURES: FeatureDef[] = [
  // Durable AI Foundations (Priority 1)
  {
    id: "measurement_foundation",
    name: "Measurement Foundation (Google tag + GA4)",
    desc: "Robust sitewide tagging via the Google tag and GA4, the most essential component of the AI measurement stack.",
    group: "Durable AI Foundations",
    groupIcon: "🧱",
    priority: 1,
    startWeek: 1,
    implWeeks: 3,
    qaWeeks: 1,
    loUplift: 0.05,
    hiUplift: 0.10
  },
  {
    id: "enhanced_conv",
    name: "Enhanced Conversions",
    desc: "Unlock higher quality and more accurate conversion data, providing significant long-term benefit for all AI-powered bidding.",
    group: "Durable AI Foundations",
    groupIcon: "🧱",
    priority: 1,
    startWeek: 2,
    implWeeks: 3,
    qaWeeks: 1,
    loUplift: 0.05,
    hiUplift: 0.12
  },
  {
    id: "consent_mode",
    name: "Consent Mode",
    desc: "Collects & communicates consent signals while preserving comprehensive measurement via modelling.",
    group: "Durable AI Foundations",
    groupIcon: "🧱",
    priority: 1,
    startWeek: 1,
    implWeeks: 2,
    qaWeeks: 1,
    loUplift: 0.03,
    hiUplift: 0.08
  },
  // Search & Performance (Priority 2)
  {
    id: "pmax",
    name: "Performance Max (PMax)",
    desc: "Maximise conversions across all Google channels using real-time AI bidding & creative optimization.",
    group: "AI-Powered Search & Performance",
    groupIcon: "🔍",
    channel: "search",
    priority: 2,
    startWeek: 3,
    implWeeks: 4,
    qaWeeks: 2,
    loUplift: 0.10,
    hiUplift: 0.18
  },
  {
    id: "broad_match",
    name: "Broad Match + Smart Bidding",
    desc: "Expand keyword reach and capture new intent by pairing broad match keywords with AI Smart Bidding.",
    group: "AI-Powered Search & Performance",
    groupIcon: "🔍",
    channel: "search",
    priority: 2,
    startWeek: 4,
    implWeeks: 3,
    qaWeeks: 1,
    loUplift: 0.08,
    hiUplift: 0.15
  },
  {
    id: "vbb",
    name: "Value-Based Bidding (VBB)",
    desc: "Steer AI bidding towards high-value conversions, profit margins, or Customer Lifetime Value.",
    group: "AI-Powered Search & Performance",
    groupIcon: "🔍",
    channel: "search",
    priority: 2,
    startWeek: 5,
    implWeeks: 4,
    qaWeeks: 2,
    loUplift: 0.10,
    hiUplift: 0.20
  },
  {
    id: "demand_gen",
    name: "Demand Gen",
    desc: "AI-driven visual ad formats across YouTube, Discover, and Gmail to capture mid-funnel demand.",
    group: "AI-Powered Search & Performance",
    groupIcon: "🔍",
    channel: "search",
    priority: 2,
    startWeek: 4,
    implWeeks: 3,
    qaWeeks: 1,
    loUplift: 0.06,
    hiUplift: 0.14
  },
  // Video (Priority 3)
  {
    id: "video_action",
    name: "Video Action / Video Reach Campaigns",
    desc: "Drive action or efficient reach on YouTube using Google AI for creative variations and audience targeting.",
    group: "AI-Powered Video",
    groupIcon: "🎬",
    channel: "video",
    priority: 3,
    startWeek: 6,
    implWeeks: 4,
    qaWeeks: 2,
    loUplift: 0.08,
    hiUplift: 0.15
  },
  {
    id: "youtube_select",
    name: "YouTube Select & AI Contextual Targeting",
    desc: "Access top-performing YouTube inventory with AI contextual and sentiment alignment.",
    group: "AI-Powered Video",
    groupIcon: "🎬",
    channel: "video",
    priority: 3,
    startWeek: 7,
    implWeeks: 3,
    qaWeeks: 1,
    loUplift: 0.05,
    hiUplift: 0.10
  },
  // Customer & Predictive AI (Priority 4)
  {
    id: "first_party_data",
    name: "First-Party Data / Customer Match",
    desc: "Fuel AI algorithms with high-intent customer match lists and CRM signals.",
    group: "Advanced Customer & Predictive AI",
    groupIcon: "🔮",
    priority: 4,
    startWeek: 8,
    implWeeks: 4,
    qaWeeks: 2,
    loUplift: 0.07,
    hiUplift: 0.15
  },
  {
    id: "propensity_modelling",
    name: "Propensity Modelling & Predictive Audiences",
    desc: "Target users most likely to convert or purchase again using predictive machine learning models.",
    group: "Advanced Customer & Predictive AI",
    groupIcon: "🔮",
    priority: 4,
    startWeek: 9,
    implWeeks: 5,
    qaWeeks: 2,
    loUplift: 0.08,
    hiUplift: 0.16
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

const SHARED_STORAGE_KEY = "peregrineSharedInputs";

export default function AIValueCalculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Adoption & NA States
  const [featureState, setFeatureState] = useState<Record<string, { adoption: number; na: boolean }>>(() => {
    const initial: Record<string, { adoption: number; na: boolean }> = {};
    AI_FEATURES.forEach(f => {
      initial[f.id] = { adoption: 0, na: false };
    });
    return initial;
  });

  // Channel filters for Step 1
  const [filterSearch, setFilterSearch] = useState<boolean>(true);
  const [filterVideo, setFilterVideo] = useState<boolean>(true);

  // Performance inputs for Step 2
  const [useBaseline, setUseBaseline] = useState<boolean>(true);
  const [chSearch, setChSearch] = useState<boolean>(false);
  const [chVideo, setChVideo] = useState<boolean>(false);
  const [chSocial, setChSocial] = useState<boolean>(false);

  const [sessionsInput, setSessionsInput] = useState<string>("");
  const [conversionsInput, setConversionsInput] = useState<string>("");
  const [paidSearchPctInput, setPaidSearchPctInput] = useState<string>("");
  const [dvPctInput, setDvPctInput] = useState<string>("");
  const [paidSocialPctInput, setPaidSocialPctInput] = useState<string>("");
  const [searchSpendInput, setSearchSpendInput] = useState<string>("");
  const [dvSpendInput, setDvSpendInput] = useState<string>("");
  const [socialSpendInput, setSocialSpendInput] = useState<string>("");
  const [aovInput, setAovInput] = useState<string>("100");

  // CTA Form State
  const [ctaName, setCtaName] = useState<string>("");
  const [ctaEmail, setCtaEmail] = useState<string>("");
  const [ctaCompany, setCtaCompany] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Load shared inputs on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHARED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.sessions) setSessionsInput(parsed.sessions);
        if (parsed.conversions) setConversionsInput(parsed.conversions);
        if (parsed.paid_search_pct) setPaidSearchPctInput(parsed.paid_search_pct);
        if (parsed.dv_pct) setDvPctInput(parsed.dv_pct);
        if (parsed.paid_social_pct) setPaidSocialPctInput(parsed.paid_social_pct);
        if (parsed.search_spend) setSearchSpendInput(parsed.search_spend);
        if (parsed.dv_spend) setDvSpendInput(parsed.dv_spend);
        if (parsed.social_spend) setSocialSpendInput(parsed.social_spend);
        if (parsed.aov) setAovInput(parsed.aov);
      }
    } catch (e) {
      console.warn("Could not read shared inputs from localStorage", e);
    }
  }, []);

  // Save shared inputs on update
  useEffect(() => {
    const data = {
      sessions: sessionsInput,
      conversions: conversionsInput,
      paid_search_pct: paidSearchPctInput,
      dv_pct: dvPctInput,
      paid_social_pct: paidSocialPctInput,
      search_spend: searchSpendInput,
      dv_spend: dvSpendInput,
      social_spend: socialSpendInput,
      aov: aovInput
    };
    try {
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save shared inputs to localStorage", e);
    }
  }, [
    sessionsInput,
    conversionsInput,
    paidSearchPctInput,
    dvPctInput,
    paidSocialPctInput,
    searchSpendInput,
    dvSpendInput,
    socialSpendInput,
    aovInput
  ]);

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

  const handleBaselineToggle = (checked: boolean) => {
    setUseBaseline(checked);
    if (checked) {
      setChSearch(false);
      setChVideo(false);
      setChSocial(false);
      setSessionsInput("500000");
      setConversionsInput("5000");
      setPaidSearchPctInput("45");
      setDvPctInput("15");
      setPaidSocialPctInput("20");
      setSearchSpendInput("50000");
      setDvSpendInput("25000");
      setSocialSpendInput("20000");
    }
  };

  const handleChannelToggle = (channel: "search" | "video" | "social", checked: boolean) => {
    setUseBaseline(false);
    if (channel === "search") setChSearch(checked);
    if (channel === "video") setChVideo(checked);
    if (channel === "social") setChSocial(checked);
  };

  // Grouped Features for Step 1
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, { icon: string; items: FeatureDef[] }> = {};

    AI_FEATURES.forEach(f => {
      if (f.channel === "search" && !filterSearch) return;
      if (f.channel === "video" && !filterVideo) return;

      if (!groups[f.group]) {
        groups[f.group] = { icon: f.groupIcon, items: [] };
      }
      groups[f.group].items.push(f);
    });

    return groups;
  }, [filterSearch, filterVideo]);

  // Results Calculation for Step 3
  const results = useMemo(() => {
    const baseConversions = parseFloat(conversionsInput) || (useBaseline ? 5000 : 0);
    const baseSessions = parseFloat(sessionsInput) || (useBaseline ? 500000 : 0);
    const aov = parseFloat(aovInput) || 100;

    let totalIncConversions = 0;

    const breakdown: Array<{
      feature: FeatureDef;
      adoption: number;
      avgUpliftPct: number;
      incConversions: number;
      incRevenue: number;
    }> = [];

    AI_FEATURES.forEach(f => {
      if (f.channel === "search" && !filterSearch) return;
      if (f.channel === "video" && !filterVideo) return;

      const st = featureState[f.id] || { adoption: 0, na: false };
      if (st.na || st.adoption >= 100) return;

      const unlockedRatio = (100 - st.adoption) / 100;
      const avgUplift = (f.loUplift + f.hiUplift) / 2;
      const incConv = baseConversions * avgUplift * unlockedRatio;

      totalIncConversions += incConv;

      breakdown.push({
        feature: f,
        adoption: st.adoption,
        avgUpliftPct: avgUplift * 100,
        incConversions: incConv,
        incRevenue: incConv * aov
      });
    });

    const newConversions = baseConversions + totalIncConversions;
    const overallUpliftPct = baseConversions > 0 ? (totalIncConversions / baseConversions) * 100 : 0;
    const totalIncRevenue = totalIncConversions * aov;

    return {
      baseSessions,
      baseConversions,
      newConversions,
      totalIncConversions,
      overallUpliftPct,
      totalIncRevenue,
      aov,
      breakdown
    };
  }, [sessionsInput, conversionsInput, aovInput, useBaseline, filterSearch, filterVideo, featureState]);

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
          <img src={heroImg} alt="Algo the bear thinking" />
        </div>
        <div className="hero">
          <h1>AI Value Calculator</h1>
          <p>
            Once your Algo's diet is strong, see what it can really do. Estimate the incremental conversions and revenue that AI-powered media, search &amp; video features could drive, based on which you've already fed it.
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
              AI Ingredients
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

        {/* STEP 1: Feature Adoption */}
        {currentStep === 1 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🎛️</div>
                <div>
                  <div className="card-title">Which channels are you interested in?</div>
                  <div className="card-subtitle">
                    Focus the ingredient list on the channels that matter to you. Foundations always apply.
                  </div>
                </div>
              </div>
              <div className="toggle-pills">
                <input
                  type="checkbox"
                  id="ff_search"
                  checked={filterSearch}
                  onChange={e => setFilterSearch(e.target.checked)}
                />
                <label htmlFor="ff_search">🔍 Search &amp; Performance</label>

                <input
                  type="checkbox"
                  id="ff_video"
                  checked={filterVideo}
                  onChange={e => setFilterVideo(e.target.checked)}
                />
                <label htmlFor="ff_video">🎬 Video</label>
              </div>
              <div className="mode-hint" id="featureFilterHint">
                💡 Showing all ingredients. Untick a channel above to hide its features from the list below.
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">🤖</div>
                <div>
                  <div className="card-title">AI Feature Adoption</div>
                  <div className="card-subtitle">
                    Tell us which AI-powered features are already in your Algo's bowl. We'll estimate the opportunity from the ones you're <strong>not</strong> yet feeding it.
                  </div>
                </div>
              </div>

              {Object.entries(groupedFeatures).map(([groupName, groupData]) => (
                <div key={groupName} style={{ marginBottom: "1.5rem" }}>
                  <div className="ai-group-head">
                    <span className="gh-icon">{groupData.icon}</span>
                    <span className="gh-title">{groupName}</span>
                  </div>

                  {groupData.items.map(f => {
                    const st = featureState[f.id] || { adoption: 0, na: false };
                    return (
                      <div className="feature-row" key={f.id}>
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
              ))}
            </div>

            <div className="btn-actions">
              <div />
              <button className="btn btn-primary" type="button" onClick={() => goToStep(2)}>
                Next: Current Bowl &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Current Performance Inputs */}
        {currentStep === 2 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🎛️</div>
                <div>
                  <div className="card-title">How would you like to model usage?</div>
                  <div className="card-subtitle">Use our industry baseline, or select the marketing channels you're active in to tailor the inputs</div>
                </div>
              </div>

              <div className="toggle-pills">
                <input
                  type="checkbox"
                  id="ch_baseline"
                  className="baseline-check"
                  checked={useBaseline}
                  onChange={e => handleBaselineToggle(e.target.checked)}
                />
                <label htmlFor="ch_baseline">📐 Use baseline assumptions</label>

                <span className="mode-or">or select channels</span>

                <input
                  type="checkbox"
                  id="ch_search"
                  checked={chSearch}
                  onChange={e => handleChannelToggle("search", e.target.checked)}
                />
                <label htmlFor="ch_search">🔍 Search</label>

                <input
                  type="checkbox"
                  id="ch_video"
                  checked={chVideo}
                  onChange={e => handleChannelToggle("video", e.target.checked)}
                />
                <label htmlFor="ch_video">🎬 Video</label>

                <input
                  type="checkbox"
                  id="ch_social"
                  checked={chSocial}
                  onChange={e => handleChannelToggle("social", e.target.checked)}
                />
                <label htmlFor="ch_social">📱 Social</label>
              </div>

              <div className="mode-hint" id="modeHint">
                {useBaseline ? (
                  <>
                    💡 <strong>Baseline assumptions</strong> pre-fill every field with industry averages so you can see an indicative result instantly. Switch to channel selection to enter your own figures.
                  </>
                ) : (
                  <>
                    💡 Select <strong>baseline assumptions</strong> for an instant indicative result, or tick the marketing channels you run to tailor the inputs.
                  </>
                )}
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
                <div className="form-group" id="grp_sessions">
                  <label htmlFor="sessions">Avg Monthly Sessions <span className="lbl-hint">(GA4 &rarr; Reports &rarr; Traffic)</span></label>
                  <input
                    type="number"
                    id="sessions"
                    placeholder="e.g. 500,000"
                    min="0"
                    value={sessionsInput}
                    onChange={e => setSessionsInput(e.target.value)}
                  />
                </div>

                <div className="form-group" id="grp_conversions">
                  <label htmlFor="conversions">Avg Monthly Conversions / Leads <span className="lbl-hint">(GA4 &rarr; Conversions)</span></label>
                  <input
                    type="number"
                    id="conversions"
                    placeholder="e.g. 5,000"
                    min="0"
                    value={conversionsInput}
                    onChange={e => setConversionsInput(e.target.value)}
                  />
                </div>

                {(useBaseline || chSearch) && (
                  <div className="form-group" id="grp_search_traffic">
                    <label htmlFor="paid_search_pct">Traffic from Paid Search <span className="lbl-hint">(%)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="paid_search_pct"
                        placeholder="e.g. 45"
                        min="0"
                        max="100"
                        value={paidSearchPctInput}
                        onChange={e => setPaidSearchPctInput(e.target.value)}
                        style={{ paddingRight: "2rem" }}
                      />
                      <span className="suffix">%</span>
                    </div>
                  </div>
                )}

                {(useBaseline || chVideo) && (
                  <div className="form-group" id="grp_video_traffic">
                    <label htmlFor="dv_pct">Traffic from Display &amp; Video <span className="lbl-hint">(%)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="dv_pct"
                        placeholder="e.g. 15"
                        min="0"
                        max="100"
                        value={dvPctInput}
                        onChange={e => setDvPctInput(e.target.value)}
                        style={{ paddingRight: "2rem" }}
                      />
                      <span className="suffix">%</span>
                    </div>
                  </div>
                )}

                {(useBaseline || chSocial) && (
                  <div className="form-group" id="grp_social_traffic">
                    <label htmlFor="paid_social_pct">Traffic from Paid Social <span className="lbl-hint">(%)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="paid_social_pct"
                        placeholder="e.g. 20"
                        min="0"
                        max="100"
                        value={paidSocialPctInput}
                        onChange={e => setPaidSocialPctInput(e.target.value)}
                        style={{ paddingRight: "2rem" }}
                      />
                      <span className="suffix">%</span>
                    </div>
                  </div>
                )}

                {(useBaseline || chSearch) && (
                  <div className="form-group" id="grp_search_spend">
                    <label htmlFor="search_spend">Monthly Google Ads Spend <span className="lbl-hint">(optional, for ROAS)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="search_spend"
                        placeholder="e.g. 50,000"
                        min="0"
                        value={searchSpendInput}
                        onChange={e => setSearchSpendInput(e.target.value)}
                        style={{ paddingLeft: "1.6rem" }}
                      />
                      <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                    </div>
                  </div>
                )}

                {(useBaseline || chVideo) && (
                  <div className="form-group" id="grp_video_spend">
                    <label htmlFor="dv_spend">Display &amp; Video Ad Spend <span className="lbl-hint">(optional, for ROAS)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="dv_spend"
                        placeholder="e.g. 25,000"
                        min="0"
                        value={dvSpendInput}
                        onChange={e => setDvSpendInput(e.target.value)}
                        style={{ paddingLeft: "1.6rem" }}
                      />
                      <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                    </div>
                  </div>
                )}

                {(useBaseline || chSocial) && (
                  <div className="form-group" id="grp_social_spend">
                    <label htmlFor="social_spend">Social Ad Spend <span className="lbl-hint">(optional, for ROAS)</span></label>
                    <div className="input-wrap">
                      <input
                        type="number"
                        id="social_spend"
                        placeholder="e.g. 20,000"
                        min="0"
                        value={socialSpendInput}
                        onChange={e => setSocialSpendInput(e.target.value)}
                        style={{ paddingLeft: "1.6rem" }}
                      />
                      <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                    </div>
                  </div>
                )}

                <div className="form-group full" id="grp_aov">
                  <label htmlFor="aov">Average Conversion Value <span className="lbl-hint">(used to translate extra conversions into revenue)</span></label>
                  <div className="input-wrap">
                    <input
                      type="number"
                      id="aov"
                      placeholder="e.g. 100"
                      min="0"
                      value={aovInput}
                      onChange={e => setAovInput(e.target.value)}
                      style={{ paddingLeft: "1.6rem" }}
                    />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                  <div className="hint-box">
                    💡 This is the average revenue (or lead value) per conversion. We pre-fill £100 as an industry default.
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(1)}>&larr; Back</button>
              <button className="btn btn-primary" type="button" onClick={() => goToStep(3)}>
                Calculate AI Value &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {currentStep === 3 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📈</div>
                <div>
                  <div className="card-title">Estimated Monthly AI Opportunity</div>
                  <div className="card-subtitle">
                    Based on your unadopted AI features, here is the potential monthly performance uplift.
                  </div>
                </div>
              </div>

              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-lbl">Current Monthly Conversions</div>
                  <div className="metric-val">{fmt(results.baseConversions)}</div>
                  <div className="metric-sub">Base performance</div>
                </div>

                <div className="metric-card uplift">
                  <div className="metric-lbl">Est. Incremental Conversions</div>
                  <div className="metric-val">+{fmt(results.totalIncConversions)}</div>
                  <div className="metric-up">+{results.overallUpliftPct.toFixed(1)}% Uplift</div>
                </div>

                <div className="metric-card uplift-conv">
                  <div className="metric-lbl">Est. Monthly Inc. Revenue</div>
                  <div className="metric-val">&pound;{fmt(results.totalIncRevenue)}</div>
                  <div className="metric-sub">at &pound;{results.aov} per conversion</div>
                </div>
              </div>

              {results.breakdown.length === 0 ? (
                <div className="no-features-msg">
                  🎉 Great job! You have fully adopted all selected AI features. Your Algo is fully fed!
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
                          +{fmt(b.incConversions)} extra conversions/mo
                        </div>
                      </div>
                      <div className="fc-metric">
                        Est. +&pound;{fmt(b.incRevenue)} / month
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

        {/* STEP 4: What's Next & Roadmap */}
        {currentStep === 4 && (
          <div className="step active">
            <div className="card">
              <div className="card-header">
                <div className="card-icon">🚀</div>
                <div>
                  <div className="card-title">Implementation Roadmap &amp; Next Steps</div>
                  <div className="card-subtitle">Recommended priority sequence to adopt your unmanaged AI features</div>
                </div>
              </div>

              {results.breakdown.length === 0 ? (
                <div className="no-features-msg">
                  Your AI media stack is operating at peak maturity. Maintain your data feeding pipeline to keep AI bidding algorithms accurate!
                </div>
              ) : (
                <>
                  <div className="priority-note">
                    <strong>Recommended Priority:</strong> Start with foundational measurement features (Enhanced Conversions, Consent Mode) before scaling campaign bidding algorithms like Performance Max and Value-Based Bidding.
                  </div>

                  <div className="gantt-wrap">
                    <div className="gantt">
                      <div className="gantt-header-row">
                        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--navy)" }}>
                          Feature
                        </div>
                        <div className="gantt-weeks-header">
                          {Array.from({ length: 15 }, (_, i) => (
                            <div key={i + 1} className="gantt-week-lbl">W{i + 1}</div>
                          ))}
                        </div>
                      </div>

                      {results.breakdown
                        .sort((a, b) => a.feature.priority - b.feature.priority)
                        .map(b => {
                          const f = b.feature;
                          const leftPct = ((f.startWeek - 1) / 15) * 100;
                          const implWidthPct = (f.implWeeks / 15) * 100;
                          const qaLeftPct = ((f.startWeek + f.implWeeks - 1) / 15) * 100;
                          const qaWidthPct = (f.qaWeeks / 15) * 100;

                          return (
                            <div className="gantt-feature-row" key={f.id}>
                              <div className="gantt-row-label">
                                <span className={`priority-pip pip-${f.priority}`}>
                                  P{f.priority}
                                </span>
                                {f.name}
                              </div>
                              <div className="gantt-track">
                                <div
                                  className="gbar impl"
                                  style={{ left: `${leftPct}%`, width: `${implWidthPct}%` }}
                                  title={`Implementation: Weeks ${f.startWeek}-${f.startWeek + f.implWeeks - 1}`}
                                />
                                <div
                                  className="gbar qa"
                                  style={{ left: `${qaLeftPct}%`, width: `${qaWidthPct}%` }}
                                  title={`QA & Tuning: Weeks ${f.startWeek + f.implWeeks}-${f.startWeek + f.implWeeks + f.qaWeeks - 1}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="gantt-legend">
                      <div className="gantt-legend-item">
                        <div className="legend-swatch ls-impl" /> Implementation Phase
                      </div>
                      <div className="gantt-legend-item">
                        <div className="legend-swatch ls-qa" /> QA &amp; Bidding Tuning
                      </div>
                    </div>
                  </div>
                </>
              )}

              <hr className="section-divider" />

              <div className="card-title" style={{ marginBottom: "0.75rem" }}>
                Request an Algo Audit &amp; Implementation Plan
              </div>

              {formSubmitted ? (
                <div className="no-features-msg" style={{ background: "rgba(90,169,107,0.1)", borderRadius: "12px" }}>
                  ✅ Thank you {ctaName || "there"}! Your audit request has been submitted. A dentsu specialist will be in touch shortly.
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                >
                  <div className="cta-form">
                    <div className="form-group">
                      <label htmlFor="cta_name">Name</label>
                      <input
                        type="text"
                        id="cta_name"
                        placeholder="Your Name"
                        value={ctaName}
                        onChange={e => setCtaName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cta_email">Work Email</label>
                      <input
                        type="email"
                        id="cta_email"
                        placeholder="name@company.com"
                        value={ctaEmail}
                        onChange={e => setCtaEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group full">
                      <label htmlFor="cta_company">Company Name</label>
                      <input
                        type="text"
                        id="cta_company"
                        placeholder="Company Ltd"
                        value={ctaCompany}
                        onChange={e => setCtaCompany(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group full" style={{ marginTop: "0.5rem" }}>
                      <button className="btn btn-primary" type="submit">
                        Submit Audit Request &rarr;
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="form-note">
                🔒 Your details will only be used by dentsu/Algo specialists to provide your custom media audit.
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

      <footer>&copy; dentsu 2026 &middot; Algo &middot; AI Value Calculator</footer>
    </div>
  );
}