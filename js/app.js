/**
 * BioTelemetry Actuarial & Longevity Engine v3.0
 * Modular 8-system architecture, Cox HR diminishing returns formula,
 * Schizotypal & psychological profile evaluation, and multilingual support.
 */

(function () {
  "use strict";

  const state = {
    currentSystem: "circulatory",
    currentQuestionIndex: 0,
    answers: {},
    userAge: 25,
    userSex: "male",
    baseExpectancy: 74.0,
    quizCockpit: null,
    resultsCockpit: null,
    survivalChart: null,
    radarChart: null,
    mentalChart: null
  };

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
    qSimpleHint: document.getElementById("q-simple-hint"),
    qSimpleText: document.getElementById("q-simple-text"),
    qAgePickerWrap: document.getElementById("q-age-picker-wrap"),
    inputQAge: document.getElementById("input-q-age"),
    btnQAgeDec: document.getElementById("btn-q-age-dec"),
    btnQAgeInc: document.getElementById("btn-q-age-inc"),
    heroAgeInput: document.getElementById("hero-age-input"),
    btnHeroAgeDec: document.getElementById("btn-hero-age-dec"),
    btnHeroAgeInc: document.getElementById("btn-hero-age-inc"),
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
    btnNext: document.getElementById("btn-next"),
    btnFinishEarly: document.getElementById("btn-finish-early"),
    // Results DOM
    resAge: document.getElementById("res-age"),
    resYears: document.getElementById("res-years"),
    resDate: document.getElementById("res-date"),
    resBioAge: document.getElementById("res-bio-age"),
    resBioDiff: document.getElementById("res-bio-diff"),
    resConfidenceInterval: document.getElementById("res-ci-interval"),
    resPosFactors: document.getElementById("res-pos-factors"),
    resNegFactors: document.getElementById("res-neg-factors"),
    resRoadmap: document.getElementById("res-roadmap"),
    resMentalAnalysis: document.getElementById("res-mental-analysis"),
    btnShare: document.getElementById("btn-share"),
    btnRetake: document.getElementById("btn-retake")
  };

  function $(id) {
    return document.getElementById(id);
  }

  function getLang() {
    return window.I18N ? window.I18N.currentLang : "uk";
  }

  function t(path) {
    return window.I18N ? window.I18N.get(path) : path;
  }

  // Actuarial logarithmic diminishing returns calibration
  function calculateCalibratedLifespan(baseExpectancy, rawDelta) {
    const MAX_POS_GAIN = 16.5; // Top 0.1% biological limit (~91-96 yrs)
    const MAX_NEG_LOSS = 23.0; // Severe multi-morbidity lower limit (~51-55 yrs)

    let netDelta = 0;
    if (rawDelta > 0) {
      netDelta = MAX_POS_GAIN * (1 - Math.exp(-rawDelta / (MAX_POS_GAIN * 1.15)));
    } else if (rawDelta < 0) {
      const absRaw = Math.abs(rawDelta);
      netDelta = -MAX_NEG_LOSS * (1 - Math.exp(-absRaw / (MAX_NEG_LOSS * 1.1)));
    }
    return +(baseExpectancy + netDelta).toFixed(1);
  }

  function setAge(newAge, fromInput = false, activeInput = null) {
    const parsed = parseInt(newAge, 10);
    if (isNaN(parsed)) return;

    const age = Math.max(14, Math.min(100, parsed));
    state.userAge = age;

    // Only update input fields that the user is not actively typing in!
    if (el.heroAgeInput && el.heroAgeInput !== activeInput && parseInt(el.heroAgeInput.value, 10) !== age) {
      el.heroAgeInput.value = age;
    }
    if (el.inputQAge && el.inputQAge !== activeInput && parseInt(el.inputQAge.value, 10) !== age) {
      el.inputQAge.value = age;
    }

    const currentQ = getCurrentQuestion();
    if (currentQ && currentQ.id === "age") {
      const match = findAgeOption(currentQ.o, age);

      state.answers["age"] = {
        ...match,
        qId: "age",
        system: "circulatory",
        questionTitle: currentQ.q,
        explanation: currentQ.explanation,
        studies: currentQ.studies
      };
      if (fromInput) {
        updateAgeOptionSelection(currentQ);
      }
    }
  }

  // Strict range-based age option lookup using minAge/maxAge from data
  function findAgeOption(options, age) {
    return options.find((o) => age >= o.minAge && age <= o.maxAge) || options[0];
  }

  function updateAgeOptionSelection(q) {
    if (!el.qOptions) return;
    const buttons = el.qOptions.querySelectorAll(".opt-card");
    const matchingOpt = findAgeOption(q.o, state.userAge);
    q.o.forEach((opt, idx) => {
      const btn = buttons[idx];
      if (!btn) return;
      btn.classList.toggle("selected", opt === matchingOpt);
    });
  }

  function getUnitSuffix(val, lang) {
    if (lang === "en") return " yrs";
    if (lang === "uk") return " р.";
    // Russian grammatical declension
    const isFloat = val % 1 !== 0;
    if (isFloat) return " года";
    const abs = Math.abs(Math.round(val));
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod100 >= 11 && mod100 <= 19) return " лет";
    if (mod10 === 1) return " год";
    if (mod10 >= 2 && mod10 <= 4) return " года";
    return " лет";
  }

  function animateValue(element, start, end, duration, suffix = "", prefix = "") {
    if (!element) return;
    const startTime = performance.now();
    const isFloat = end % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      element.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function switchScreen(from, to) {
    if (from) from.classList.remove("active");
    if (to) {
      to.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function init() {
    bindEvents();
    initCockpits();
    applyLanguage();

    // Listen for language switch
    window.addEventListener("bio:lang-changed", () => {
      applyLanguage();
    });
  }

  function initCockpits() {
    if (window.BioTelemetryCockpit) {
      if ($("quiz-body-cockpit") && !state.quizCockpit) {
        state.quizCockpit = new window.BioTelemetryCockpit("quiz-body-cockpit", {
          isQuizMode: true,
          onSystemSelect: (sysId) => {
            selectSystemModule(sysId);
          }
        });
      }
      if ($("results-body-cockpit") && !state.resultsCockpit) {
        state.resultsCockpit = new window.BioTelemetryCockpit("results-body-cockpit", {
          isQuizMode: false
        });
      }
    }
  }

  function applyLanguage() {
    const lang = getLang();

    // Update document title and meta description
    if (window.I18N) {
      document.title = t("docTitle");
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", t("docDesc"));
    }

    // Update text elements
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });

    // Update HTML elements (like hero title with span)
    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const key = node.getAttribute("data-i18n-html");
      node.innerHTML = t(key);
    });

    // Update language buttons active state
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // Re-render active screens
    if (el.screenQuiz && el.screenQuiz.classList.contains("active")) {
      renderSystemTabs();
      renderCurrentQuestion();
    } else if (el.screenResult && el.screenResult.classList.contains("active")) {
      showResults();
    }
  }

  function bindEvents() {
    // Start button
    const btnStart = $("btn-start");
    if (btnStart) btnStart.addEventListener("click", startQuiz);

    // Age Input Setup — never clamp while user is still typing
    function setupAgeField(input) {
      if (!input) return;

      input.addEventListener("focus", () => {
        input.select();
      });

      // While typing: silently apply if the value is a valid complete age,
      // otherwise do nothing — let the user finish typing
      input.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 14 && val <= 100) {
          setAge(val, true, e.target);
        }
      });

      // Only clamp on blur (user finished editing)
      input.addEventListener("blur", (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 14) val = 14;
        else if (val > 100) val = 100;
        e.target.value = val;
        setAge(val, true, null);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
    }

    setupAgeField(el.heroAgeInput);
    setupAgeField(el.inputQAge);

    // Hold-to-repeat stepper: fires once on press, then accelerates while held
    function setupStepper(btn, stepFn) {
      if (!btn) return;
      let timer = null;
      let accelTimer = null;
      let delay = 360; // ms before first repeat
      const MIN_DELAY = 40;

      function fire() { stepFn(); }
      function startRepeat() {
        delay = 120;
        timer = setTimeout(function tick() {
          fire();
          delay = Math.max(MIN_DELAY, delay * 0.85);
          timer = setTimeout(tick, delay);
        }, delay);
      }
      function stop() {
        clearTimeout(timer);
        clearTimeout(accelTimer);
        timer = null;
        accelTimer = null;
        delay = 360;
      }

      btn.addEventListener("mousedown", (e) => { e.preventDefault(); fire(); accelTimer = setTimeout(startRepeat, delay); });
      btn.addEventListener("mouseup", stop);
      btn.addEventListener("mouseleave", stop);
      btn.addEventListener("touchstart", (e) => { e.preventDefault(); fire(); accelTimer = setTimeout(startRepeat, delay); }, { passive: false });
      btn.addEventListener("touchend", stop);
      btn.addEventListener("touchcancel", stop);
    }

    setupStepper(el.btnHeroAgeDec, () => setAge(state.userAge - 1, false, null));
    setupStepper(el.btnHeroAgeInc, () => setAge(state.userAge + 1, false, null));
    setupStepper(el.btnQAgeDec,    () => setAge(state.userAge - 1, true, null));
    setupStepper(el.btnQAgeInc,    () => setAge(state.userAge + 1, true, null));

    // Prev / Next
    if (el.btnPrev) el.btnPrev.addEventListener("click", prevQuestion);
    if (el.btnNext) el.btnNext.addEventListener("click", nextQuestion);
    if (el.btnFinishEarly) el.btnFinishEarly.addEventListener("click", startCalculation);

    // Study Modal
    if (el.btnStudyModal) el.btnStudyModal.addEventListener("click", openStudyModal);
    if (el.studyModalClose) el.studyModalClose.addEventListener("click", closeStudyModal);
    if (el.studyModalBackdrop) el.studyModalBackdrop.addEventListener("click", closeStudyModal);

    // Retake / Share
    if (el.btnRetake) el.btnRetake.addEventListener("click", resetQuiz);
    if (el.btnShare) el.btnShare.addEventListener("click", handleShare);

    // Toggle Live Telemetry Drawer during Quiz
    const btnToggleTelemetry = $("btn-toggle-quiz-telemetry");
    const drawerCollapse = $("quiz-telemetry-collapse");
    if (btnToggleTelemetry && drawerCollapse) {
      btnToggleTelemetry.addEventListener("click", () => {
        const isOpen = drawerCollapse.style.display !== "none";
        drawerCollapse.style.display = isOpen ? "none" : "block";
        btnToggleTelemetry.classList.toggle("open", !isOpen);
      });
    }

    // Language switcher buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetLang = btn.getAttribute("data-lang");
        if (window.I18N) window.I18N.setLang(targetLang);
      });
    });

    // Keyboard navigation
    window.addEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (!el.screenQuiz.classList.contains("active")) return;
    if (el.studyModal && el.studyModal.classList.contains("active")) {
      if (e.key === "Escape") closeStudyModal();
      return;
    }

    const keyNum = parseInt(e.key, 10);
    if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 6) {
      const currentQ = getCurrentQuestion();
      if (currentQ && currentQ.o[keyNum - 1]) {
        selectOption(currentQ.o[keyNum - 1]);
      }
    }

    if (e.key === "ArrowLeft") prevQuestion();
    if (e.key === "ArrowRight") nextQuestion();
  }

  function getSystemQuestions(sysId) {
    return window.QUESTIONS.filter((q) => q.system === sysId);
  }

  function getCurrentQuestion() {
    const questions = getSystemQuestions(state.currentSystem);
    return questions[state.currentQuestionIndex] || questions[0];
  }

  function renderSystemTabs() {
    const nav = $("quiz-systems-tabs");
    if (!nav) return;

    const lang = getLang();
    nav.innerHTML = "";

    for (const sysId in window.SYSTEMS_INFO) {
      const sys = window.SYSTEMS_INFO[sysId];
      const questions = getSystemQuestions(sysId);
      const answeredCount = questions.filter((q) => state.answers[q.id]).length;
      const isComplete = answeredCount === questions.length && questions.length > 0;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `system-tab-chip ${state.currentSystem === sysId ? "active" : ""} ${isComplete ? "done" : ""}`;
      btn.innerHTML = `
        <span class="sys-chip-icon">${sys.icon}</span>
        <span class="sys-chip-name">${sys.title[lang] || sys.title.uk}</span>
        <span class="sys-chip-badge">${answeredCount}/${questions.length}</span>
      `;

      btn.addEventListener("click", () => {
        selectSystemModule(sysId);
      });

      nav.appendChild(btn);
    }
  }

  function selectSystemModule(sysId) {
    if (!window.SYSTEMS_INFO[sysId]) return;
    state.currentSystem = sysId;
    state.currentQuestionIndex = 0;

    // Sync body cockpit
    if (state.quizCockpit) {
      state.quizCockpit.selectSystem(sysId);
    }

    renderSystemTabs();
    renderCurrentQuestion();
  }

  function jumpToFirstUnanswered() {
    if (!window.QUESTIONS) return false;
    for (const q of window.QUESTIONS) {
      if (!state.answers[q.id]) {
        state.currentSystem = q.system;
        const sysQuestions = getSystemQuestions(q.system);
        const idx = sysQuestions.findIndex((item) => item.id === q.id);
        state.currentQuestionIndex = Math.max(0, idx);
        if (state.quizCockpit) {
          state.quizCockpit.selectSystem(q.system);
        }
        renderSystemTabs();
        renderCurrentQuestion();
        return true;
      }
    }
    return false;
  }

  function startQuiz() {
    state.answers = {};
    if (el.heroAgeInput) {
      const parsed = parseInt(el.heroAgeInput.value, 10);
      if (!isNaN(parsed) && parsed >= 14 && parsed <= 100) {
        setAge(parsed, false);
      }
    } else {
      setAge(state.userAge, false);
    }

    // Pre-populate baseline age question answer with exact chronological age
    const ageQ = window.QUESTIONS ? window.QUESTIONS.find((q) => q.id === "age") : null;
    if (ageQ) {
      const match = findAgeOption(ageQ.o, state.userAge);
      state.answers["age"] = {
        ...match,
        qId: "age",
        system: "circulatory",
        questionTitle: ageQ.q,
        explanation: ageQ.explanation,
        studies: ageQ.studies
      };
    }

    state.currentSystem = "circulatory";
    state.currentQuestionIndex = 0;
    if (state.quizCockpit) state.quizCockpit.update(state.answers);
    switchScreen(el.screenIntro, el.screenQuiz);
    renderSystemTabs();
    renderCurrentQuestion();
  }

  function prevQuestion() {
    const questions = getSystemQuestions(state.currentSystem);
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderCurrentQuestion();
    } else {
      // Step back to previous system
      const sysKeys = Object.keys(window.SYSTEMS_INFO);
      const currIdx = sysKeys.indexOf(state.currentSystem);
      if (currIdx > 0) {
        state.currentSystem = sysKeys[currIdx - 1];
        const prevQuestions = getSystemQuestions(state.currentSystem);
        state.currentQuestionIndex = Math.max(0, prevQuestions.length - 1);
        renderSystemTabs();
        renderCurrentQuestion();
      }
    }
  }

  function nextQuestion() {
    const questions = getSystemQuestions(state.currentSystem);
    if (state.currentQuestionIndex < questions.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
    } else {
      // Step into next system
      const sysKeys = Object.keys(window.SYSTEMS_INFO);
      const currIdx = sysKeys.indexOf(state.currentSystem);
      if (currIdx < sysKeys.length - 1) {
        state.currentSystem = sysKeys[currIdx + 1];
        state.currentQuestionIndex = 0;
        renderSystemTabs();
        renderCurrentQuestion();
      } else {
        // Last question in last system reached — check if any questions remain unanswered
        const totalCount = window.QUESTIONS ? window.QUESTIONS.length : 39;
        const answeredCount = Object.keys(state.answers).length;
        if (answeredCount < totalCount) {
          jumpToFirstUnanswered();
        } else {
          startCalculation();
        }
      }
    }
  }

  function renderCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;

    const lang = getLang();
    const sys = window.SYSTEMS_INFO[q.system];
    const sysQuestions = getSystemQuestions(q.system);

    // Overall Progress Calculation
    const totalQuestions = window.QUESTIONS.length;
    const answeredCount = Object.keys(state.answers).length;
    const pct = Math.round((answeredCount / totalQuestions) * 100);

    el.pbar.style.width = `${pct}%`;
    el.ptext.textContent = `${answeredCount} / ${totalQuestions} (${pct}%)`;

    // Category and Question Header
    el.qCatBadge.textContent = sys.title[lang] || sys.title.uk;
    el.qCatBadge.style.borderColor = `${sys.color}40`;
    el.qCatBadge.style.color = sys.color;

    el.qTitle.textContent = q.q[lang] || q.q.uk;
    el.qBadge.textContent = `${q.badge[lang] || q.badge.uk} (${state.currentQuestionIndex + 1}/${sysQuestions.length})`;

    // Plain-language hint ("Для людей / простими словами")
    if (el.qSimpleText && q.simpleHint) {
      el.qSimpleText.textContent = q.simpleHint[lang] || q.simpleHint.uk || "";
      if (el.qSimpleHint) el.qSimpleHint.style.display = "flex";
    } else if (el.qSimpleHint) {
      el.qSimpleHint.style.display = "none";
    }

    // Question 1: exact age stepper
    if (el.qAgePickerWrap) {
      if (q.id === "age") {
        el.qAgePickerWrap.style.display = "flex";
        if (el.inputQAge) el.inputQAge.value = state.userAge;
      } else {
        el.qAgePickerWrap.style.display = "none";
      }
    }

    // Nav button visibility
    const sysKeys = Object.keys(window.SYSTEMS_INFO);
    const isFirst = state.currentSystem === sysKeys[0] && state.currentQuestionIndex === 0;
    el.btnPrev.style.display = isFirst ? "none" : "inline-flex";

    // Hide finish early button — all questions must be completed for valid results
    if (el.btnFinishEarly) {
      el.btnFinishEarly.style.display = "none";
    }

    // Render Options
    el.qOptions.innerHTML = "";
    q.o.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt-card";

      const optTitle = opt.t[lang] || opt.t.uk;
      const optNote = opt.note ? (opt.note[lang] || opt.note.uk) : "";
      let isSelected;
      if (q.id === "age") {
        // Age question: strict range match — exactly one option highlighted
        const matchingOpt = findAgeOption(q.o, state.userAge);
        isSelected = opt === matchingOpt;
      } else {
        isSelected =
          state.answers[q.id]?.t?.[lang] === optTitle ||
          state.answers[q.id]?.t?.uk === opt.t.uk;
      }

      if (isSelected) btn.classList.add("selected");

      btn.innerHTML = `
        <div class="opt-key">[${idx + 1}]</div>
        <div class="opt-body">
          <div class="opt-title">${optTitle}</div>
          ${optNote ? `<div class="opt-note">${optNote}</div>` : ""}
        </div>
        <div class="opt-delta ${opt.d > 0 ? "pos" : opt.d < 0 ? "neg" : "zero"}">
          ${opt.d > 0 ? `+${opt.d} ${t("unitYear")}` : opt.d < 0 ? `${opt.d} ${t("unitYear")}` : "0"}
        </div>
      `;

      btn.addEventListener("click", () => selectOption(opt));
      el.qOptions.appendChild(btn);
    });
  }

  function selectOption(opt) {
    const q = getCurrentQuestion();
    state.answers[q.id] = {
      ...opt,
      qId: q.id,
      system: q.system,
      questionTitle: q.q,
      explanation: q.explanation,
      studies: q.studies
    };

    if (q.id === "age") {
      // Keep exact user age if already within this option bracket!
      // NEVER overwrite exact user age (e.g. 26 or 20) with opt.ageVal (28)
      if (typeof opt.minAge === "number" && typeof opt.maxAge === "number") {
        if (state.userAge < opt.minAge || state.userAge > opt.maxAge) {
          setAge(opt.ageVal || opt.minAge, false);
        } else {
          setAge(state.userAge, false);
        }
      } else if (opt.ageVal) {
        setAge(opt.ageVal, false);
      }
    }

    if (q.id === "sex") {
      const isFemale = opt.t.uk.includes("Жін") || opt.t.en?.includes("Female");
      state.userSex = isFemale ? "female" : "male";
      state.baseExpectancy = isFemale ? 79.2 : 74.0;
    }

    // Update body cockpit in real-time
    if (state.quizCockpit) {
      state.quizCockpit.update(state.answers);
    }

    renderSystemTabs();

    // Auto-advance
    setTimeout(() => {
      nextQuestion();
    }, 180);
  }

  function openStudyModal() {
    const q = getCurrentQuestion();
    if (!q) return;

    const lang = getLang();
    el.studyTitle.textContent = q.q[lang] || q.q.uk;
    el.studyMechanism.textContent = q.explanation[lang] || q.explanation.uk;

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
            <span class="study-journal">🏛️ ${st.journal} (PMID: ${st.pmid || "Verified"})</span>
            <span class="study-ext">${t("openSource")}</span>
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

  // Simulation Compilation
  function startCalculation() {
    const totalCount = window.QUESTIONS ? window.QUESTIONS.length : 39;
    const answeredCount = Object.keys(state.answers).length;
    if (answeredCount < totalCount) {
      jumpToFirstUnanswered();
      return;
    }

    switchScreen(el.screenQuiz, el.screenLoading);

    const simSteps = t("simSteps");
    const simulationSteps = Array.isArray(simSteps) ? simSteps : [
      { text: "Калібрування фонового актуарного темпу Гомпертца...", phase: "Етап 1 з 4" }
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
        setTimeout(showResults, 400);
      }
    }, 380);
  }

  function showResults() {
    switchScreen(el.screenLoading, el.screenResult);

    const lang = getLang();
    let rawDelta = 0;
    const sysScores = {};
    const factorList = [];

    // Mental health scoring accumulators
    const mentalScores = {
      schizotypy: 0,
      neuroticism: 0,
      dopamine: 0,
      affective: 0
    };

    for (const key in state.answers) {
      const a = state.answers[key];
      if (a.d !== undefined) {
        rawDelta += a.d;
        sysScores[a.system] = (sysScores[a.system] || 0) + a.d;

        if (a.d !== 0) {
          factorList.push({
            name: a.label?.[lang] || a.t?.[lang] || a.label || a.t,
            delta: a.d,
            system: a.system,
            studies: a.studies,
            explanation: a.explanation?.[lang] || a.explanation?.uk || a.explanation
          });
        }

        // Mental health scale mapping
        if (key === "schizotypy_sens" || key === "schizotypy_paranoid") {
          mentalScores.schizotypy += (a.d < 0 ? Math.abs(a.d) * 25 : 10);
        }
        if (key === "neuroticism" || key === "stress") {
          mentalScores.neuroticism += (a.d < 0 ? Math.abs(a.d) * 20 : 10);
        }
        if (key === "dopamine_adhd") {
          mentalScores.dopamine += (a.d < 0 ? Math.abs(a.d) * 30 : 15);
        }
        if (key === "affective_anhedonia" || key === "social") {
          mentalScores.affective += (a.d > 0 ? a.d * 22 : 10);
        }
      }
    }

    // Actuarial calibrated lifespan
    const finalAge = calculateCalibratedLifespan(state.baseExpectancy, rawDelta);
    const yearsRemaining = Math.max(1, +(finalAge - state.userAge).toFixed(1));

    // Biological age
    const bioDelta = -( (finalAge - state.baseExpectancy) * 0.65 );
    const minBio = state.userAge >= 18 ? 18 : state.userAge;
    const biologicalAge = Math.max(minBio, +(state.userAge + bioDelta).toFixed(1));

    // Milestone Date
    const now = new Date();
    const milestoneYear = now.getFullYear() + Math.round(yearsRemaining);
    const milestoneMonth = now.toLocaleString(lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "uk-UA", { month: "long" });

    // Proper declensions
    const ageSuffix = getUnitSuffix(finalAge, lang);
    const yearsSuffix = getUnitSuffix(yearsRemaining, lang);
    const bioSuffix = getUnitSuffix(biologicalAge, lang);

    // Animate UI Metrics
    animateValue(el.resAge, state.userAge, finalAge, 1100, ageSuffix);
    animateValue(el.resYears, 0, yearsRemaining, 1100, yearsSuffix);
    animateValue(el.resBioAge, state.userAge, biologicalAge, 1100, bioSuffix);

    el.resDate.textContent = `${milestoneMonth.toUpperCase()} ${milestoneYear}`;

    if (el.resConfidenceInterval) {
      const ciLower = Math.max(state.userAge + 1, +(finalAge - 3.2).toFixed(1));
      const ciUpper = +(finalAge + 3.2).toFixed(1);
      const ciUnit = lang === "en" ? "yrs" : lang === "uk" ? "р." : "года";
      el.resConfidenceInterval.textContent = `${ciLower} – ${ciUpper} ${ciUnit}`;
    }

    if (bioDelta < -0.5) {
      const diffVal = Math.abs(bioDelta).toFixed(1);
      const diffUnit = lang === "en" ? "yrs" : lang === "uk" ? "р." : (diffVal % 1 !== 0 ? "года" : "лет");
      el.resBioDiff.textContent = `${t("youngerBy")} ${diffVal} ${diffUnit}`;
      el.resBioDiff.className = "stat-diff pos";
    } else if (bioDelta > 0.5) {
      const diffVal = bioDelta.toFixed(1);
      const diffUnit = lang === "en" ? "yrs" : lang === "uk" ? "р." : (diffVal % 1 !== 0 ? "года" : "лет");
      el.resBioDiff.textContent = `${t("olderBy")} ${diffVal} ${diffUnit}`;
      el.resBioDiff.className = "stat-diff neg";
    } else {
      el.resBioDiff.textContent = t("ageMatches");
      el.resBioDiff.className = "stat-diff zero";
    }

    // Render Factor stacks
    factorList.sort((a, b) => b.delta - a.delta);
    const posFactors = factorList.filter((f) => f.delta > 0).slice(0, 5);
    const negFactors = factorList.filter((f) => f.delta < 0).reverse().slice(0, 5);

    renderFactors(el.resPosFactors, posFactors, true);
    renderFactors(el.resNegFactors, negFactors, false);

    // Render Optimization Roadmap
    renderRoadmap(factorList);

    // Render Mental Health Profile
    renderMentalProfile(mentalScores);

    // Render Charts
    renderSurvivalChart(state.userAge, finalAge);
    renderRadarChart(sysScores);

    // Update Telemetry Cockpit in results
    if (state.resultsCockpit) {
      state.resultsCockpit.update(state.answers);
    }
  }

  function renderFactors(container, factors, isPositive) {
    if (!container) return;
    container.innerHTML = "";
    if (factors.length === 0) {
      container.innerHTML = `<div class="factor-empty">${t("results.noFactors")}</div>`;
      return;
    }

    factors.forEach((f) => {
      const div = document.createElement("div");
      div.className = `factor-card ${isPositive ? "pos" : "neg"}`;
      const sign = isPositive ? "+" : "";

      div.innerHTML = `
        <div class="factor-main">
          <div class="factor-name">${f.name}</div>
          <div class="factor-val ${isPositive ? "text-emerald" : "text-rose"}">${sign}${f.delta} ${t("unitYear")}</div>
        </div>
        ${f.studies && f.studies[0] ? `
          <a href="${f.studies[0].link}" target="_blank" rel="noopener noreferrer" class="factor-study-link">
            <span>🔬 ${f.studies[0].journal}</span>
            <span>PubMed ↗</span>
          </a>
        ` : ""}
      `;
      container.appendChild(div);
    });
  }

  function renderRoadmap(factors) {
    if (!el.resRoadmap) return;
    el.resRoadmap.innerHTML = "";

    const modifiableNegatives = factors.filter((f) => f.delta < 0 && f.system !== "genetics");
    if (modifiableNegatives.length === 0) {
      el.resRoadmap.innerHTML = `
        <div class="roadmap-card success">
          <div class="roadmap-header">
            <span class="roadmap-badge">${t("results.roadmapPerfectTitle")}</span>
            <span class="roadmap-years">${t("results.roadmapPerfectGain")}</span>
          </div>
          <p class="roadmap-desc">${t("results.roadmapPerfectDesc")}</p>
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
          <div class="roadmap-title">${t("optPrefix")} ${f.name}</div>
          <div class="roadmap-years">+${potentialGain} ${t("potentialYears")}</div>
        </div>
        <p class="roadmap-desc">${f.explanation || t("results.roadmapDefaultDesc")}</p>
      `;
      el.resRoadmap.appendChild(card);
    });
  }

  function renderMentalProfile(scores) {
    if (!el.resMentalAnalysis) return;

    const schizotypyLevel = scores.schizotypy > 35 ? t("mentalScales.schizotypyHigh") : t("mentalScales.schizotypyNormal");
    const neuroticismLevel = scores.neuroticism > 30 ? t("mentalScales.neuroticismHigh") : t("mentalScales.neuroticismNormal");
    const dopamineLevel = scores.dopamine > 30 ? t("mentalScales.dopamineHigh") : t("mentalScales.dopamineNormal");

    el.resMentalAnalysis.innerHTML = `
      <div class="mental-grid">
        <div class="mental-card">
          <div class="mental-badge">${t("mentalScales.schizotypy")}</div>
          <div class="mental-val">${schizotypyLevel}</div>
          <p class="mental-desc">${t("mentalScales.schizotypyDesc")}</p>
        </div>
        <div class="mental-card">
          <div class="mental-badge">${t("mentalScales.neuroticism")}</div>
          <div class="mental-val">${neuroticismLevel}</div>
          <p class="mental-desc">${t("mentalScales.neuroticismDesc")}</p>
        </div>
        <div class="mental-card">
          <div class="mental-badge">${t("mentalScales.dopamine")}</div>
          <div class="mental-val">${dopamineLevel}</div>
          <p class="mental-desc">${t("mentalScales.dopamineDesc")}</p>
        </div>
      </div>
    `;
  }

  // Interactive Survival Curve (Gompertz-Makeham Simulation)
  function renderSurvivalChart(startAge, expectedAge) {
    const canvas = $("survivalChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (state.survivalChart) state.survivalChart.destroy();

    const ages = [];
    const cohortProbabilities = [];
    const userProbabilities = [];

    const alpha = 0.0001;
    const beta = 0.0815;
    const gamma = 0.0006;
    const userMultiplier = Math.exp((state.baseExpectancy - expectedAge) * 0.08);

    for (let a = startAge; a <= 104; a += 2) {
      ages.push(a);
      const cohortH = (alpha / beta) * (Math.exp(beta * a) - Math.exp(beta * startAge)) + gamma * (a - startAge);
      const cohortP = Math.max(0, Math.min(100, Math.round(Math.exp(-cohortH) * 100)));
      cohortProbabilities.push(cohortP);

      const userH = (alpha / beta) * (Math.exp(beta * a) - Math.exp(beta * startAge)) * userMultiplier + gamma * (a - startAge);
      const userP = Math.max(0, Math.min(100, Math.round(Math.exp(-userH) * 100)));
      userProbabilities.push(userP);
    }

    state.survivalChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ages,
        datasets: [
          {
            label: t("results.survivalUser"),
            data: userProbabilities,
            borderColor: "#00e5ff",
            backgroundColor: "rgba(0, 229, 255, 0.12)",
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 3
          },
          {
            label: t("results.survivalCohort"),
            data: cohortProbabilities,
            borderColor: "rgba(255, 255, 255, 0.25)",
            borderDash: [5, 5],
            borderWidth: 1.5,
            fill: false,
            tension: 0.35,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8", font: { family: "'JetBrains Mono', monospace" } }
          },
          y: {
            min: 0,
            max: 100,
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

  // 8-Axis Physiological Radar Chart
  function renderRadarChart(scores) {
    const canvas = $("radarChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (state.radarChart) state.radarChart.destroy();

    const normalize = (val) => Math.max(20, Math.min(100, Math.round(75 + val * 6.0)));

    const radarLabels = t("results.radarAxes") || [
      "Кровообіг",
      "Дихання",
      "Травлення",
      "Скелет",
      "Нерви",
      "Нирки",
      "Імунітет",
      "Мускулатура"
    ];

    const radarValues = [
      normalize(scores.circulatory || 0),
      normalize(scores.respiratory || 0),
      normalize(scores.digestive || 0),
      normalize(scores.skeletal || 0),
      normalize(scores.nervous || 0),
      normalize(scores.renal || 0),
      normalize(scores.immune || 0),
      normalize(scores.muscular || 0)
    ];

    state.radarChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: t("results.radarUser"),
            data: radarValues,
            backgroundColor: "rgba(0, 229, 255, 0.2)",
            borderColor: "#00e5ff",
            borderWidth: 2.5,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#00e5ff"
          },
          {
            label: t("results.radarOptimal"),
            data: [92, 92, 92, 90, 92, 90, 92, 92],
            backgroundColor: "transparent",
            borderColor: "rgba(0, 230, 118, 0.4)",
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: "rgba(255, 255, 255, 0.08)" },
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            pointLabels: { color: "#cbd5e1", font: { size: 11, weight: 600 } },
            ticks: { display: false }
          }
        }
      }
    });
  }

  function resetQuiz() {
    state.answers = {};
    state.currentSystem = "circulatory";
    state.currentQuestionIndex = 0;
    if (state.quizCockpit) state.quizCockpit.update({});
    switchScreen(el.screenResult, el.screenIntro);
  }

  function handleShare() {
    const finalAgeText = el.resAge.textContent;
    const shareText = t("results.shareTemplate").replace("{age}", finalAgeText);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        const oldHtml = el.btnShare.innerHTML;
        el.btnShare.innerHTML = `<span>${t("results.shareCopied")}</span>`;
        setTimeout(() => {
          el.btnShare.innerHTML = oldHtml;
        }, 2200);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
