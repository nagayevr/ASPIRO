(() => {
  const translations = {"К содержанию":"Skip to content","Навигация по сайту":"Site navigation","Технология":"Technology","Демо":"Demo","Дорожная карта":"Roadmap","Открыть демо":"Open demo","Исследовательский прототип":"Research prototype","Портативная ":"Portable ","спирометрия":"spirometry","ASPIRO объединяет портативный спирометр и веб-интерфейс, чтобы изучать форму выдоха, качество измерений и их связь с окружающей средой.":"ASPIRO combines a portable spirometer with a web interface for exploring exhalation patterns, measurement quality, and their relationship to the surrounding environment.","Запустить демо":"Launch demo","Как это работает":"How it works","Концепт устройства":"Device concept","Концепт: белый портативный спирометр с экраном и графитовым мундштуком":"Concept: a white portable spirometer with a display and graphite mouthpiece","Возможности проекта":"Project capabilities","Анализ формы выдоха":"Exhalation pattern analysis","Кривая «поток — объём» показывает, как меняется поток воздуха в течение попытки.":"The flow-volume curve shows how airflow changes during an attempt.","Контроль качества":"Quality control","Проверка сигнала помогает заметить кашель, замедленный старт или обрыв выдоха.":"Signal checks can reveal a cough, a slow start, or an interrupted exhalation.","Качество воздуха":"Air quality","Индекс качества воздуха (AQI) и уровень PM₂.₅ помогут сопоставлять измерения с состоянием среды.":"The Air Quality Index (AQI) and PM₂.₅ levels can help compare measurements with environmental conditions.","Интерактивное демо":"Interactive demo","Спирометрия в действии":"Spirometry in action","Сравните два сценария и посмотрите, как форма выдоха влияет на кривую и оценку качества попытки.":"Compare two scenarios and see how the exhalation pattern affects the curve and the attempt quality assessment.","Кривая «поток — объём»":"Flow-volume curve","Синтетические данные":"Synthetic data","Сценарий выдоха":"Exhalation scenario","Плавный выдох":"Smooth exhalation","Выдох с кашлем":"Exhalation with cough","Воспроизвести кривую":"Play the curve","Воспроизвести":"Play","Сбросить воспроизведение":"Reset playback","Ход воспроизведения":"Playback progress","Показатели выдоха":"Exhalation metrics","ОФВ₁":"FEV₁","л за первую секунду":"L in the first second","ФЖЕЛ":"FVC","л за весь выдох":"L for the full exhalation","ОФВ₁ / ФЖЕЛ":"FEV₁ / FVC","доля объёма":"volume ratio","ПСВ":"PEF","л/с · пиковый поток":"L/s · peak flow","Демонстрация предназначена для знакомства с интерфейсом. Для оценки здоровья нужны клинические измерения.":"This demo is for exploring the interface. Health assessment requires clinical measurements.","Для воспроизведения кривой включите JavaScript в браузере.":"Enable JavaScript in your browser to play the curve.","От выдоха к данным":"From exhalation to data","В проекте предусмотрены 3D-печатная трубка Вентури, цифровые датчики и передача измерений в приложение.":"The project includes a 3D-printed Venturi tube, digital sensors, and plans to send measurements to an app.","Трубка Вентури":"Venturi tube","Сужение трубки создаёт перепад давления. Цифровой датчик регистрирует его, чтобы оценить скорость воздушного потока.":"The tube's narrowing creates a pressure difference. A digital sensor records it to estimate airflow speed.","ESP32 и BME280":"ESP32 and BME280","ESP32 обрабатывает сигнал. Измерения температуры, влажности и давления с BME280 нужны для поправки объёма по BTPS.":"The ESP32 processes the signal. Temperature, humidity, and pressure readings from the BME280 are used for BTPS volume correction.","Веб-интерфейс":"Web interface","По Bluetooth измерения планируется передавать в приложение. Модель машинного обучения будет анализировать форму кривой, а интерфейс покажет качество попытки.":"Measurements are planned to be sent to the app over Bluetooth. A machine learning model will analyze the curve, and the interface will show attempt quality.","Целевая стоимость компонентов портативного прототипа":"Target component cost for the portable prototype","Четыре недели до прототипа":"Four weeks to a prototype","План работ из проектного документа ASPIRO.":"Schedule from the ASPIRO project brief.","Неделя 1":"Week 1","Детали и 3D-модель":"Parts and 3D model","Подобрать компоненты, спроектировать и напечатать трубку Вентури.":"Select components, design, and print the Venturi tube.","Неделя 2":"Week 2","Прошивка и калибровка":"Firmware and calibration","Настроить сбор сигнала и сверить объём по калибровочному шприцу.":"Set up signal collection and check volume against a calibration syringe.","Неделя 3":"Week 3","Анализ кривых":"Curve analysis","Подготовить открытые данные спирометрии и обучить модель анализа формы кривой.":"Prepare open spirometry data and train a model to analyze curve patterns.","Неделя 4":"Week 4","Интеграция и испытания":"Integration and testing","Связать устройство с приложением и проверить весь путь измерения.":"Connect the device to the app and test the full measurement flow.","ASPIRO — на главную":"ASPIRO — home","ASPIRO — наверх":"ASPIRO — back to top","Исследовательский проект по портативной спирометрии":"Research project on portable spirometry","Контактные данные":"Contact details","Школа NIS IB":"NIS IB School","Астана, Казахстан":"Astana, Kazakhstan","Email:":"Email:"};
  const button = document.querySelector('#language-toggle');
  const storageKey = 'aspiro-language';
  const attrTranslations = [
    ['.skip', 'aria-label', 'К содержанию', 'Skip to content'],
    ['.main-nav', 'aria-label', 'Навигация по сайту', 'Site navigation'],
    ['.overview', 'aria-label', 'Возможности проекта', 'Project capabilities'],
    ['#demo-run', 'aria-label', 'Воспроизвести кривую', 'Play the curve'],
    ['#demo-reset', 'aria-label', 'Сбросить воспроизведение', 'Reset playback'],
    ['#demo-progress', 'aria-label', 'Ход воспроизведения', 'Playback progress'],
    ['.hero-visual img', 'alt', 'Концепт: белый портативный спирометр с экраном и графитовым мундштуком', 'Concept: a white portable spirometer with a display and graphite mouthpiece'],
    ['.brand[href="#top"]', 'aria-label', 'ASPIRO — на главную', 'ASPIRO — home'],
    ['.footer-inner .brand', 'aria-label', 'ASPIRO — наверх', 'ASPIRO — back to top']
  ];
  function setLanguage(language) {
    const english = language === 'en';
    document.documentElement.lang = english ? 'en' : 'ru';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue.trim();
      if (translations[original]) node.nodeValue = node.nodeValue.replace(original, english ? translations[original] : reverse[translations[original]] || original);
    }
    document.title = english ? 'ASPIRO — portable spirometry' : 'ASPIRO — портативная спирометрия';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = english
      ? 'ASPIRO — a portable spirometer and web interface for exploring lung function. Interactive demo with synthetic data.'
      : 'ASPIRO — проект портативного спирометра и веб-интерфейса для наблюдения за функцией лёгких. Интерактивное демо на синтетических данных.';
    for (const [selector, attr, ru, en] of attrTranslations) {
      const element = document.querySelector(selector);
      if (element) element.setAttribute(attr, english ? en : ru);
    }
    if (button) {
      button.textContent = english ? 'RU' : 'EN';
      button.setAttribute('aria-label', english ? 'Переключить язык на русский' : 'Switch language to English');
    }
    localStorage.setItem(storageKey, english ? 'en' : 'ru');
    window.dispatchEvent(new CustomEvent('aspiro-language-change', { detail: { language: english ? 'en' : 'ru' } }));
  }
  const reverse = Object.fromEntries(Object.entries(translations).map(([ru,en]) => [en,ru]));
  button?.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'ru' : 'en'));
  const saved = localStorage.getItem(storageKey);
  setLanguage(saved === 'en' ? 'en' : 'ru');
})();