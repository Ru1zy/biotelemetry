/**
 * Biometric Anatomical Body Scanner
 * Interactive SVG wireframe with real-time organ telemetry and risk/benefit breakdown.
 */

(function () {
  "use strict";

  const ORGAN_DEFINITIONS = {
    brain: {
      id: "brain",
      name: "Головний мозок та ЦНС",
      icon: "🧠",
      target: { cx: 110, cy: 46 },
      relevantQuestions: ["sleep_h", "sleep_q", "stress", "alco"],
      defaultDescription: "Центральна нервова система керує циркадними ритмами, автономним тонусом та віссю HPA. Під час повільнохвильового сну активується глімфатична система, яка вимиває токсичні білкові агрегати (бета-амілоїд та тау-протеїн).",
      scienceTip: "Якісний сон 7-8 годин та обмеження нейротоксинів зберігають об'єм сірої речовини кори мозку та знижують ризик нейродегенерації."
    },
    heart: {
      id: "heart",
      name: "Серцево-судинна система",
      icon: "🫀",
      target: { cx: 122, cy: 128 },
      relevantQuestions: ["bp", "rhr", "vo2"],
      defaultDescription: "Міокард та артеріальне русло. Здоров'я ендотелію судин визначається рівнем артеріального тиску, відсутністю кальцифікації артерій та кардіореспіраторною витривалістю (VO2 Max).",
      scienceTip: "Зниження пульсу спокою (<65 уд/хв) та нормальний тиск (<120/80 мм рт. ст.) захищають від інфарктів та судинної деменції."
    },
    lungs: {
      id: "lungs",
      name: "Легені та дихальний тракт",
      icon: "🫁",
      target: { cx: 96, cy: 124, secondCx: 124, secondCy: 124 },
      relevantQuestions: ["smoke", "air"],
      defaultDescription: "Альвеолярна поверхня газообміну та мукоциліарний бар'єр. Тютюновий дим та дрібнодисперсні частки PM2.5 руйнують сурфактант, викликають емфізему та транслокуються крізь капіляри в кров.",
      scienceTip: "Відсутність тютюнового диму зберігає капілярну сітку альвеол та дає до +8-10 років до тривалості життя."
    },
    liver: {
      id: "liver",
      name: "Печінка та метаболізм",
      icon: "🥩",
      target: { cx: 98, cy: 170 },
      relevantQuestions: ["sugar", "meat", "fasting", "bmi"],
      defaultDescription: "Центральний орган обміну речовин та детоксикації. Надлишок простих цукрів спричиняє de novo ліпогенез і стеатоз печінки (НАЖХП / MASLD), провокуючи інсулінорезистентність.",
      scienceTip: "Інтервальне харчування та контроль цукру активують аутофагію та знижують навантаження на гепатоцити."
    },
    dna: {
      id: "dna",
      name: "Геном та клітинні теломери",
      icon: "🧬",
      target: { cx: 110, cy: 236 },
      relevantQuestions: ["father_gen", "mother_gen", "age", "sex"],
      defaultDescription: "Генетичний базис довголіття: захисні алелі FOXO3A, сиртуїни (SIRT1-6) та швидкість реплікативного вкорочення теломерних ділянок хромосом під дією запалення.",
      scienceTip: "Генетика визначає близько 20-25% тривалості життя. Решта 75-80% контролюється епігенетичними маркерами способу життя."
    },
    immune: {
      id: "immune",
      name: "Імунна система та соціум",
      icon: "🛡️",
      target: { cx: 110, cy: 92 },
      relevantQuestions: ["social", "stress"],
      defaultDescription: "Лімфоїдні органи та баланс цитокінів. Соціальна ізоляція активує прозапальну генну програму CTRA (підвищуючи IL-6 і TNF-alpha), тоді як соціальна інтеграція буферизує стрес.",
      scienceTip: "Міцні довірливі стосунки та соціальна взаємодія знижують ризик смертності так само потужно, як і регулярна фізична активність."
    }
  };

  class BiometricScanner {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      this.options = Object.assign({ isQuizMode: false }, options);
      this.activeOrganId = "heart";
      this.answers = {};
      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();
    }

    render() {
      this.container.innerHTML = `
        <div class="scanner-container">
          <div class="scanner-header">
            <div class="scanner-tag">
              <span>🩻</span>
              <span>${this.options.isQuizMode ? "Біосканер телеметрії (Live)" : "Анатомічний біоаудит систем"}</span>
            </div>
            <div class="scanner-live-badge">
              <span class="pulse-dot"></span>
              <span>${this.options.isQuizMode ? "ОНОВЛЕННЯ В РЕАЛЬНОМУ ЧАСІ" : "ПОВНА КАРТА СИМУЛЯЦІЇ"}</span>
            </div>
          </div>

          <div class="scanner-layout">
            <!-- Left: Interactive Body Wireframe Silhouette -->
            <div class="body-silhouette-wrap" id="${this.container.id}-silhouette">
              <div class="scan-line" aria-hidden="true"></div>
              
              <!-- SVG Anatomical Silhouette -->
              <svg viewBox="0 0 220 380" class="body-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Анатомічний сканер тіла">
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
                    <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.1" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.05" />
                  </linearGradient>
                  
                  <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="10" y2="0" stroke="rgba(56, 189, 248, 0.07)" stroke-width="0.5" />
                    <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(56, 189, 248, 0.07)" stroke-width="0.5" />
                  </pattern>

                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- Background Subtle Grid -->
                <rect x="0" y="0" width="220" height="380" fill="url(#gridPattern)" />

                <!-- Human Body Silhouette Path -->
                <g class="body-outline" opacity="0.85">
                  <!-- Head -->
                  <ellipse cx="110" cy="46" rx="20" ry="25" fill="url(#bodyGrad)" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,2" />
                  
                  <!-- Neck -->
                  <path d="M102,69 L102,80 L118,80 L118,69 Z" fill="url(#bodyGrad)" stroke="#38bdf8" stroke-width="1" />
                  
                  <!-- Torso & Shoulders -->
                  <path d="M68,88 Q110,78 152,88 L146,140 Q142,190 138,220 L82,220 Q78,190 74,140 Z" 
                        fill="url(#bodyGrad)" stroke="#38bdf8" stroke-width="1.2" />

                  <!-- Pelvis -->
                  <path d="M82,220 L138,220 L132,252 L88,252 Z" fill="url(#bodyGrad)" stroke="#38bdf8" stroke-width="1" />

                  <!-- Arms -->
                  <!-- Left Arm -->
                  <path d="M68,88 L52,140 L44,200 L52,204 L60,150 L72,96 Z" fill="url(#bodyGrad)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="0.8" />
                  <!-- Right Arm -->
                  <path d="M152,88 L168,140 L176,200 L168,204 L160,150 L148,96 Z" fill="url(#bodyGrad)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="0.8" />

                  <!-- Legs -->
                  <!-- Left Leg -->
                  <path d="M88,252 L84,310 L80,365 L94,365 L98,310 L104,252 Z" fill="url(#bodyGrad)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="0.8" />
                  <!-- Right Leg -->
                  <path d="M132,252 L136,310 L140,365 L126,365 L122,310 L116,252 Z" fill="url(#bodyGrad)" stroke="rgba(56, 189, 248, 0.5)" stroke-width="0.8" />

                  <!-- Internal Wireframe Axis & Rib Guide -->
                  <line x1="110" y1="80" x2="110" y2="252" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" stroke-dasharray="2,3" />
                  <path d="M88,116 Q110,126 132,116" stroke="rgba(56, 189, 248, 0.2)" fill="none" stroke-width="1" />
                  <path d="M86,134 Q110,144 134,134" stroke="rgba(56, 189, 248, 0.2)" fill="none" stroke-width="1" />
                  <path d="M88,152 Q110,162 132,152" stroke="rgba(56, 189, 248, 0.2)" fill="none" stroke-width="1" />
                </g>

                <!-- Organ Target Hotspots -->
                <g class="organ-hotspots">
                  <!-- Brain -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-brain" data-organ="brain" tabindex="0" role="button" aria-label="Головний мозок">
                    <circle class="target-glow" cx="110" cy="46" r="14" fill="#38bdf8" fill-opacity="0.15" />
                    <circle class="target-ring" cx="110" cy="46" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" />
                    <circle class="target-core" cx="110" cy="46" r="4.5" fill="#38bdf8" />
                  </g>

                  <!-- Immune / Thymus -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-immune" data-organ="immune" tabindex="0" role="button" aria-label="Імунна система">
                    <circle class="target-glow" cx="110" cy="94" r="12" fill="#38bdf8" fill-opacity="0.15" />
                    <circle class="target-ring" cx="110" cy="94" r="8" fill="none" stroke="#38bdf8" stroke-width="1.2" />
                    <circle class="target-core" cx="110" cy="94" r="3.5" fill="#38bdf8" />
                  </g>

                  <!-- Lungs -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-lungs" data-organ="lungs" tabindex="0" role="button" aria-label="Легені">
                    <circle class="target-glow" cx="95" cy="124" r="13" fill="#38bdf8" fill-opacity="0.15" />
                    <circle class="target-ring" cx="95" cy="124" r="9" fill="none" stroke="#38bdf8" stroke-width="1.2" />
                    <circle class="target-core" cx="95" cy="124" r="4" fill="#38bdf8" />
                    <!-- Right lung echo -->
                    <circle cx="125" cy="124" r="4" fill="#38bdf8" opacity="0.6" />
                  </g>

                  <!-- Heart -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-heart" data-organ="heart" tabindex="0" role="button" aria-label="Серце">
                    <circle class="target-glow" cx="122" cy="130" r="15" fill="#38bdf8" fill-opacity="0.2" />
                    <circle class="target-ring" cx="122" cy="130" r="11" fill="none" stroke="#38bdf8" stroke-width="1.5" />
                    <circle class="target-core" cx="122" cy="130" r="5" fill="#38bdf8" />
                  </g>

                  <!-- Liver & Metabolism -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-liver" data-organ="liver" tabindex="0" role="button" aria-label="Печінка та метаболізм">
                    <circle class="target-glow" cx="98" cy="170" r="14" fill="#38bdf8" fill-opacity="0.15" />
                    <circle class="target-ring" cx="98" cy="170" r="10" fill="none" stroke="#38bdf8" stroke-width="1.3" />
                    <circle class="target-core" cx="98" cy="170" r="4.5" fill="#38bdf8" />
                  </g>

                  <!-- DNA & Cellular Telomeres -->
                  <g class="organ-node status-neutral" id="${this.container.id}-node-dna" data-organ="dna" tabindex="0" role="button" aria-label="ДНК та генетичні теломери">
                    <circle class="target-glow" cx="110" cy="236" r="14" fill="#38bdf8" fill-opacity="0.15" />
                    <circle class="target-ring" cx="110" cy="236" r="10" fill="none" stroke="#38bdf8" stroke-width="1.3" />
                    <circle class="target-core" cx="110" cy="236" r="4.5" fill="#38bdf8" />
                  </g>
                </g>
              </svg>
            </div>

            <!-- Right: Dynamic Organ Inspector Details Panel -->
            <div class="organ-inspector" id="${this.container.id}-inspector">
              <div class="organ-inspector-header">
                <div class="organ-inspector-title" id="${this.container.id}-insp-title">
                  <span id="${this.container.id}-insp-icon">🫀</span>
                  <span id="${this.container.id}-insp-name">Серцево-судинна система</span>
                </div>
                <div class="organ-status-badge neutral" id="${this.container.id}-insp-badge">
                  0.0 р. (Базис)
                </div>
              </div>

              <div class="organ-desc" id="${this.container.id}-insp-desc">
                Завантаження фізіологічного профілю...
              </div>

              <!-- List of factors affecting this organ -->
              <div class="organ-factors-container">
                <div class="organ-factors-label" style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
                  Вплив ваших відповідей на цей орган:
                </div>
                <div class="organ-factors-list" id="${this.container.id}-insp-factors">
                  <!-- Factors injected dynamically -->
                </div>
              </div>

              <!-- Recommendation / Scientific Tip -->
              <div class="organ-tip-box" id="${this.container.id}-insp-tip" style="background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 11.5px; color: var(--accent-cyan); line-height: 1.45; margin-top: 10px;">
                💡 <strong>Порада:</strong> Заповнюйте анкету, щоб побачити точну декомпозицію факторів ризику.
              </div>

              <!-- Quick organ selector buttons for mobile and touch -->
              <div class="organ-pills-nav" id="${this.container.id}-pills">
                <button type="button" class="organ-pill-btn active" data-organ="heart">🫀 Серце</button>
                <button type="button" class="organ-pill-btn" data-organ="brain">🧠 Мозок</button>
                <button type="button" class="organ-pill-btn" data-organ="lungs">🫁 Легені</button>
                <button type="button" class="organ-pill-btn" data-organ="liver">🥩 Печінка</button>
                <button type="button" class="organ-pill-btn" data-organ="dna">🧬 ДНК</button>
                <button type="button" class="organ-pill-btn" data-organ="immune">🛡️ Імунітет</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.updateInspector();
    }

    bindEvents() {
      // SVG nodes click
      const nodes = this.container.querySelectorAll(".organ-node");
      nodes.forEach((node) => {
        const organId = node.getAttribute("data-organ");
        node.addEventListener("click", () => this.selectOrgan(organId));
        node.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.selectOrgan(organId);
          }
        });
      });

      // Quick Selector Pills click
      const pills = this.container.querySelectorAll(".organ-pill-btn");
      pills.forEach((pill) => {
        const organId = pill.getAttribute("data-organ");
        pill.addEventListener("click", () => this.selectOrgan(organId));
      });
    }

    selectOrgan(organId) {
      if (!ORGAN_DEFINITIONS[organId]) return;
      this.activeOrganId = organId;

      // Update active state on SVG nodes
      const nodes = this.container.querySelectorAll(".organ-node");
      nodes.forEach((n) => {
        n.classList.toggle("active", n.getAttribute("data-organ") === organId);
      });

      // Update active state on pills
      const pills = this.container.querySelectorAll(".organ-pill-btn");
      pills.forEach((p) => {
        p.classList.toggle("active", p.getAttribute("data-organ") === organId);
      });

      this.updateInspector();
    }

    update(answers = {}) {
      this.answers = answers;
      this.updateNodesStatus();
      this.updateInspector();
    }

    // Calculate delta and status for a specific organ
    getOrganStats(organId) {
      const def = ORGAN_DEFINITIONS[organId];
      if (!def) return { delta: 0, factors: [], status: "neutral" };

      let organDelta = 0;
      const factors = [];

      def.relevantQuestions.forEach((qId) => {
        const ans = this.answers[qId];
        if (ans && ans.d !== undefined) {
          organDelta += ans.d;
          factors.push({
            qId: qId,
            title: ans.questionTitle || qId,
            option: ans.label || ans.t,
            delta: ans.d,
            studies: ans.studies,
            explanation: ans.explanation
          });
        }
      });

      organDelta = +organDelta.toFixed(1);

      let status = "neutral";
      if (organDelta > 0) status = "pos";
      else if (organDelta < 0) status = "neg";

      return {
        delta: organDelta,
        factors: factors,
        status: status,
        totalRelevant: def.relevantQuestions.length,
        answeredCount: factors.length
      };
    }

    updateNodesStatus() {
      for (const organId in ORGAN_DEFINITIONS) {
        const node = document.getElementById(`${this.container.id}-node-${organId}`);
        if (!node) continue;

        const stats = this.getOrganStats(organId);

        node.classList.remove("status-pos", "status-neg", "status-neutral");
        node.classList.add(`status-${stats.status}`);
      }
    }

    updateInspector() {
      const def = ORGAN_DEFINITIONS[this.activeOrganId];
      if (!def) return;

      const stats = this.getOrganStats(this.activeOrganId);

      const elTitle = document.getElementById(`${this.container.id}-insp-title`);
      const elIcon = document.getElementById(`${this.container.id}-insp-icon`);
      const elName = document.getElementById(`${this.container.id}-insp-name`);
      const elBadge = document.getElementById(`${this.container.id}-insp-badge`);
      const elDesc = document.getElementById(`${this.container.id}-insp-desc`);
      const elFactors = document.getElementById(`${this.container.id}-insp-factors`);
      const elTip = document.getElementById(`${this.container.id}-insp-tip`);

      if (elIcon) elIcon.textContent = def.icon;
      if (elName) elName.textContent = def.name;
      if (elDesc) elDesc.textContent = def.defaultDescription;

      // Status badge
      if (elBadge) {
        elBadge.className = `organ-status-badge ${stats.status}`;
        const sign = stats.delta > 0 ? "+" : "";
        let statusLabel = "Нейтральний стан";
        if (stats.delta > 0) statusLabel = "Захищений стан";
        if (stats.delta < 0) statusLabel = "Підвищений ризик";

        elBadge.textContent = `${sign}${stats.delta} р. (${statusLabel})`;
      }

      // Tip / Science advice
      if (elTip) {
        elTip.innerHTML = `💡 <strong>Рекомендація:</strong> ${def.scienceTip}`;
      }

      // Factors List
      if (elFactors) {
        elFactors.innerHTML = "";

        if (stats.factors.length === 0) {
          elFactors.innerHTML = `
            <div style="font-size: 11.5px; color: var(--text-muted); font-style: italic; padding: 6px 0;">
              Питання для цього органу (${stats.totalRelevant} шт.) ще не пройдені або дані очікують вводу...
            </div>
          `;
        } else {
          stats.factors.forEach((f) => {
            const row = document.createElement("div");
            const factorClass = f.delta > 0 ? "pos" : f.delta < 0 ? "neg" : "zero";
            const sign = f.delta > 0 ? "+" : "";
            row.className = `organ-factor-item ${factorClass}`;

            row.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 2px; max-width: 72%;">
                <div style="font-weight: 600; color: #ffffff; line-height: 1.25;">${f.option}</div>
                <div style="font-size: 10px; color: var(--text-muted);">${f.title}</div>
              </div>
              <div style="text-align: right;">
                <div class="organ-factor-val ${f.delta > 0 ? "text-emerald" : f.delta < 0 ? "text-rose" : ""}" style="font-size: 12px;">
                  ${sign}${f.delta} р.
                </div>
                ${f.studies && f.studies[0] ? `
                  <a href="${f.studies[0].link}" target="_blank" rel="noopener noreferrer" style="font-size: 9.5px; color: var(--accent-cyan); text-decoration: none; display: inline-flex; align-items: center; gap: 2px;">
                    Дослідження ↗
                  </a>
                ` : ""}
              </div>
            `;
            elFactors.appendChild(row);
          });
        }
      }
    }
  }

  // Export to global scope
  window.BiometricScanner = BiometricScanner;
})();
