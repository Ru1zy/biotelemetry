/**
 * Internationalization (i18n) Engine
 * Full localization support for Ukrainian (UK), English (EN), and Russian (RU).
 */

const I18N = {
  currentLang: localStorage.getItem("bio_lang") || "uk",

  translations: {
    uk: {
      brand: "BioTelemetry Actuarial",
      tagline: "Комплексна актуарна модель тривалості життя та біометричного здоров'я",
      modelBadge: "АКТУАРНА МОДЕЛЬ ГОМПЕРТЦА-МЕЙКХЕМА",
      initAudit: "Ініціалізувати біоаудит",
      anonymousNotice: "Анонімний аналіз. Усі розрахунки відбуваються локально у вашому браузері.",
      selectSystemPrompt: "Оберіть розділ для заповнення біометричних маркерів:",
      overallProgress: "Загальний прогрес аудиту",
      finishAndCalculate: "Розрахувати результати та факторний звіт",
      allSystems: "Всі системи",
      scientificEvidence: "Наукове обґрунтування",
      close: "Закрити",
      studiesModalTitle: "Доказова медицина та першоджерела",
      mechanismTitle: "Біологічний механізм впливу на тканини та старіння:",
      openSource: "Відкрити публікацію на PubMed ↗",
      prevQuestion: "Попереднє запитання",
      nextQuestion: "Наступне запитання",
      backToSystems: "← До вибору систем",
      keyTip: "Швидкий вибір клавішами [1]-[6]",
      
      // Bio Inc Systems
      systems: {
        circulatory: "Кровообіг",
        respiratory: "Органи дихання",
        digestive: "Травлення",
        skeletal: "Скелет",
        nervous: "Нерви та Психіка",
        renal: "Нирки",
        immune: "Імунітет",
        muscular: "Мускулатура"
      },

      // Layers
      layers: {
        organs: "Внутрішні органи",
        muscles: "Мускулатура",
        skeleton: "Скелет",
        nerves: "Нерви та Судини"
      },

      // HUD & Telemetry
      hud: {
        bioScore: "БІО-РЕЗЕРВ",
        systemHealth: "ЦІЛІСНІСТЬ СИСТЕМ",
        inspectOrgan: "Натисніть на орган для детальної діагностики",
        daysToMilestone: "РОКІВ ЖИТТЯ",
        integrityLabel: "Цілісність",
        statusOptimal: "Оптимальний",
        statusCompensated: "Компенсований",
        statusRisk: "Підвищений ризик",
        statusCritical: "Критичне навантаження"
      },

      // Results
      results: {
        completedBadge: "Симуляцію успішно завершено",
        title: "Звіт біологічного віку, тривалості життя та ментального профілю",
        expectedAge: "Очікувана тривалість життя",
        yearsLeft: "Залишок років життя",
        bioAge: "Оцінений біологічний вік",
        milestoneHorizon: "Орієнтовний віковий горизонт когорти",
        ciInterval: "95% довірчий інтервал когорти:",
        survivalCurveTitle: "Крива дожиття (Закон Гомпертца-Мейкхема)",
        survivalCurveDesc: "Актуарна ймовірність досягнення кожного вікового рубежу з урахуванням мультиплікаторів ризику Cox HR",
        radarTitle: "8-осьовий радар фізіологічної стійкості систем",
        radarDesc: "Індекс функціонального резерву за шкалою 0–100%",
        mentalProfileTitle: "Профіль психічного здоров'я та особистісні риси",
        mentalProfileDesc: "Оцінка когнітивної сенситивності, шизотипічного спектра, емоційної стійкості та дофамінового балансу",
        topProtective: "Головні фактори захисту (подовжують життя)",
        topHazards: "Головні фактори ризику (скорочують життя)",
        roadmapTitle: "Карта оптимізації: персоналізований резерв років",
        roadmapDesc: "Науково доведені кроки з найбільшим потенціалом повернення здорових років життя (Healthspan)",
        retake: "Пройти повторно",
        share: "Скопіювати звіт",
        disclaimerTitle: "Наукове та юридичне застереження:",
        disclaimerText: "Цей інструмент є предиктивною епідеміологічною моделлю популяційного рівня (UK Biobank, Framingham, Global Burden of Disease). Він не є індивідуальним медичним діагнозом чи призначенням лікування."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Шизотипічний спектр / Сенситивність",
        neuroticism: "Емоційна лабільність / Невротизм",
        dopamine: "Імпульсивність / Дофамінова регуляція",
        affective: "Афективний баланс / Резильєнтність"
      }
    },

    ru: {
      brand: "BioTelemetry Actuarial",
      tagline: "Комплексная актуарная модель продолжительности жизни и биометрического здоровья",
      modelBadge: "АКТУАРНАЯ МОДЕЛЬ ГОМПЕРТЦА-МЕЙКХЕМА",
      initAudit: "Инициализировать биоаудит",
      anonymousNotice: "Анонимный анализ. Все расчеты производятся локально в вашем браузере.",
      selectSystemPrompt: "Выберите раздел для заполнения биометрических маркеров:",
      overallProgress: "Общий прогресс аудита",
      finishAndCalculate: "Рассчитать результаты и факторный отчет",
      allSystems: "Все системы",
      scientificEvidence: "Научное обоснование",
      close: "Закрыть",
      studiesModalTitle: "Доказательная медицина и первоисточники",
      mechanismTitle: "Биологический механизм влияния на ткани и старение:",
      openSource: "Открыть публикацию на PubMed ↗",
      prevQuestion: "Предыдущий вопрос",
      nextQuestion: "Следующий вопрос",
      backToSystems: "← К выбору систем",
      keyTip: "Быстрый выбор клавишами [1]-[6]",

      // Bio Inc Systems
      systems: {
        circulatory: "Кровообращение",
        respiratory: "Органы дыхания",
        digestive: "Пищеварение",
        skeletal: "Скелет",
        nervous: "Нервы и Психика",
        renal: "Почки",
        immune: "Иммунитет",
        muscular: "Мускулатура"
      },

      // Layers
      layers: {
        organs: "Внутренние органы",
        muscles: "Мускулатура",
        skeleton: "Скелет",
        nerves: "Нервы и Сосуды"
      },

      // HUD & Telemetry
      hud: {
        bioScore: "БИО-РЕЗЕРВ",
        systemHealth: "ЦЕЛОСТНОСТЬ СИСТЕМ",
        inspectOrgan: "Нажмите на орган для детальной диагностики",
        daysToMilestone: "ЛЕТ ЖИЗНИ",
        integrityLabel: "Целостность",
        statusOptimal: "Оптимальное",
        statusCompensated: "Компенсированное",
        statusRisk: "Повышенный риск",
        statusCritical: "Критическая нагрузка"
      },

      // Results
      results: {
        completedBadge: "Симуляция успешно завершена",
        title: "Отчет биологического возраста, долголетия и ментального профиля",
        expectedAge: "Ожидаемая продолжительность жизни",
        yearsLeft: "Остаток лет жизни",
        bioAge: "Оцененный биологический возраст",
        milestoneHorizon: "Ориентировочный возрастной горизонт когорты",
        ciInterval: "95% доверительный интервал когорты:",
        survivalCurveTitle: "Кривая дожития (Закон Гомпертца-Мейкхема)",
        survivalCurveDesc: "Актуарная вероятность достижения каждого возрастного рубежа с учетом мультипликаторов риска Cox HR",
        radarTitle: "8-осевой радар физиологической стойкости систем",
        radarDesc: "Индекс функционального резерва по шкале 0–100%",
        mentalProfileTitle: "Профиль психического здоровья и личностные черты",
        mentalProfileDesc: "Оценка когнитивной сенситивности, шизотипического спектра, эмоциональной стабильности и дофаминового баланса",
        topProtective: "Главные факторы защиты (продлевают жизнь)",
        topHazards: "Главные факторы риска (сокращают жизнь)",
        roadmapTitle: "Карта оптимизации: персонализированный резерв лет",
        roadmapDesc: "Научно доказанные шаги с наибольшим потенциалом возвращения здоровых лет жизни (Healthspan)",
        retake: "Пройти заново",
        share: "Скопировать отчет",
        disclaimerTitle: "Научное и юридическое предостережение:",
        disclaimerText: "Данный инструмент является предиктивной эпидемиологической моделью популяционного уровня (UK Biobank, Framingham, Global Burden of Disease). Он не является медицинским диагнозом или клиническим назначением."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Шизотипический спектр / Сенситивность",
        neuroticism: "Эмоциональная лабильность / Невротизм",
        dopamine: "Импульсивность / Дофаминовая регуляция",
        affective: "Аффективный баланс / Резильентность"
      }
    },

    en: {
      brand: "BioTelemetry Actuarial",
      tagline: "Comprehensive Actuarial Lifespan & Biometric Health Model",
      modelBadge: "GOMPERTZ-MAKEHAM ACTUARIAL ENGINE",
      initAudit: "Initialize Bio-Audit",
      anonymousNotice: "Anonymous assessment. All actuarial simulations run locally in your browser.",
      selectSystemPrompt: "Select a physiological module to input biomarker data:",
      overallProgress: "Overall Audit Progress",
      finishAndCalculate: "Calculate Results & Factor Decomposition",
      allSystems: "All Systems",
      scientificEvidence: "Scientific Evidence",
      close: "Close",
      studiesModalTitle: "Evidence-Based Peer-Reviewed Sources",
      mechanismTitle: "Biological Mechanism of Tissue Senescence:",
      openSource: "Open Peer-Reviewed Article on PubMed ↗",
      prevQuestion: "Previous Question",
      nextQuestion: "Next Question",
      backToSystems: "← Back to Modules",
      keyTip: "Quick select using keyboard [1]-[6]",

      // Bio Inc Systems
      systems: {
        circulatory: "Circulatory",
        respiratory: "Respiratory",
        digestive: "Digestive",
        skeletal: "Skeletal",
        nervous: "Nervous & Mind",
        renal: "Renal",
        immune: "Immune",
        muscular: "Muscular"
      },

      // Layers
      layers: {
        organs: "Internal Organs",
        muscles: "Muscular System",
        skeleton: "Skeletal System",
        nerves: "Nervous & Vessels"
      },

      // HUD & Telemetry
      hud: {
        bioScore: "BIO-RESERVE",
        systemHealth: "SYSTEM INTEGRITY",
        inspectOrgan: "Click on organ for detailed clinical breakdown",
        daysToMilestone: "YEARS OF LIFE",
        integrityLabel: "Integrity",
        statusOptimal: "Optimal",
        statusCompensated: "Compensated",
        statusRisk: "Elevated Risk",
        statusCritical: "Critical Stress"
      },

      // Results
      results: {
        completedBadge: "Simulation Successfully Completed",
        title: "Biological Age, Longevity & Psychological Profile Report",
        expectedAge: "Estimated Life Expectancy",
        yearsLeft: "Remaining Years of Life",
        bioAge: "Estimated Biological Age",
        milestoneHorizon: "Actuarial Cohort Horizon",
        ciInterval: "95% Empirical Confidence Interval:",
        survivalCurveTitle: "Survival Curve (Gompertz-Makeham Law)",
        survivalCurveDesc: "Actuarial cumulative survival probability accounting for Cox Proportional Hazard Ratios",
        radarTitle: "8-Axis Physiological Resilience Radar",
        radarDesc: "Functional physiological reserve score (0–100%)",
        mentalProfileTitle: "Mental Health & Cognitive Trait Profile",
        mentalProfileDesc: "Assessment of schizotypal traits, neuroticism, dopaminergic impulsivity, and affective resilience",
        topProtective: "Top Protective Factors (Extend Life)",
        topHazards: "Top Hazard Factors (Shorten Life)",
        roadmapTitle: "Optimization Roadmap: Reclaim Lost Years",
        roadmapDesc: "Evidence-based lifestyle interventions offering the highest return in disease-free healthspan",
        retake: "Retake Assessment",
        share: "Copy Report",
        disclaimerTitle: "Scientific & Legal Disclaimer:",
        disclaimerText: "This predictive simulation is calibrated on large-scale epidemiological cohorts (UK Biobank, Framingham Heart Study, Global Burden of Disease). It does not constitute medical diagnosis or clinical treatment."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Schizotypy Spectrum / Sensitization",
        neuroticism: "Emotional Instability / Neuroticism",
        dopamine: "Impulsivity / Dopamine Regulation",
        affective: "Affective Balance / Resilience"
      }
    }
  },

  get(keyPath) {
    const lang = this.translations[this.currentLang] || this.translations.uk;
    const parts = keyPath.split(".");
    let curr = lang;
    for (const p of parts) {
      if (!curr || curr[p] === undefined) {
        // Fallback to UK
        let fb = this.translations.uk;
        for (const fbp of parts) {
          if (!fb || fb[fbp] === undefined) return keyPath;
          fb = fb[fbp];
        }
        return fb;
      }
      curr = curr[p];
    }
    return curr;
  },

  setLang(newLang) {
    if (!this.translations[newLang]) return;
    this.currentLang = newLang;
    localStorage.setItem("bio_lang", newLang);
    document.documentElement.lang = newLang;
    window.dispatchEvent(new CustomEvent("bio:lang-changed", { detail: { lang: newLang } }));
  }
};

window.I18N = I18N;
