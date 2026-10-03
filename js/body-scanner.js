/**
 * BioTelemetry Anatomy & Systems Engine v3.0
 * 8 Physiological Systems Telemetry, 4 Visual Layers, and Clinical Decomposition.
 */

(function () {
  "use strict";

  const SYSTEM_LAYERS = {
    circulatory: "organs",
    respiratory: "organs",
    digestive: "organs",
    renal: "organs",
    immune: "organs",
    muscular: "muscles",
    skeletal: "skeleton",
    nervous: "nerves"
  };

  const HOTSPOT_PINS = [
    // Layer 1: Organs (Calibrated to 896x1200 anatomical illustration)
    { id: "heart", sys: "circulatory", layer: "organs", top: "33%", left: "54%" },
    { id: "lungs", sys: "respiratory", layer: "organs", top: "28%", left: "33%" },
    { id: "lungs", sys: "respiratory", layer: "organs", top: "28%", left: "67%" },
    { id: "liver", sys: "digestive", layer: "organs", top: "52%", left: "34%" },
    { id: "stomach", sys: "digestive", layer: "organs", top: "57%", left: "63%" },
    { id: "kidney_right", sys: "renal", layer: "organs", top: "63%", left: "37%" },
    { id: "kidney_left", sys: "renal", layer: "organs", top: "63%", left: "67%" },
    { id: "gut", sys: "immune", layer: "organs", top: "80%", left: "50%" },

    // Layer 2: Skeleton
    { id: "spine", sys: "skeletal", layer: "skeleton", top: "12%", left: "50%" },
    { id: "spine", sys: "skeletal", layer: "skeleton", top: "58%", left: "50%" },
    { id: "joints", sys: "skeletal", layer: "skeleton", top: "24%", left: "17%" },
    { id: "joints", sys: "skeletal", layer: "skeleton", top: "24%", left: "83%" },
    { id: "joints", sys: "skeletal", layer: "skeleton", top: "91%", left: "32%" },
    { id: "joints", sys: "skeletal", layer: "skeleton", top: "91%", left: "68%" },

    // Layer 3: Muscles
    { id: "muscles", sys: "muscular", layer: "muscles", top: "32%", left: "36%" },
    { id: "muscles", sys: "muscular", layer: "muscles", top: "32%", left: "64%" },
    { id: "muscles", sys: "muscular", layer: "muscles", top: "58%", left: "50%" },
    { id: "muscles", sys: "muscular", layer: "muscles", top: "48%", left: "16%" },
    { id: "muscles", sys: "muscular", layer: "muscles", top: "48%", left: "84%" },

    // Layer 4: Nerves
    { id: "brain", sys: "nervous", layer: "nerves", top: "16%", left: "50%" },
    { id: "brain", sys: "nervous", layer: "nerves", top: "36%", left: "50%" },
    { id: "nerves", sys: "nervous", layer: "nerves", top: "60%", left: "50%" },
    { id: "nerves", sys: "nervous", layer: "nerves", top: "52%", left: "20%" },
    { id: "nerves", sys: "nervous", layer: "nerves", top: "52%", left: "80%" }
  ];

  class BioTelemetryCockpit {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      this.options = Object.assign({ isQuizMode: false, onSystemSelect: null }, options);
      this.activeSystem = "circulatory";
      this.activeLayer = "organs";
      this.answers = {};
      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();

      // Listen for language changes
      window.addEventListener("bio:lang-changed", () => {
        this.render();
        this.bindEvents();
        this.update(this.answers);
      });
    }

    render() {
      const lang = window.I18N ? window.I18N.currentLang : "uk";
      const t = (k) => (window.I18N ? window.I18N.get(k) : k);

      this.container.innerHTML = `
        <div class="bio-cockpit">
          
          <!-- LEFT PANEL: 8 PHYSIOLOGICAL SYSTEMS -->
          <div class="bio-systems-panel">
            <div class="bio-panel-title">
              <span>🩻 ${t("hud.systemHealth")}</span>
              <span id="${this.container.id}-overall-pct" style="color: var(--bio-emerald);">100%</span>
            </div>
            <div class="bio-systems-stack" id="${this.container.id}-systems-list">
              <!-- Injected dynamically -->
            </div>
          </div>

          <!-- CENTER VIEWPORT: MULTILAYER ANATOMY -->
          <div class="bio-viewport-panel">
            <!-- Layer Switcher Segmented Control -->
            <div class="bio-layer-tabs" role="tablist">
              <button type="button" role="tab" class="bio-layer-btn ${this.activeLayer === "organs" ? "active" : ""}" data-layer="organs">
                <svg class="layer-tab-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>${t("layers.organs")}</span>
              </button>
              <button type="button" role="tab" class="bio-layer-btn ${this.activeLayer === "muscles" ? "active" : ""}" data-layer="muscles">
                <svg class="layer-tab-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18h12M6 6h12M9 12h6M4 10h16M4 14h16"/></svg>
                <span>${t("layers.muscles")}</span>
              </button>
              <button type="button" role="tab" class="bio-layer-btn ${this.activeLayer === "skeleton" ? "active" : ""}" data-layer="skeleton">
                <svg class="layer-tab-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8 8l8 8"/></svg>
                <span>${t("layers.skeleton")}</span>
              </button>
              <button type="button" role="tab" class="bio-layer-btn ${this.activeLayer === "nerves" ? "active" : ""}" data-layer="nerves">
                <svg class="layer-tab-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>${t("layers.nerves")}</span>
              </button>
            </div>

            <!-- Body Frame with Multi-Layer Images -->
            <div class="bio-body-frame" id="${this.container.id}-body-frame">
              <!-- Visual Images Stack -->
              <img src="img/layer-organs.jpg" class="bio-layer-img ${this.activeLayer === "organs" ? "active" : ""}" data-layer="organs" alt="${t("layers.organs")}" />
              <img src="img/layer-muscles.jpg" class="bio-layer-img ${this.activeLayer === "muscles" ? "active" : ""}" data-layer="muscles" alt="${t("layers.muscles")}" />
              <img src="img/layer-skeleton.jpg" class="bio-layer-img ${this.activeLayer === "skeleton" ? "active" : ""}" data-layer="skeleton" alt="${t("layers.skeleton")}" />
              <img src="img/layer-nerves.jpg" class="bio-layer-img ${this.activeLayer === "nerves" ? "active" : ""}" data-layer="nerves" alt="${t("layers.nerves")}" />

              <!-- Hotspot Interactive Pins -->
              <div class="bio-hotspots-overlay" id="${this.container.id}-hotspots">
                <!-- Injected pins -->
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: CLINICAL INSPECTOR & FACTORS -->
          <div class="bio-inspector-panel" id="${this.container.id}-inspector">
            <div class="bio-insp-top">
              <div class="bio-insp-title">
                <span id="${this.container.id}-insp-icon">🫀</span>
                <span id="${this.container.id}-insp-name">Кровообіг</span>
              </div>
              <div class="bio-insp-badge status-optimal" id="${this.container.id}-insp-badge">
                100.0% (${t("hud.statusOptimal")})
              </div>
            </div>

            <div class="bio-insp-desc" id="${this.container.id}-insp-desc">
              ${t("loadingQuestion")}
            </div>

            <div style="font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; color: var(--bio-cyan); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
              ${t("hud.diagnosticFactors")}
            </div>

            <div class="bio-factors-box" id="${this.container.id}-insp-factors">
              <!-- Factors list -->
            </div>

            ${this.options.isQuizMode ? `
              <button type="button" class="bio-factor-action-btn" id="${this.container.id}-btn-goto-sys">
                <span>${t("hud.gotoSysBtn")}</span>
                <span>→</span>
              </button>
            ` : ""}
          </div>

        </div>
      `;

      this.renderSystemsList();
      this.renderHotspots();
      this.updateInspector();
    }

    renderSystemsList() {
      const list = document.getElementById(`${this.container.id}-systems-list`);
      if (!list) return;

      const lang = window.I18N ? window.I18N.currentLang : "uk";
      list.innerHTML = "";

      for (const sysId in window.SYSTEMS_INFO) {
        const sys = window.SYSTEMS_INFO[sysId];
        const stats = this.getSystemHealth(sysId);

        const row = document.createElement("div");
        row.className = `bio-sys-row ${this.activeSystem === sysId ? "active" : ""}`;
        row.setAttribute("data-sys", sysId);

        const titleText = sys.title[lang] || sys.title.uk;

        row.innerHTML = `
          <div class="bio-gauge-wrap status-${stats.status}">
            <span class="bio-gauge-icon">${sys.icon}</span>
          </div>
          <div class="bio-sys-info">
            <div class="bio-sys-header">
              <span class="bio-sys-name">${titleText}</span>
              <span class="bio-sys-val">${stats.health.toFixed(0)}%</span>
            </div>
            <div class="bio-sys-track">
              <div class="bio-sys-fill status-${stats.status}" style="width: ${stats.health}%"></div>
            </div>
          </div>
          <span class="bio-sys-count ${stats.isComplete ? "done" : ""}">${stats.answeredCount}/${stats.totalCount}</span>
        `;

        row.addEventListener("click", () => this.selectSystem(sysId));
        list.appendChild(row);
      }
    }

    renderHotspots() {
      const overlay = document.getElementById(`${this.container.id}-hotspots`);
      if (!overlay) return;
      const t = (k) => (window.I18N ? window.I18N.get(k) : k);

      overlay.innerHTML = "";
      HOTSPOT_PINS.forEach((pin) => {
        if (pin.layer !== this.activeLayer) return;

        const el = document.createElement("div");
        const stats = this.getSystemHealth(pin.sys);
        el.className = `bio-pin status-${stats.status}`;
        el.style.top = pin.top;
        el.style.left = pin.left;
        el.title = t(`hotspots.${pin.id}`);

        el.innerHTML = `
          <div class="bio-pin-ring"></div>
          <div class="bio-pin-core"></div>
        `;

        el.addEventListener("click", () => this.selectSystem(pin.sys));
        overlay.appendChild(el);
      });
    }

    bindEvents() {
      // Layer buttons
      const btns = this.container.querySelectorAll(".bio-layer-btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const l = btn.getAttribute("data-layer");
          this.switchLayer(l);
        });
      });

      // Jump to system questions button
      const gotoBtn = document.getElementById(`${this.container.id}-btn-goto-sys`);
      if (gotoBtn && this.options.onSystemSelect) {
        gotoBtn.addEventListener("click", () => {
          this.options.onSystemSelect(this.activeSystem);
        });
      }
    }

    switchLayer(layerName) {
      if (!layerName) return;
      this.activeLayer = layerName;

      // Update layer tab buttons
      const btns = this.container.querySelectorAll(".bio-layer-btn");
      btns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-layer") === layerName));

      // Update layer images
      const imgs = this.container.querySelectorAll(".bio-layer-img");
      imgs.forEach((img) => img.classList.toggle("active", img.getAttribute("data-layer") === layerName));

      this.renderHotspots();
    }

    selectSystem(sysId) {
      if (!window.SYSTEMS_INFO[sysId]) return;
      this.activeSystem = sysId;

      // Auto-switch layer corresponding to this system
      const targetLayer = SYSTEM_LAYERS[sysId] || "organs";
      this.switchLayer(targetLayer);

      // Update active rows
      const rows = this.container.querySelectorAll(".bio-sys-row");
      rows.forEach((r) => r.classList.toggle("active", r.getAttribute("data-sys") === sysId));

      this.updateInspector();

      if (window.innerWidth < 992 && !this.options.isQuizMode) {
        const insp = document.getElementById(`${this.container.id}-inspector`);
        if (insp) {
          insp.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }

    getSystemHealth(sysId) {
      const sysQuestions = window.QUESTIONS.filter((q) => q.system === sysId);
      const totalCount = sysQuestions.length;
      let answeredCount = 0;
      let totalNegativeDelta = 0;
      let totalPositiveDelta = 0;

      sysQuestions.forEach((q) => {
        const a = this.answers[q.id];
        if (a) {
          answeredCount++;
          if (a.d < 0) totalNegativeDelta += Math.abs(a.d);
          if (a.d > 0) totalPositiveDelta += a.d;
        }
      });

      // Start at 100%, subtract clinical damage proportional to hazard ratio
      let health = 100.0 - totalNegativeDelta * 8.5 + totalPositiveDelta * 2.0;
      health = Math.max(15, Math.min(100, Math.round(health)));

      let status = "optimal";
      if (health < 55) status = "critical";
      else if (health < 80) status = "compensated";

      return {
        health: health,
        status: status,
        totalCount: totalCount,
        answeredCount: answeredCount,
        isComplete: answeredCount >= totalCount && totalCount > 0,
        questions: sysQuestions
      };
    }

    update(answers = {}) {
      this.answers = answers;
      this.renderSystemsList();
      this.renderHotspots();
      this.updateInspector();

      // Update overall percentage
      let sum = 0;
      let count = 0;
      for (const sysId in window.SYSTEMS_INFO) {
        sum += this.getSystemHealth(sysId).health;
        count++;
      }
      const overall = count > 0 ? Math.round(sum / count) : 100;
      const overallEl = document.getElementById(`${this.container.id}-overall-pct`);
      if (overallEl) {
        overallEl.textContent = `${overall}%`;
        overallEl.style.color = overall > 75 ? "var(--bio-emerald)" : overall > 50 ? "var(--bio-amber)" : "var(--bio-rose)";
      }
    }

    updateInspector() {
      const sys = window.SYSTEMS_INFO[this.activeSystem];
      if (!sys) return;

      const lang = window.I18N ? window.I18N.currentLang : "uk";
      const t = (k) => (window.I18N ? window.I18N.get(k) : k);
      const stats = this.getSystemHealth(this.activeSystem);

      const elIcon = document.getElementById(`${this.container.id}-insp-icon`);
      const elName = document.getElementById(`${this.container.id}-insp-name`);
      const elBadge = document.getElementById(`${this.container.id}-insp-badge`);
      const elDesc = document.getElementById(`${this.container.id}-insp-desc`);
      const elFactors = document.getElementById(`${this.container.id}-insp-factors`);

      if (elIcon) elIcon.textContent = sys.icon;
      if (elName) elName.textContent = sys.title[lang] || sys.title.uk;
      if (elDesc) elDesc.textContent = sys.desc[lang] || sys.desc.uk;

      if (elBadge) {
        elBadge.className = `bio-insp-badge status-${stats.status}`;
        let statusLabel = t("hud.statusOptimal");
        if (stats.status === "compensated") statusLabel = t("hud.statusCompensated");
        if (stats.status === "critical") statusLabel = t("hud.statusCritical");
        elBadge.textContent = `${stats.health}% (${statusLabel})`;
      }

      if (elFactors) {
        elFactors.innerHTML = "";
        const answeredFactors = [];

        stats.questions.forEach((q) => {
          const a = this.answers[q.id];
          if (a) {
            answeredFactors.push({
              title: q.q[lang] || q.q.uk,
              optTitle: a.label?.[lang] || a.l?.[lang] || a.t?.[lang] || a.label || a.t,
              delta: a.d,
              studies: q.studies
            });
          }
        });

        if (answeredFactors.length === 0) {
          const emptyText = t("hud.factorsEmptyHint").replace("{count}", stats.totalCount);
          elFactors.innerHTML = `
            <div style="font-size: 11.5px; color: var(--text-muted); font-style: italic; padding: 12px 0;">
              ${emptyText}
            </div>
          `;
        } else {
          answeredFactors.forEach((f) => {
            const card = document.createElement("div");
            const factorClass = f.delta > 0 ? "pos" : f.delta < 0 ? "neg" : "neutral";
            const sign = f.delta > 0 ? "+" : "";
            card.className = `bio-factor-card ${factorClass}`;

            card.innerHTML = `
              <div style="max-width: 72%;">
                <div style="font-weight: 700; color: #ffffff;">${f.optTitle}</div>
                <div style="font-size: 10px; color: var(--text-muted);">${f.title}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 12px; color: ${f.delta > 0 ? "var(--bio-emerald)" : f.delta < 0 ? "var(--bio-rose)" : "var(--bio-cyan)"}">
                  ${sign}${f.delta} ${t("unitYear")}
                </div>
                ${f.studies && f.studies[0] ? `
                  <a href="${f.studies[0].link}" target="_blank" rel="noopener noreferrer" style="font-size: 9.5px; color: var(--bio-cyan); text-decoration: none;">
                    PubMed ↗
                  </a>
                ` : ""}
              </div>
            `;
            elFactors.appendChild(card);
          });
        }
      }
    }
  }

  window.BioTelemetryCockpit = BioTelemetryCockpit;
})();
