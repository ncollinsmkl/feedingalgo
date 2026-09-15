import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/hero.png";
import heroImg from "../../assets/data_strength_algo_hero.png";

export default function DataStrengthCalculator() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

              <div className="feature-row">
                <div>
                  <div className="feature-name-row">
                    <div className="feature-name">Advanced Consent Mode</div>
                    <div className="na-toggle-inline">
                      <input type="checkbox" id="consent_mode_na" />
                      <label htmlFor="consent_mode_na">Not applicable</label>
                    </div>
                  </div>
                  <div className="feature-desc">
                    Enables modelled conversions and session recovery for users who decline cookies, using AI to fill the measurement gap.
                  </div>
                </div>
                <div className="adopt-slider-wrap" id="consent_mode_wrap">
                  <input type="range" id="consent_mode_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                  <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                </div>
              </div>

              <div className="feature-row">
                <div>
                  <div className="feature-name-row">
                    <div className="feature-name">Enhanced Conversions</div>
                    <div className="na-toggle-inline">
                      <input type="checkbox" id="enhanced_conv_na" />
                      <label htmlFor="enhanced_conv_na">Not applicable</label>
                    </div>
                  </div>
                  <div className="feature-desc">
                    Supplements existing conversion tags with hashed first-party data, improving accuracy for Paid Search campaigns.
                  </div>
                </div>
                <div className="adopt-slider-wrap" id="enhanced_conv_wrap">
                  <input type="range" id="enhanced_conv_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                  <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                </div>
              </div>

              <div className="feature-row">
                <div>
                  <div className="feature-name-row">
                    <div className="feature-name">Google Tag Gateway (GTG)</div>
                    <div className="na-toggle-inline">
                      <input type="checkbox" id="gtg_na" />
                      <label htmlFor="gtg_na">Not applicable</label>
                    </div>
                  </div>
                  <div className="feature-desc">
                    Routes Google tags through a first-party subdomain, reducing tag blocking and improving session data completeness.
                  </div>
                </div>
                <div className="adopt-slider-wrap" id="gtg_wrap">
                  <input type="range" id="gtg_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                  <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                </div>
              </div>

              <div className="feature-row">
                <div>
                  <div className="feature-name-row">
                    <div className="feature-name">Server-Side Google Tag Manager (sGTM)</div>
                    <div className="na-toggle-inline">
                      <input type="checkbox" id="sgtm_na" />
                      <label htmlFor="sgtm_na">Not applicable</label>
                    </div>
                  </div>
                  <div className="feature-desc">
                    Processes tags through a first-party server, improving data governance, enrichment for analysis and activation, as well as potentially site speed.
                  </div>
                </div>
                <div className="adopt-slider-wrap" id="sgtm_wrap">
                  <input type="range" id="sgtm_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                  <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                </div>
              </div>

              <div className="sub-feature">
                <div className="sub-feature-title">↳ Delivered via Server-Side GTM &middot; modelled when Paid Social is selected</div>
                <div className="sf-item">
                  <div>
                    <div className="feature-name-row">
                      <div className="sf-name">Meta CAPI (Conversions API)</div>
                      <div className="na-toggle-inline">
                        <input type="checkbox" id="meta_capi_na" />
                        <label htmlFor="meta_capi_na">Not applicable</label>
                      </div>
                    </div>
                    <div className="sf-desc">
                      Sends conversions &amp; events to Meta server-side via sGTM, recovering signal lost to browser/ITP restrictions.
                    </div>
                  </div>
                  <div className="adopt-slider-wrap" id="meta_capi_wrap">
                    <input type="range" id="meta_capi_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                    <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                  </div>
                </div>
                <div className="sf-item">
                  <div>
                    <div className="feature-name-row">
                      <div className="sf-name">TikTok EAPI (Events API)</div>
                      <div className="na-toggle-inline">
                        <input type="checkbox" id="tiktok_eapi_na" />
                        <label htmlFor="tiktok_eapi_na">Not applicable</label>
                      </div>
                    </div>
                    <div className="sf-desc">
                      Server-side event forwarding to TikTok via sGTM for more complete conversion measurement.
                    </div>
                  </div>
                  <div className="adopt-slider-wrap" id="tiktok_eapi_wrap">
                    <input type="range" id="tiktok_eapi_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                    <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                  </div>
                </div>
              </div>

              <div className="feature-row">
                <div>
                  <div className="feature-name-row">
                    <div className="feature-name">BigQuery Integration</div>
                    <div className="na-toggle-inline">
                      <input type="checkbox" id="bigquery_na" />
                      <label htmlFor="bigquery_na">Not applicable</label>
                    </div>
                  </div>
                  <div className="feature-desc">
                    Exports raw GA4 event data to BigQuery for advanced analysis, custom attribution, and audience activation.
                  </div>
                </div>
                <div className="adopt-slider-wrap" id="bigquery_wrap">
                  <input type="range" id="bigquery_slider" min="0" max="100" step="25" defaultValue="0" className="adopt-slider" style={{ accentColor: "var(--navy)" }} />
                  <div className="adopt-ticks"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                </div>
              </div>
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
                  <div className="card-subtitle">Use our industry baseline, or select the marketing channels you're active in to tailor the inputs</div>
                </div>
              </div>

              <div className="toggle-pills">
                <input type="checkbox" id="ch_baseline" className="baseline-check" defaultChecked />
                <label htmlFor="ch_baseline">📐 Use baseline assumptions</label>
                <span className="mode-or">or select channels</span>
                <input type="checkbox" id="ch_search" />
                <label htmlFor="ch_search">🔍 Search</label>
                <input type="checkbox" id="ch_video" />
                <label htmlFor="ch_video">🎬 Video</label>
                <input type="checkbox" id="ch_social" />
                <label htmlFor="ch_social">📱 Social</label>
              </div>
              <div className="mode-hint" id="modeHint">
                💡 <strong>Baseline assumptions</strong> pre-fill every field with industry averages so you can see an indicative result instantly. Switch to channel selection to enter your own figures.
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <div>
                  <div className="card-title">Current Monthly Performance</div>
                  <div className="card-subtitle">Enter your average monthly figures, use Google Analytics or Google Ads as appropriate</div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group" id="grp_sessions">
                  <label htmlFor="sessions">Avg Monthly Sessions <span className="lbl-hint">(GA4 &rarr; Reports &rarr; Traffic)</span></label>
                  <input type="number" id="sessions" placeholder="e.g. 500,000" min="0" />
                </div>

                <div className="form-group" id="grp_conversions">
                  <label htmlFor="conversions">Avg Monthly Conversions / Leads <span className="lbl-hint">(GA4 &rarr; Conversions)</span></label>
                  <input type="number" id="conversions" placeholder="e.g. 5,000" min="0" />
                </div>

                <div className="form-group" id="grp_search_traffic">
                  <label htmlFor="paid_search_pct">Traffic from Paid Search <span className="lbl-hint">(%)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="paid_search_pct" placeholder="e.g. 45" min="0" max="100" style={{ paddingRight: "2rem" }} />
                    <span className="suffix">%</span>
                  </div>
                </div>

                <div className="form-group" id="grp_video_traffic">
                  <label htmlFor="dv_pct">Traffic from Display &amp; Video <span className="lbl-hint">(%)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="dv_pct" placeholder="e.g. 15" min="0" max="100" style={{ paddingRight: "2rem" }} />
                    <span className="suffix">%</span>
                  </div>
                </div>

                <div className="form-group" id="grp_social_traffic">
                  <label htmlFor="paid_social_pct">Traffic from Paid Social <span className="lbl-hint">(%)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="paid_social_pct" placeholder="e.g. 20" min="0" max="100" style={{ paddingRight: "2rem" }} />
                    <span className="suffix">%</span>
                  </div>
                </div>

                <div className="form-group" id="grp_search_spend">
                  <label htmlFor="search_spend"><span id="search_spend_label">Monthly Google Ads Spend</span> <span className="lbl-hint">(optional)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="search_spend" placeholder="e.g. 50,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                </div>

                <div className="form-group" id="grp_video_spend">
                  <label htmlFor="dv_spend">Display &amp; Video Ad Spend <span className="lbl-hint">(optional)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="dv_spend" placeholder="e.g. 25,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                </div>

                <div className="form-group" id="grp_social_spend">
                  <label htmlFor="social_spend">Social Ad Spend <span className="lbl-hint">(optional)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="social_spend" placeholder="e.g. 20,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                </div>

                <div className="form-group" id="grp_safari">
                  <label htmlFor="safari_pct">Safari % of Traffic <span className="lbl-hint">(drives server-side gains)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="safari_pct" placeholder="e.g. 40" min="0" max="100" defaultValue="40" style={{ paddingRight: "2rem" }} />
                    <span className="suffix">%</span>
                  </div>
                </div>

                <div className="form-group" id="grp_aov">
                  <label htmlFor="aov">Average Order / Lead Value <span className="lbl-hint">(optional, for revenue estimate)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="aov" placeholder="e.g. 50" min="0" style={{ paddingLeft: "1.6rem" }} />
                    <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                  </div>
                </div>

                <div className="form-group full" id="grp_consent">
                  <label htmlFor="consent_rate">Consent Opt-In Rate <span className="lbl-hint">(needed for Advanced Consent Mode session recovery)</span></label>
                  <div className="input-wrap">
                    <input type="number" id="consent_rate" placeholder="e.g. 75" min="0" max="100" style={{ paddingRight: "2rem" }} />
                    <span className="suffix">%</span>
                  </div>
                  <div className="hint-box">
                    💡 Your consent opt-in rate calibrates Advanced Consent Mode session recovery (recovered sessions are estimated from the opted-out share of your traffic). Modelled data provides an indicative estimate and may not precisely reflect actual user behaviour in all cases.
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(1)}>&larr; Back</button>
              <button className="btn btn-primary" type="button" onClick={() => goToStep(3)}>Calculate Uplift &rarr;</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="step active">
            <div id="resultsContent" />
            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(2)}>&larr; Revise Inputs</button>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-pdf" type="button">⬇ Download PDF</button>
                <button className="btn btn-primary" type="button" onClick={() => goToStep(4)}>What's Next &rarr;</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="step active">
            <div id="step4Content" />
            <div className="btn-actions">
              <button className="btn btn-ghost" type="button" onClick={() => goToStep(3)}>&larr; Back to Results</button>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-pdf" type="button">⬇ Download PDF</button>
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