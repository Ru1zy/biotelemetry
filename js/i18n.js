/**
 * Internationalization (i18n) Engine v3.0
 * Comprehensive localization support for Ukrainian (UK), Russian (RU), and English (EN).
 */

const I18N = {
  currentLang: localStorage.getItem("bio_lang") || "uk",

  translations: {
    uk: {
      docTitle: "BioTelemetry Actuarial v3.0 — Комплексна модель довголіття, систем організму та ментального здоров'я",
      docDesc: "Предиктивна епідеміологічна актуарна модель Гомпертца-Мейкхема на базі UK Biobank, Framingham та рецензованих досліджень PubMed. 39 біомаркерів, 8 фізіологічних систем.",
      brand: "BioTelemetry Actuarial",
      tagline: "Комплексна актуарна модель тривалості життя та біометричного здоров'я",
      modelBadge: "АКТУАРНА МОДЕЛЬ ГОМПЕРТЦА-МЕЙКХЕМА",
      initAudit: "Ініціалізувати біоаудит",
      anonymousNotice: "Анонімний аналіз. Усі розрахунки відбуваються локально у вашому браузері.",
      
      // Hero
      heroTitle: "Оцінка тривалості життя, <span>систем організму</span> та ментального здоров'я",
      heroDesc: "Повна біомедична симуляція індивідуального ризику смертності від усіх причин (All-Cause Mortality), функціонального резерву 8 систем організму та ментального профілю (шизотипічний спектр, емоційна стійкість, дофамін). Розраховано за актуарним законом Гомпертца–Мейкхема на когортах UK Biobank, Framingham та Harvard T.H. Chan.",
      trust1Val: "39 біомаркерів",
      trust1Lbl: "8 систем: серце, дихання, ШКТ, скелет, нерви/психіка, нирки, імунітет, м'язи",
      trust2Val: "Актуарне калібрування",
      trust2Lbl: "Формула спадної корисності (Cox HR) без завищених нереалістичних цифр",
      trust3Val: "100% PubMed DOI",
      trust3Lbl: "Прямі посилання на рецензовані першоджерела у кожному запитанні",

      // Demographics
      demographics: {
        ageLabel: "Ваш точний вік (повних років):",
        ageHint: "Від віку залежить побудова кривої дожиття за законом Гомпертца та залишок років",
        exactAgePrompt: "Або вкажіть точну кількість років:"
      },

      // Quiz
      selectSystemPrompt: "Оберіть розділ для заповнення біометричних маркерів:",
      overallProgress: "Загальний прогрес аудиту",
      finishAndCalculate: "Розрахувати результати",
      allSystems: "Всі системи",
      scientificEvidence: "Наукове обґрунтування",
      close: "Закрити",
      studiesModalTitle: "Наукове обґрунтування",
      mechanismTitle: "Біологічний механізм впливу на тканини та старіння:",
      peerReviewedSources: "Рецензовані наукові першоджерела (PubMed / NIH):",
      openSource: "Відкрити публікацію на PubMed ↗",
      prevQuestion: "Попереднє запитання",
      nextQuestion: "Наступне запитання",
      backToSystems: "← До вибору систем",
      keyTip: "Швидкий вибір клавішами [1]-[6]",
      loadingQuestion: "Завантаження запитання...",
      categoryPill: "Категорія",

      // Units & Math
      unitYear: "р.",
      yearsLabel: "років",
      youngerBy: "Молодший на",
      olderBy: "Старший на",
      ageMatches: "Збігається з паспортним",
      potentialYears: "р. потенціалу",
      optPrefix: "Оптимізація:",
      
      // Simulation steps
      simPhaseInitial: "Етап 1 з 4",
      simLoadingTitle: "Компіляція біометричних факторів...",
      simSteps: [
        { text: "Калібрування фонового актуарного темпу Гомпертца (α = 0.0001, β = 0.0815)...", phase: "Етап 1 з 4" },
        { text: "Інтеграція константи стохастичного ризику Мейкхема (γ = 0.0006)...", phase: "Етап 2 з 4" },
        { text: "Синтез індивідуальних коефіцієнтів небезпеки Кокса (HR-матриця)...", phase: "Етап 3 з 4" },
        { text: "Побудова кумулятивної функції виживаності Каплана–Меєра...", phase: "Етап 4 з 4" }
      ],

      // Systems
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
        statusCritical: "Критичне навантаження",
        diagnosticFactors: "Діагностичні фактори системи:",
        factorsEmptyHint: "Питання цього розділу ({count} шт.) ще не заповнено. Оберіть варіанти відповідей у тесті, щоб переглянути клінічні маркери.",
        gotoSysBtn: "Перейти до запитань цього розділу",
        cockpitDrawerTitle: "Анатомічна карта систем організму (8 систем)",
        cockpitDrawerHint: "Показати 3D анатомію"
      },

      // Hotspots
      hotspots: {
        brain: "Головний мозок / ЦНС",
        heart: "Серце / Міокард",
        lungs: "Легені / Альвеоли",
        liver: "Печінка / Метаболізм",
        stomach: "Шлунок / ШКТ",
        kidneys: "Нирки / Нефрони",
        spine: "Хребетний стовп",
        muscles: "М'язи тулуба / Прес"
      },

      // Results
      results: {
        completedBadge: "Симуляцію успішно завершено",
        title: "Звіт довголіття, систем організму та ментального профілю",
        expectedAge: "Очікувана тривалість життя",
        yearsLeft: "Залишок років життя",
        bioAge: "Оцінений біологічний вік",
        milestoneHorizon: "Орієнтовний віковий горизонт когорти",
        ciInterval: "95% ДІ:",
        auditTitle: "Анатомічний аудит систем організму",
        auditSubtitle: "Перемикайте шари [Органи / М'язи / Скелет / Нерви] та клікайте на системи для вивчення пошкоджень та захисних резервів",
        survivalCurveTitle: "Крива ймовірності дожиття (Закон Гомпертца-Мейкхема)",
        survivalCurveDesc: "Відображає відсоткову ймовірність дожити до кожного вікового рубежу",
        survivalUser: "Ваша траєкторія виживаності",
        survivalCohort: "Середньопопуляційна когорта",
        radarTitle: "8-осьовий радар фізіологічної стійкості систем",
        radarDesc: "Баланс фізіологічних резервів за 8 ключовими системами організму (шкала 0-100%)",
        radarUser: "Ваш індекс резервів",
        radarOptimal: "Оптимальний еталон",
        radarAxes: ["Кровообіг", "Дихання", "Травлення", "Скелет", "Нерви", "Нирки", "Імунітет", "Мускулатура"],
        mentalProfileTitle: "Профіль психічного здоров'я та особистісні риси",
        mentalProfileDesc: "Оцінка когнітивної сенситивності, шизотипічного спектра, емоційної стійкості та дофамінового балансу",
        topProtective: "Головні фактори захисту (подовжують життя)",
        topHazards: "Головні фактори ризику (скорочують життя)",
        noFactors: "Факторів не виявлено",
        roadmapTitle: "Карта оптимізації: персоналізований резерв років",
        roadmapDesc: "Науково обґрунтовані зміни, що дають найбільший приріст до тривалості здорового життя (Healthspan):",
        roadmapDefaultDesc: "Корекція цього показника здатна істотно знизити системний ризик смертності за даними популяційних когорт.",
        roadmapPerfectTitle: "Відмінно",
        roadmapPerfectGain: "+0 додаткових років",
        roadmapPerfectDesc: "Ваш поточний профіль звичок уже максимально наближений до оптимального довголіття. Продовжуйте дотримуватися свого режиму!",
        retake: "⟳ Пройти заново",
        share: "📋 Скопіювати результат",
        shareCopied: "✓ Скопійовано в буфер!",
        shareTemplate: "Мій прогноз тривалості життя за науковою актуарною моделлю Гомпертца-Мейкхема: {age}. Перевір стан своїх систем на BioTelemetry!",
        disclaimerTitle: "Наукове та правове застереження:",
        disclaimerText: "Цей розрахунок базується на статистичних кореляціях популяційних епідеміологічних когорт (Framingham, UK Biobank, ВООЗ) та математичній моделі Гомпертца-Мейкхема. Він не враховує стохастичні форс-мажорні події і не є індивідуальним медичним діагнозом чи призначенням лікування."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Шизотипічний спектр / Сенситивність",
        neuroticism: "Емоційна лабільність / Невротизм",
        dopamine: "Імпульсивність / Дофамінова регуляція",
        affective: "Афективний баланс / Резильєнтність",
        schizotypyHigh: "Підвищена сенситивність",
        schizotypyNormal: "Раціонально-прагматичний",
        schizotypyDesc: "Відображає ступінь сенсорної фільтрації таламуса, ілюзорного сприйняття та підозрілості за клінічною шкалою SPQ-B.",
        neuroticismHigh: "Висока емоційна лабільність",
        neuroticismNormal: "Емоційна рівновага",
        neuroticismDesc: "Маркер реактивності вегетативної нервової системи та румінацій, що впливає на соматичний тиск і нічний сон.",
        dopamineHigh: "Імпульсивний пошук стимулів (СДУГ-риси)",
        dopamineNormal: "Стійкий самоконтроль",
        dopamineDesc: "Баланс префронтальних рецепторів D2/D1, стійкість до компульсивних залежностей та здатність до фокусування."
      }
    },

    ru: {
      docTitle: "BioTelemetry Actuarial v3.0 — Комплексная модель долголетия, систем организма и ментального здоровья",
      docDesc: "Предиктивная эпидемиологическая актуарная модель Гомпертца-Мейкхема на базе UK Biobank, Framingham и рецензируемых исследований PubMed. 39 биомаркеров, 8 физиологических систем.",
      brand: "BioTelemetry Actuarial",
      tagline: "Комплексная актуарная модель продолжительности жизни и биометрического здоровья",
      modelBadge: "АКТУАРНАЯ МОДЕЛЬ ГОМПЕРТЦА-МЕЙКХЕМА",
      initAudit: "Инициализировать биоаудит",
      anonymousNotice: "Анонимный анализ. Все расчеты производятся локально в вашем браузере.",
      
      // Hero
      heroTitle: "Оценка продолжительности жизни, <span>систем организма</span> и ментального здоровья",
      heroDesc: "Полная биомедицинская симуляция индивидуального риска смертности от всех причин (All-Cause Mortality), функционального резерва 8 систем организма и ментального профиля (шизотипический спектр, эмоциональная устойчивость, дофамин). Рассчитано по актуарному закону Гомпертца–Мейкхема на когортах UK Biobank, Framingham и Harvard T.H. Chan.",
      trust1Val: "39 биомаркеров",
      trust1Lbl: "8 систем: сердце, дыхание, ЖКТ, скелет, нервы/психика, почки, иммунитет, мышцы",
      trust2Val: "Актуарная калибровка",
      trust2Lbl: "Формула убывающей полезности (Cox HR) без завышенных нереалистичных цифр",
      trust3Val: "100% PubMed DOI",
      trust3Lbl: "Прямые ссылки на рецензируемые первоисточники в каждом вопросе",

      // Demographics
      demographics: {
        ageLabel: "Ваш точный возраст (полных лет):",
        ageHint: "От возраста зависит расчет кривой выживаемости по закону Гомпертца и остаток лет",
        exactAgePrompt: "Или укажите точное количество лет:"
      },

      // Quiz
      selectSystemPrompt: "Выберите раздел для заполнения биометрических маркеров:",
      overallProgress: "Общий прогресс аудита",
      finishAndCalculate: "Рассчитать результаты",
      allSystems: "Все системы",
      scientificEvidence: "Научное обоснование",
      close: "Закрыть",
      studiesModalTitle: "Научное обоснование",
      mechanismTitle: "Биологический механизм влияния на ткани и старение:",
      peerReviewedSources: "Рецензируемые научные первоисточники (PubMed / NIH):",
      openSource: "Открыть публикацию на PubMed ↗",
      prevQuestion: "Предыдущий вопрос",
      nextQuestion: "Следующий вопрос",
      backToSystems: "← К выбору систем",
      keyTip: "Быстрый выбор клавишами [1]-[6]",
      loadingQuestion: "Загрузка вопроса...",
      categoryPill: "Категория",

      // Units & Math
      unitYear: "г.",
      yearsLabel: "лет",
      youngerBy: "Моложе на",
      olderBy: "Старше на",
      ageMatches: "Совпадает с паспортным",
      potentialYears: "г. потенциала",
      optPrefix: "Оптимизация:",
      
      // Simulation steps
      simPhaseInitial: "Этап 1 из 4",
      simLoadingTitle: "Компиляция биометрических факторов...",
      simSteps: [
        { text: "Калибровка фонового актуарного темпа Гомпертца (α = 0.0001, β = 0.0815)...", phase: "Этап 1 из 4" },
        { text: "Интеграция константы стохастического риска Мейкхема (γ = 0.0006)...", phase: "Этап 2 из 4" },
        { text: "Синтез индивидуальных коэффициентов опасности Кокса (HR-матрица)...", phase: "Этап 3 из 4" },
        { text: "Построение кумулятивной функции выживаемости Каплана–Мейера...", phase: "Этап 4 из 4" }
      ],

      // Systems
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
        statusCritical: "Критическая нагрузка",
        diagnosticFactors: "Диагностические факторы системы:",
        factorsEmptyHint: "Вопросы этого раздела ({count} шт.) еще не заполнены. Выберите варианты ответов в тесте для отображения клинических маркеров.",
        gotoSysBtn: "Перейти к вопросам этого раздела",
        cockpitDrawerTitle: "Анатомическая карта систем организма (8 систем)",
        cockpitDrawerHint: "Показать 3D анатомию"
      },

      // Hotspots
      hotspots: {
        brain: "Головной мозг / ЦНС",
        heart: "Сердце / Миокард",
        lungs: "Легкие / Альвеолы",
        liver: "Печень / Метаболизм",
        stomach: "Желудок / ЖКТ",
        kidneys: "Почки / Нефроны",
        spine: "Позвоночный столб",
        muscles: "Мышцы торса / Пресс"
      },

      // Results
      results: {
        completedBadge: "Симуляция успешно завершена",
        title: "Отчет долголетия, систем организма и ментального профиля",
        expectedAge: "Ожидаемая продолжительность жизни",
        yearsLeft: "Остаток лет жизни",
        bioAge: "Оцененный биологический возраст",
        milestoneHorizon: "Ориентировочный возрастной горизонт когорты",
        ciInterval: "95% ДИ:",
        auditTitle: "Анатомический аудит систем организма",
        auditSubtitle: "Переключайте слои [Органы / Мышцы / Скелет / Нервы] и кликайте на системы для изучения нагрузок и защитных резервов",
        survivalCurveTitle: "Кривая вероятности дожития (Закон Гомпертца-Мейкхема)",
        survivalCurveDesc: "Отображает процентную вероятность дожить до каждого возрастного рубежа",
        survivalUser: "Ваша траектория выживаемости",
        survivalCohort: "Среднепопуляционная когорта",
        radarTitle: "8-осевой радар физиологической стойкости систем",
        radarDesc: "Баланс физиологических резервов по 8 ключевым системам организма (шкала 0–100%)",
        radarUser: "Ваш индекс резервов",
        radarOptimal: "Оптимальный эталон",
        radarAxes: ["Кровообращение", "Дыхание", "Пищеварение", "Скелет", "Нервы", "Почки", "Иммунитет", "Мускулатура"],
        mentalProfileTitle: "Профиль психического здоровья и личностные черты",
        mentalProfileDesc: "Оценка когнитивной сенситивности, шизотипического спектра, эмоциональной стабильности и дофаминового баланса",
        topProtective: "Главные факторы защиты (продлевают жизнь)",
        topHazards: "Главные факторы риска (сокращают жизнь)",
        noFactors: "Факторов не обнаружено",
        roadmapTitle: "Карта оптимизации: персонализированный резерв лет",
        roadmapDesc: "Научно доказанные изменения, дающие наибольший прирост к продолжительности здоровой жизни (Healthspan):",
        roadmapDefaultDesc: "Коррекция этого показателя способна существенно снизить системный риск смертности по данным популяционных когорт.",
        roadmapPerfectTitle: "Отлично",
        roadmapPerfectGain: "+0 дополнительных лет",
        roadmapPerfectDesc: "Ваш текущий образ жизни максимально приближен к оптимальному долголетию. Продолжайте поддерживать свой режим!",
        retake: "⟳ Пройти заново",
        share: "📋 Скопировать результат",
        shareCopied: "✓ Скопировано в буфер!",
        shareTemplate: "Мой прогноз продолжительности жизни по научной актуарной модели Гомпертца-Мейкхема: {age}. Проверь состояние своих систем на BioTelemetry!",
        disclaimerTitle: "Научное и правовое предостережение:",
        disclaimerText: "Данный расчет основан на статистических корреляциях популяционных эпидемиологических когорт (Framingham, UK Biobank, ВОЗ) и математической модели Гомпертца-Мейкхема. Он не учитывает случайные форс-мажорные события и не является медицинским диагнозом или клиническим назначением."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Шизотипический спектр / Сенситивность",
        neuroticism: "Эмоциональная лабильность / Невротизм",
        dopamine: "Импульсивность / Дофаминовая регуляция",
        affective: "Аффективный баланс / Резильентность",
        schizotypyHigh: "Повышенная сенситивность",
        schizotypyNormal: "Рационально-прагматичный",
        schizotypyDesc: "Отражает степень сенсорной фильтрации таламуса, иллюзорного восприятия и подозрительности по клинической шкале SPQ-B.",
        neuroticismHigh: "Высокая эмоциональная лабильность",
        neuroticismNormal: "Эмоциональное равновесие",
        neuroticismDesc: "Маркер реактивности вегетативной нервной системы и руминаций, влияющий на соматическое давление и ночной сон.",
        dopamineHigh: "Импульсивный поиск стимулов (СДВГ-черты)",
        dopamineNormal: "Устойчивый самоконтроль",
        dopamineDesc: "Баланс префронтальных рецепторов D2/D1, устойчивость к компульсивным зависимостям и способность к концентрации."
      }
    },

    en: {
      docTitle: "BioTelemetry Actuarial v3.0 — Comprehensive Longevity, Organ Systems & Mental Health Model",
      docDesc: "Predictive actuarial Gompertz-Makeham longevity model based on UK Biobank, Framingham, and peer-reviewed PubMed cohorts. 39 biomarkers, 8 physiological systems.",
      brand: "BioTelemetry Actuarial",
      tagline: "Comprehensive Actuarial Lifespan & Biometric Health Model",
      modelBadge: "GOMPERTZ-MAKEHAM ACTUARIAL MODEL",
      initAudit: "Initialize Bio-Audit",
      anonymousNotice: "Anonymous analysis. All calculations run locally in your browser.",
      
      // Hero
      heroTitle: "Lifespan Assessment, <span>Organ Systems</span> & Mental Health Profile",
      heroDesc: "Full biomedical simulation of individual all-cause mortality risk, functional reserve across 8 physiological systems, and mental health profile (schizotypy spectrum, emotional stability, dopamine regulation). Calibrated via Gompertz-Makeham actuarial law on UK Biobank, Framingham, and Harvard cohorts.",
      trust1Val: "39 Biomarkers",
      trust1Lbl: "8 systems: circulatory, respiratory, digestive, skeletal, nervous/mind, renal, immune, muscular",
      trust2Val: "Actuarial Calibration",
      trust2Lbl: "Diminishing returns formula (Cox HR) eliminating unrealistic inflated figures",
      trust3Val: "100% PubMed DOI",
      trust3Lbl: "Direct links to peer-reviewed sources for every question",

      // Demographics
      demographics: {
        ageLabel: "Your current age (years):",
        ageHint: "Chronological age calibrates the Gompertz survival curve and remaining life horizon",
        exactAgePrompt: "Or enter your exact age:"
      },

      // Quiz
      selectSystemPrompt: "Select a physiological module to input biomarker data:",
      overallProgress: "Overall Audit Progress",
      finishAndCalculate: "Calculate Results",
      allSystems: "All Systems",
      scientificEvidence: "Scientific Evidence",
      close: "Close",
      studiesModalTitle: "Scientific Evidence",
      mechanismTitle: "Biological Mechanism on Tissue Senescence & Aging:",
      peerReviewedSources: "Peer-Reviewed Scientific Sources (PubMed / NIH):",
      openSource: "Open Peer-Reviewed Article on PubMed ↗",
      prevQuestion: "Previous Question",
      nextQuestion: "Next Question",
      backToSystems: "← Back to Modules",
      keyTip: "Quick select using keyboard [1]-[6]",
      loadingQuestion: "Loading question...",
      categoryPill: "Category",

      // Units & Math
      unitYear: "yrs",
      yearsLabel: "years",
      youngerBy: "Younger by",
      olderBy: "Older by",
      ageMatches: "Matches chronological age",
      potentialYears: "yrs potential",
      optPrefix: "Optimization:",
      
      // Simulation steps
      simPhaseInitial: "Step 1 of 4",
      simLoadingTitle: "Compiling biometric factors...",
      simSteps: [
        { text: "Calibrating baseline Gompertz mortality hazard (α = 0.0001, β = 0.0815)...", phase: "Step 1 of 4" },
        { text: "Integrating Makeham stochastic mortality constant (γ = 0.0006)...", phase: "Step 2 of 4" },
        { text: "Synthesizing Cox Proportional Hazard Ratios (HR Matrix)...", phase: "Step 3 of 4" },
        { text: "Constructing Kaplan-Meier cumulative survival curve...", phase: "Step 4 of 4" }
      ],

      // Systems
      systems: {
        circulatory: "Circulation",
        respiratory: "Respiration",
        digestive: "Digestion",
        skeletal: "Skeleton",
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
        nerves: "Nerves & Vessels"
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
        statusCritical: "Critical Stress",
        diagnosticFactors: "System Diagnostic Factors:",
        factorsEmptyHint: "Questions in this section ({count}) are not yet completed. Select answers in the assessment to view clinical biomarkers.",
        gotoSysBtn: "Proceed to questions in this section",
        cockpitDrawerTitle: "Anatomical Systems Map (8 Systems)",
        cockpitDrawerHint: "Toggle 3D anatomy"
      },

      // Hotspots
      hotspots: {
        brain: "Brain / CNS",
        heart: "Heart / Myocardium",
        lungs: "Lungs / Alveoli",
        liver: "Liver / Metabolism",
        stomach: "Stomach / GI Tract",
        kidneys: "Kidneys / Nephrons",
        spine: "Spinal Column",
        muscles: "Core & Skeletal Muscles"
      },

      // Results
      results: {
        completedBadge: "Simulation Successfully Completed",
        title: "Longevity, Organ Systems & Mental Health Report",
        expectedAge: "Estimated Life Expectancy",
        yearsLeft: "Remaining Years of Life",
        bioAge: "Estimated Biological Age",
        milestoneHorizon: "Estimated Cohort Longevity Horizon",
        ciInterval: "95% CI:",
        auditTitle: "Anatomical Audit of Organ Systems",
        auditSubtitle: "Switch layers [Organs / Muscles / Skeleton / Nerves] and click on systems to inspect strain and protective reserves",
        survivalCurveTitle: "Survival Probability Curve (Gompertz-Makeham Law)",
        survivalCurveDesc: "Displays cumulative probability of reaching each subsequent age milestone",
        survivalUser: "Your Survival Trajectory",
        survivalCohort: "Average Population Cohort",
        radarTitle: "8-Axis Physiological Resilience Radar",
        radarDesc: "Balance of functional reserves across 8 key body systems (0–100% scale)",
        radarUser: "Your Reserve Index",
        radarOptimal: "Optimal Benchmark",
        radarAxes: ["Circulation", "Respiration", "Digestion", "Skeleton", "Nervous", "Renal", "Immune", "Muscles"],
        mentalProfileTitle: "Mental Health Profile & Personality Traits",
        mentalProfileDesc: "Assessment of cognitive sensitivity, schizotypy spectrum, emotional stability, and dopamine regulation",
        topProtective: "Top Protective Factors (Extend Life)",
        topHazards: "Top Hazard Factors (Shorten Life)",
        noFactors: "No significant factors identified",
        roadmapTitle: "Optimization Roadmap: Personal Healthspan Potential",
        roadmapDesc: "Evidence-based interventions yielding the highest increase in disease-free healthspan:",
        roadmapDefaultDesc: "Targeting this biomarker significantly reduces all-cause mortality risk according to cohort meta-analyses.",
        roadmapPerfectTitle: "Optimal Healthspan",
        roadmapPerfectGain: "+0 additional years",
        roadmapPerfectDesc: "Your current lifestyle profile is already well-aligned with maximum longevity. Keep maintaining your routine!",
        retake: "⟳ Retake Assessment",
        share: "📋 Copy Report",
        shareCopied: "✓ Copied to clipboard!",
        shareTemplate: "My estimated life expectancy based on the Gompertz-Makeham actuarial model: {age}. Assess your biomarkers on BioTelemetry!",
        disclaimerTitle: "Scientific & Legal Disclaimer:",
        disclaimerText: "This predictive simulation is calibrated on large-scale epidemiological cohorts (UK Biobank, Framingham Heart Study, Global Burden of Disease). It does not constitute medical diagnosis or clinical treatment."
      },

      // Mental Health Scales
      mentalScales: {
        schizotypy: "Schizotypy Spectrum / Sensitization",
        neuroticism: "Emotional Instability / Neuroticism",
        dopamine: "Impulsivity / Dopamine Regulation",
        affective: "Affective Balance / Resilience",
        schizotypyHigh: "Elevated Sensitivity",
        schizotypyNormal: "Rational Pragmatic",
        schizotypyDesc: "Reflects thalamic sensory gating, illusory perceptions, and interpersonal sensitivity on the clinical SPQ-B scale.",
        neuroticismHigh: "High Emotional Lability",
        neuroticismNormal: "Emotional Equilibrium",
        neuroticismDesc: "Marker of autonomic nervous system reactivity and rumination, impacting vascular tone and deep sleep architecture.",
        dopamineHigh: "Impulsive Stimulus-Seeking (ADHD traits)",
        dopamineNormal: "High Executive Control",
        dopamineDesc: "Prefrontal D2/D1 receptor balance, resilience against compulsive habits, and executive attention sustainment."
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
