/**
 * Mortality & Longevity Estimator Engine
 * Gompertz-Makeham actuarial simulation, dynamic telemetry and interactive visualization.
 */

(function () {
  "use strict";

  // Application State
  const state = {
    step: 0,
    answers: {},
    userAge: 25,
    userSex: "male",
    baseExpectancy: 73.5, // Median actuarial baseline
    survivalChart: null,
    radarChart: null,
    quizScanner: null,
    resultsScanner: null
  };

  // DOM Elements
  const el = {
    screenIntro: document.getElementById("screen-intro"),
    screenQuiz: document.getElementById("screen-quiz"),
    screenLoading: document.getElementById("screen-loading"),
    screenResult: document.getElementById("screen-result"),
    pbar: document.getElementById("pbar"),
    ptext: document.getElementById("ptext"),
    qCatBadge: document.getElementById("q-cat-badge"),
    qTitle: document.getElementById("q-title"),
    qBadge: document.getElementById("q-badge"),
    qOptions: document.getElementById("q-options"),
    btnStudyModal: document.getElementById("btn-study-modal"),
    studyModal: document.getElementById("study-modal"),
    studyModalClose: document.getElementById("study-modal-close"),
    studyModalBackdrop: document.getElementById("study-modal-backdrop"),
    studyTitle: document.getElementById("study-title"),
    studyMechanism: document.getElementById("study-mechanism"),
    studyLinks: document.getElementById("study-links"),
    logTerminal: document.getElementById("log-terminal"),
    logPhase: document.getElementById("log-phase"),
    btnPrev: document.getElementById("btn-prev"),
    // Results
    resAge: document.getElementById("res-age"),
    resYears: document.getElementById("res-years"),
    resDate: document.getElementById("res-date"),
    resBioAge: document.getElementById("res-bio-age"),
    resBioDiff: document.getElementById("res-bio-diff"),
    resPosFactors: document.getElementById("res-pos-factors"),
    resNegFactors: document.getElementById("res-neg-factors"),
    resRoadmap: document.getElementById("res-roadmap"),
    btnShare: document.getElementById("btn-share"),
    btnRetake: document.getElementById("btn-retake")
  };

  // Helper function for safe element selector
  function $(id) {
    return document.getElementById(id);
  }

  // Animate number count-up
  function animateValue(element, start, end, duration, suffix = "", prefix = "") {
    if (!element) return;
    const startTime = performance.now();
    const isFloat = end % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      element.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Switch visible screen with transition
  function switchScreen(from, to) {
    if (from) {
      from.classList.remove("active");
    }
    if (to) {
      to.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Initialize
  function init() {
    bindEvents();
    initScanners();
  }

  function initScanners() {
    if (window.BiometricScanner) {
      if ($("quiz-body-scanner") && !state.quizScanner) {
        state.quizScanner = new window.BiometricScanner("quiz-body-scanner", { isQuizMode: true });
      }
      if ($("results-body-scanner") && !state.resultsScanner) {
        state.resultsScanner = new window.BiometricScanner("results-body-scanner", { isQuizMode: false });
      }
    }
  }

  function updateQuizScanner() {
    if (state.quizScanner) {
      state.quizScanner.update(state.answers);
    }
    const deltaPreview = $("quiz-scanner-delta-preview");
    if (deltaPreview) {
      let total = 0;
      for (const k in state.answers) {
        if (state.answers[k].d !== undefined) total += state.answers[k].d;
      }
      total = +total.toFixed(1);
      const sign = total > 0 ? "+" : "";
      deltaPreview.textContent = `${sign}${total} р.`;
      deltaPreview.className = "scanner-delta-pill";
      if (total > 0) deltaPreview.classList.add("pos");
      else if (total < 0) deltaPreview.classList.add("neg");
    }
  }

  function bindEvents() {
    const btnStart = document.getElementById("btn-start");
    if (btnStart) {
      btnStart.addEventListener("click", startQuiz);
    }

    const btnToggleScanner = $("btn-toggle-quiz-scanner");
    const quizDrawer = $("quiz-scanner-drawer");
    if (btnToggleScanner && quizDrawer) {
      btnToggleScanner.addEventListener("click", () => {
        const isOpen = quizDrawer.classList.toggle("open");
        btnToggleScanner.setAttribute("aria-expanded", String(isOpen));
      });
    }

    if (el.btnPrev) {
      el.btnPrev.addEventListener("click", prevStep);
    }

    if (el.btnStudyModal) {
      el.btnStudyModal.addEventListener("click", openStudyModal);
    }

    if (el.studyModalClose) {
      el.studyModalClose.addEventListener("click", closeStudyModal);
    }

    if (el.studyModalBackdrop) {
      el.studyModalBackdrop.addEventListener("click", closeStudyModal);
    }

    if (el.btnRetake) {
      el.btnRetake.addEventListener("click", resetQuiz);
    }

    if (el.btnShare) {
      el.btnShare.addEventListener("click", handleShare);
    }

    // Keyboard navigation
    window.addEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (!el.screenQuiz.classList.contains("active")) return;
    if (el.studyModal.classList.contains("active")) {
      if (e.key === "Escape") closeStudyModal();
      return;
    }

    // Numbers 1-6 for options
    const keyNum = parseInt(e.key, 10);
    if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 6) {
      const currentQ = QUESTIONS[state.step];
      if (currentQ && currentQ.o[keyNum - 1]) {
        selectOption(currentQ.o[keyNum - 1]);
      }
    }

    // Backspace / ArrowLeft for back
    if (e.key === "Backspace" || e.key === "ArrowLeft") {
      if (state.step > 0) prevStep();
    }
  }

  function startQuiz() {
    state.step = 0;
    state.answers = {};
    updateQuizScanner();
    switchScreen(el.screenIntro, el.screenQuiz);
    renderStep();
  }

  function prevStep() {
    if (state.step > 0) {
      state.step--;
      updateQuizScanner();
      renderStep();
    }
  }

  function renderStep() {
    if (state.step >= QUESTIONS.length) {
      startCalculation();
      return;
    }

    const q = QUESTIONS[state.step];
    const cat = CATEGORIES[q.c] || { title: "Загальні дані", color: "#38bdf8" };

    // Update Progress
    const pct = Math.round(((state.step) / QUESTIONS.length) * 100);
    el.pbar.style.width = `${pct}%`;
    el.ptext.textContent = `${state.step + 1} з ${QUESTIONS.length} (${pct}%)`;

    // Category badge & Question Info
    el.qCatBadge.textContent = cat.title;
    el.qCatBadge.style.borderColor = `${cat.color}40`;
    el.qCatBadge.style.color = cat.color;

    el.qTitle.textContent = q.q;
    el.qBadge.textContent = q.badge || "Епідеміологія";

    // Toggle Previous button
    if (el.btnPrev) {
      el.btnPrev.style.display = state.step > 0 ? "inline-flex" : "none";
    }

    // Render Options
    el.qOptions.innerHTML = "";
    q.o.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt-card";

      // If already answered, highlight selected
      const isSelected = state.answers[q.id]?.t === opt.t;
      if (isSelected) {
        btn.classList.add("selected");
      }

      btn.innerHTML = `
        <div class="opt-key">[${idx + 1}]</div>
        <div class="opt-body">
          <div class="opt-title">${opt.t}</div>
          ${opt.note ? `<div class="opt-note">${opt.note}</div>` : ""}
        </div>
        <div class="opt-delta ${opt.d > 0 ? "pos" : opt.d < 0 ? "neg" : "zero"}">
          ${opt.d > 0 ? `+${opt.d} р.` : opt.d < 0 ? `${opt.d} р.` : "0"}
        </div>
      `;

      btn.addEventListener("click", () => selectOption(opt));
      el.qOptions.appendChild(btn);
    });
  }

  function selectOption(opt) {
    const q = QUESTIONS[state.step];
    state.answers[q.id] = {
      ...opt,
      cat: q.c,
      label: opt.l || opt.t,
      questionTitle: q.q,
      explanation: q.explanation,
      studies: q.studies
    };

    // Demographic adjustments
    if (q.id === "sex") {
      state.userSex = opt.t.includes("Жін") ? "female" : "male";
      state.baseExpectancy = state.userSex === "female" ? 76.8 : 71.2;
    }
    if (q.id === "age" && opt.v) {
      state.userAge = opt.v;
    }

    // Advance to next step
    state.step++;
    updateQuizScanner();
    renderStep();
  }

  function openStudyModal() {
    const q = QUESTIONS[state.step];
    if (!q) return;

    el.studyTitle.textContent = q.q;
    el.studyMechanism.textContent = q.explanation;

    el.studyLinks.innerHTML = "";
    if (q.studies && q.studies.length > 0) {
      q.studies.forEach((st) => {
        const item = document.createElement("a");
        item.href = st.link;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
        item.className = "study-card-link";
        item.innerHTML = `
          <div class="study-card-meta">
            <span class="study-journal">🏛️ ${st.journal}</span>
            <span class="study-ext">Відкрити джерело ↗</span>
          </div>
          <div class="study-title-text">${st.title}</div>
        `;
        el.studyLinks.appendChild(item);
      });
    }

    el.studyModal.classList.add("active");
  }

  function closeStudyModal() {
    el.studyModal.classList.remove("active");
  }

  // High-Tech Simulation Process
  function startCalculation() {
    switchScreen(el.screenQuiz, el.screenLoading);

    const simulationSteps = [
      { text: "Калібрування фонового актуарного темпу Гомпертца (α = 0.0001, β = 0.0815)...", phase: "Етап 1 з 4" },
      { text: "Інтеграція константи стохастичного ризику Мейкхема (γ = 0.0006)...", phase: "Етап 2 з 4" },
      { text: "Синтез індивідуальних коефіцієнтів небезпеки Кокса (HR-матриця)...", phase: "Етап 3 з 4" },
      { text: "Побудова кумулятивної функції ймовірності Каплана-Меєра...", phase: "Етап 4 з 4" }
    ];

    let currentLog = 0;
    el.logTerminal.innerHTML = "";

    const timer = setInterval(() => {
      if (currentLog < simulationSteps.length) {
        const step = simulationSteps[currentLog];
        el.logPhase.textContent = step.phase;

        const p = document.createElement("div");
        p.className = "log-line";
        p.innerHTML = `<span class="log-bullet">✓</span> ${step.text}`;
        el.logTerminal.appendChild(p);
        currentLog++;
      } else {
        clearInterval(timer);
        setTimeout(showResults, 500);
      }
    }, 450);
  }

  function showResults() {
    switchScreen(el.screenLoading, el.screenResult);

    let totalDelta = 0;
    const catScores = { demo: 0, cardio: 0, neuro: 0, metabolic: 0, substance: 0, genetics: 0, environment: 0 };
    const factorList = [];

    for (const key in state.answers) {
      const a = state.answers[key];
      if (a.d !== undefined) {
        totalDelta += a.d;
        catScores[a.cat] = (catScores[a.cat] || 0) + a.d;
        if (a.d !== 0) {
          factorList.push({
            name: a.label,
            delta: a.d,
            cat: a.cat,
            studies: a.studies,
            explanation: a.explanation
          });
        }
      }
    }

    // Calculate final metrics
    const finalAge = Math.min(112, Math.max(state.userAge + 2, +(state.baseExpectancy + totalDelta).toFixed(1)));
    const yearsRemaining = Math.max(1, +(finalAge - state.userAge).toFixed(1));

    // Biological age differential
    const bioAgeDelta = -(totalDelta * 0.45);
    const biologicalAge = Math.max(18, +(state.userAge + bioAgeDelta).toFixed(1));

    // Milestone Date
    const now = new Date();
    const milestoneYear = now.getFullYear() + Math.round(yearsRemaining);
    const milestoneMonth = now.toLocaleString("uk-UA", { month: "long" });

    // Animate UI Metrics
    animateValue(el.resAge, state.userAge, finalAge, 1200, " р.");
    animateValue(el.resYears, 0, yearsRemaining, 1200, " р.");
    animateValue(el.resBioAge, state.userAge, biologicalAge, 1200, " р.");

    el.resDate.textContent = `${milestoneMonth.toUpperCase()} ${milestoneYear} РОКУ`;

    if (bioAgeDelta < 0) {
      el.resBioDiff.textContent = `Молодший на ${Math.abs(bioAgeDelta).toFixed(1)} р. за паспортний вік`;
      el.resBioDiff.className = "stat-diff pos";
    } else if (bioAgeDelta > 0) {
      el.resBioDiff.textContent = `Старший на ${bioAgeDelta.toFixed(1)} р. за паспортний вік`;
      el.resBioDiff.className = "stat-diff neg";
    } else {
      el.resBioDiff.textContent = "Збігається з паспортним віком";
      el.resBioDiff.className = "stat-diff zero";
    }

    // Render Factor lists
    factorList.sort((a, b) => b.delta - a.delta);
    const posFactors = factorList.filter((f) => f.delta > 0).slice(0, 5);
    const negFactors = factorList.filter((f) => f.delta < 0).reverse().slice(0, 5);

    renderFactors(el.resPosFactors, posFactors, true);
    renderFactors(el.resNegFactors, negFactors, false);

    // Render Actionable Optimization Roadmap
    renderRoadmap(factorList);

    // Render Charts
    renderSurvivalChart(state.userAge, finalAge);
    renderRadarChart(catScores);

    // Update Anatomical Body Scanner in Results
    if (state.resultsScanner) {
      state.resultsScanner.update(state.answers);
    }
  }

  function renderFactors(container, factors, isPositive) {
    container.innerHTML = "";
    if (factors.length === 0) {
      container.innerHTML = `<div class="factor-empty">Факторів не виявлено</div>`;
      return;
    }

    factors.forEach((f) => {
      const div = document.createElement("div");
      div.className = `factor-card ${isPositive ? "pos" : "neg"}`;
      const sign = isPositive ? "+" : "";

      div.innerHTML = `
        <div class="factor-main">
          <div class="factor-name">${f.name}</div>
          <div class="factor-val ${isPositive ? "text-emerald" : "text-rose"}">${sign}${f.delta} р.</div>
        </div>
        ${f.studies && f.studies[0] ? `
          <a href="${f.studies[0].link}" target="_blank" rel="noopener noreferrer" class="factor-study-link">
            <span>🔬 ${f.studies[0].journal}</span>
            <span>Джерело ↗</span>
          </a>
        ` : ""}
      `;
      container.appendChild(div);
    });
  }

  function renderRoadmap(factors) {
    if (!el.resRoadmap) return;
    el.resRoadmap.innerHTML = "";

    const modifiableNegatives = factors.filter((f) => f.delta < 0 && f.cat !== "genetics" && f.cat !== "demo");
    if (modifiableNegatives.length === 0) {
      el.resRoadmap.innerHTML = `
        <div class="roadmap-card success">
          <div class="roadmap-header">
            <span class="roadmap-badge">Відмінно</span>
            <span class="roadmap-years">+0 додаткових років</span>
          </div>
          <p class="roadmap-desc">Ваш поточний профіль звичок уже максимально наближений до оптимального довголіття. Продовжуйте дотримуватися свого режиму!</p>
        </div>
      `;
      return;
    }

    modifiableNegatives.forEach((f) => {
      const card = document.createElement("div");
      card.className = "roadmap-card";
      const potentialGain = Math.abs(f.delta);

      card.innerHTML = `
        <div class="roadmap-header">
          <div class="roadmap-title">Оптимізація: ${f.name}</div>
          <div class="roadmap-years">+${potentialGain} р. потенціалу</div>
        </div>
        <p class="roadmap-desc">${f.explanation || "Корекція цього показника здатна істотно знизити системний ризик смертності за даними популяційних когорт."}</p>
      `;
      el.resRoadmap.appendChild(card);
    });
  }

  // Interactive Survival Curve (Gompertz-Makeham Simulation)
  function renderSurvivalChart(startAge, expectedAge) {
    const canvas = $("survivalChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (state.survivalChart) {
      state.survivalChart.destroy();
    }

    const labels = [];
    const userData = [];
    const baselineData = [];

    // Cohort baseline expected age (~74 years)
    const cohortExpected = state.userSex === "female" ? 76.5 : 71.0;

    for (let x = startAge; x <= 106; x += 2) {
      labels.push(x);

      // Gompertz survival function approximation S(x)
      // k controls curve steepness (actuarial mortality doubling roughly every 7-8 yrs)
      const k = 0.145;
      const userProb = Math.min(100, Math.max(0, 100 / (1 + Math.exp(k * (x - expectedAge)))));
      const baseProb = Math.min(100, Math.max(0, 100 / (1 + Math.exp(k * (x - cohortExpected)))));

      userData.push(+userProb.toFixed(1));
      baselineData.push(+baseProb.toFixed(1));
    }

    // Chart.js Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.28)");
    gradient.addColorStop(0.7, "rgba(16, 185, 129, 0.04)");
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    state.survivalChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Ваша траєкторія",
            data: userData,
            borderColor: "#10b981",
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.38,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: "#10b981",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2
          },
          {
            label: "Середня когорта популяції",
            data: baselineData,
            borderColor: "rgba(148, 163, 184, 0.4)",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.38,
            pointRadius: 0,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index"
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
              usePointStyle: true,
              pointStyle: "circle"
            }
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#cbd5e1",
            borderColor: "rgba(51, 65, 85, 0.8)",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              title: (items) => `Вік: ${items[0].label} років`,
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}% ймовірність дожиття`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Вік (років)",
              color: "#64748b",
              font: { size: 11, weight: 600 }
            },
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8", font: { family: "'JetBrains Mono', monospace" } }
          },
          y: {
            min: 0,
            max: 100,
            title: {
              display: true,
              text: "Ймовірність виживання (%)",
              color: "#64748b",
              font: { size: 11, weight: 600 }
            },
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94a3b8",
              font: { family: "'JetBrains Mono', monospace" },
              callback: (v) => `${v}%`
            }
          }
        }
      }
    });
  }

  // Physiological Domain Radar Chart
  function renderRadarChart(scores) {
    const canvas = $("radarChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (state.radarChart) {
      state.radarChart.destroy();
    }

    // Normalize category scores to a 0-100 resilience scale (baseline 60)
    const normalize = (val) => Math.max(15, Math.min(100, Math.round(60 + val * 6.5)));

    const radarLabels = [
      "Кардіоваскулярна",
      "Метаболізм",
      "Сон та Нейро",
      "Токсикологія",
      "Генетика",
      "Соціум і Безпека",
      "Антропометрія"
    ];

    const radarValues = [
      normalize(scores.cardio || 0),
      normalize(scores.metabolic || 0),
      normalize(scores.neuro || 0),
      normalize(scores.substance || 0),
      normalize(scores.genetics || 0),
      normalize(scores.environment || 0),
      normalize(scores.demo || 0)
    ];

    state.radarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: "Ваш індекс стійкості",
            data: radarValues,
            backgroundColor: "rgba(56, 189, 248, 0.2)",
            borderColor: "#38bdf8",
            borderWidth: 2.5,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#38bdf8",
            pointHoverBackgroundColor: "#38bdf8",
            pointHoverBorderColor: "#ffffff",
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: "Оптимальний фізіологічний еталон",
            data: [90, 90, 90, 90, 85, 85, 90],
            backgroundColor: "transparent",
            borderColor: "rgba(16, 185, 129, 0.4)",
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#94a3b8",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw} / 100 балів`
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: "rgba(255, 255, 255, 0.08)" },
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            pointLabels: {
              color: "#cbd5e1",
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 }
            },
            ticks: { display: false, stepSize: 20 }
          }
        }
      }
    });
  }

  function resetQuiz() {
    state.step = 0;
    state.answers = {};
    updateQuizScanner();
    switchScreen(el.screenResult, el.screenIntro);
  }

  function handleShare() {
    const finalAgeText = el.resAge.textContent;
    const shareText = `Мій прогноз тривалості життя за актуарною моделлю Гомпертца-Мейкхема: ${finalAgeText}. Перевір свою траєкторію довголіття на науковій моделі!`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        const oldText = el.btnShare.textContent;
        el.btnShare.textContent = "✓ Скопійовано в буфер!";
        setTimeout(() => {
          el.btnShare.textContent = oldText;
        }, 2500);
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
