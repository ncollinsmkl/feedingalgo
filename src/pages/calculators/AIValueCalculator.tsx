import { Link } from "react-router-dom";
import logoImg from "../../assets/hero.png";
import heroImg from "../../assets/ai_value_algo_hero.png";

export default function AIValueCalculator() {
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
        <div className="progress-bar">
          <div className="step-item">
            <div className="step-circle active" id="circle1">1</div>
            <div className="step-label active" id="label1">AI Ingredients</div>
          </div>
          <div className="step-connector" id="conn1" />
          <div className="step-item">
            <div className="step-circle" id="circle2">2</div>
            <div className="step-label" id="label2">Current Bowl</div>
          </div>
          <div className="step-connector" id="conn2" />
          <div className="step-item">
            <div className="step-circle" id="circle3">3</div>
            <div className="step-label" id="label3">Results</div>
          </div>
          <div className="step-connector" id="conn3" />
          <div className="step-item">
            <div className="step-circle" id="circle4">4</div>
            <div className="step-label" id="label4">What's Next</div>
          </div>
        </div>

        {/* STEP 1 */}
        <div className="step active" id="step1">
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
              <input type="checkbox" id="ff_search" defaultChecked />
              <label htmlFor="ff_search">🔍 Search &amp; Performance</label>
              <input type="checkbox" id="ff_video" defaultChecked />
              <label htmlFor="ff_video">🎬 Video</label>
            </div>
            <div className="mode-hint" id="featureFilterHint">
              💡 Showing all ingredients, untick a channel to hide its features from the list below.
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
            <div id="featuresContainer" />
          </div>

          <div className="btn-actions">
            <div />
            <button className="btn btn-primary" type="button">Next: Current Bowl &rarr;</button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="step" id="step2">
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
                <label htmlFor="search_spend"><span id="search_spend_label">Monthly Google Ads Spend</span> <span className="lbl-hint">(optional, for ROAS)</span></label>
                <div className="input-wrap">
                  <input type="number" id="search_spend" placeholder="e.g. 1,000,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                  <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                </div>
              </div>

              <div className="form-group" id="grp_video_spend">
                <label htmlFor="dv_spend">Display &amp; Video Ad Spend <span className="lbl-hint">(optional, for ROAS)</span></label>
                <div className="input-wrap">
                  <input type="number" id="dv_spend" placeholder="e.g. 25,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                  <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                </div>
              </div>

              <div className="form-group" id="grp_social_spend">
                <label htmlFor="social_spend">Social Ad Spend <span className="lbl-hint">(optional, for ROAS)</span></label>
                <div className="input-wrap">
                  <input type="number" id="social_spend" placeholder="e.g. 20,000" min="0" style={{ paddingLeft: "1.6rem" }} />
                  <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                </div>
              </div>

              <div className="form-group full" id="grp_aov">
                <label htmlFor="aov">Average Conversion Value <span className="lbl-hint">(used to translate extra conversions into revenue)</span></label>
                <div className="input-wrap">
                  <input type="number" id="aov" placeholder="e.g. 100" min="0" defaultValue="100" style={{ paddingLeft: "1.6rem" }} />
                  <span className="suffix" style={{ left: "0.85rem", right: "auto" }}>£</span>
                </div>
                <div className="hint-box">
                  💡 This is the average revenue (or lead value) per conversion. We pre-fill £50 as an industry default. Please edit to match your business, or it will carry over from the Data Strength Calculator (your Algo's diet check) if you've used it.
                </div>
              </div>
            </div>
          </div>

          <div className="btn-actions">
            <button className="btn btn-ghost" type="button">&larr; Back</button>
            <button className="btn btn-primary" type="button">Calculate AI Value &rarr;</button>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="step" id="step3">
          <div id="resultsContent" />
          <div className="btn-actions">
            <button className="btn btn-ghost" type="button">&larr; Revise Inputs</button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-pdf" type="button">⬇ Download PDF</button>
              <button className="btn btn-primary" type="button">What's Next &rarr;</button>
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="step" id="step4">
          <div id="step4Content" />
          <div className="btn-actions">
            <button className="btn btn-ghost" type="button">&larr; Back to Results</button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-pdf" type="button">⬇ Download PDF</button>
              <button className="btn btn-ghost" type="button">Start Over</button>
            </div>
          </div>
        </div>
      </div>

      <footer>&copy; dentsu 2026 &middot; Algo &middot; AI Value Calculator</footer>
    </div>
  );
}