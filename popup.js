document.addEventListener('DOMContentLoaded', async () => {
  const defaultSettings = {
    tcColorMain: '#cc0000', tcColorStart: '#800000', tcColorEnd: '#ffcc00',
    tcFloatingBar: true, tcCleanUi: true, tcProgressBar: true,
    tcHideWatermark: false, tcHideEndCards: false, tcHideAutoplay: false,
    tcMiniPlayerGlass: true, tcAlwaysShowBar: false, tcCinematicSubs: true,
    tcAnimations: true, tcAmbientGlow: true, tcBouncyMenu: true, tcPulsingScrubber: true,
    tcHideComments: false, tcHideRelated: false, tcHideShorts: false, tcHideChat: false, tcHideHeader: false
  };

  const inputs = {
    tcColorMain: document.getElementById('color-main'),
    tcColorStart: document.getElementById('color-start'),
    tcColorEnd: document.getElementById('color-end')
  };

  const toggles = [
    'tcFloatingBar', 'tcCleanUi', 'tcProgressBar', 'tcAlwaysShowBar', 'tcCinematicSubs', 'tcMiniPlayerGlass',
    'tcAnimations', 'tcAmbientGlow', 'tcBouncyMenu', 'tcPulsingScrubber',
    'tcHideEndCards', 'tcHideWatermark', 'tcHideAutoplay', 'tcHideComments', 'tcHideRelated', 'tcHideShorts', 'tcHideChat', 'tcHideHeader'
  ];

  toggles.forEach(id => inputs[id] = document.getElementById(id));

  const updatePopupTheme = (mainColor) => {
    document.documentElement.style.setProperty('--tc-color-main', mainColor);
  };

  const loadSettings = () => {
    chrome.storage.sync.get(Object.keys(defaultSettings), (result) => {
      for (let key in inputs) {
        if (!inputs[key]) continue;
        let val = result[key] !== undefined ? result[key] : defaultSettings[key];
        
        if (inputs[key].type === 'color') {
          inputs[key].value = val;
          if (key === 'tcColorMain') updatePopupTheme(val);
        } else {
          inputs[key].checked = val;
        }
      }
    });
  };

  const saveSetting = (key, value) => {
    chrome.storage.sync.set({ [key]: value });
  };

  for (let key in inputs) {
    if (!inputs[key]) continue;
    if (inputs[key].type === 'color') {
      inputs[key].addEventListener('input', (e) => {
        if (key === 'tcColorMain') updatePopupTheme(e.target.value);
        saveSetting(key, e.target.value);
      });
    } else {
      inputs[key].addEventListener('change', (e) => saveSetting(key, e.target.checked));
    }
  }

  // --- Reset to Defaults ---
  const confirmOverlay = document.getElementById('confirm-overlay');
  const confirmCancel = document.getElementById('confirm-cancel');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmTitle = document.getElementById('confirm-title');
  const confirmDesc = document.getElementById('confirm-desc');

  const confirmTexts = {
    en: { title: "Reset Settings", desc: "Are you sure you want to revert all settings to factory defaults?", cancel: "Cancel", confirm: "Reset" },
    tr: { title: "Ayarları Sıfırla", desc: "Tüm ayarları fabrikaya döndürmek istediğinize emin misiniz?", cancel: "İptal", confirm: "Sıfırla" },
    az: { title: "Ayarları Sıfırla", desc: "Bütün parametrləri sıfırlamaq istədiyinizə əminsiniz?", cancel: "Ləğv et", confirm: "Sıfırla" },
    kk: { title: "Баптауларды қалпына келтіру", desc: "Барлық баптауларды зауыттық күйге қайтаруға сенімдісіз бе?", cancel: "Болдырмау", confirm: "Қалпына келтіру" },
    uz: { title: "Sozlamalarni tiklash", desc: "Barcha sozlamalarni zavod holatiga qaytarishga ishonchingiz komilmi?", cancel: "Bekor qilish", confirm: "Tiklash" },
    tk: { title: "Sazlamalary başky ýagdaýa gaýtar", desc: "Ähli sazlamalary asyl ýagdaýyna gaýtarmak isleýändigiňize ynamyňyz barmy?", cancel: "Ýatyrmak", confirm: "Gaýtar" },
    ky: { title: "Жөндөөлөрдү калыбына келтирүү", desc: "Бардык жөндөөлөрдү баштапкы абалга келтирүүгө ишенесизби?", cancel: "Жокко чыгаруу", confirm: "Калыбына келтирүү" },
    ug: { title: "تەڭشەكلەرنى ئەسلىگە قايتۇرۇش", desc: "بارلىق تەڭشەكلەرنى زاۋۇت ھالىتىگە قايتۇرۇشقا جەزملەشتۈرەمسىز؟", cancel: "بىكار قىلىش", confirm: "ئەسلىگە قايتۇرۇش" },
    tt: { title: "Көйләүләрне кире кайтару", desc: "Барлык көйләүләрне гадәти хәлгә кайтарырга теләвегезгә инанасызмы?", cancel: "Баш тарту", confirm: "Кайтару" },
    ru: { title: "Сброс настроек", desc: "Вы уверены, что хотите сбросить все настройки по умолчанию?", cancel: "Отмена", confirm: "Сброс" },
    es: { title: "Restablecer", desc: "¿Está seguro de que desea restablecer todas las configuraciones a los valores de fábrica?", cancel: "Cancelar", confirm: "Restablecer" },
    hi: { title: "सेटिंग्स रीसेट करें", desc: "क्या आप वाकई सभी सेटिंग्स को फ़ैक्टरी डिफ़ॉल्ट पर वापस लाना चाहते हैं?", cancel: "रद्द करें", confirm: "रीसेट" },
    th: { title: "รีเซ็ตการตั้งค่า", desc: "คุณแน่ใจหรือไม่ว่าต้องการคืนค่าการตั้งค่าทั้งหมดเป็นค่าเริ่มต้นจากโรงงาน?", cancel: "ยกเลิก", confirm: "รีเซ็ต" }
  };

  document.getElementById('reset-btn').addEventListener('click', () => {
    const texts = confirmTexts[i18n.currentLang] || confirmTexts['en'];
    confirmTitle.innerText = texts.title;
    confirmDesc.innerText = texts.desc;
    confirmCancel.innerText = texts.cancel;
    confirmYes.innerText = texts.confirm;
    confirmOverlay.style.display = 'flex';
  });

  confirmCancel.addEventListener('click', () => {
    confirmOverlay.style.display = 'none';
  });

  confirmYes.addEventListener('click', () => {
    chrome.storage.sync.set(defaultSettings, () => {
      loadSettings(); // Reload UI
      confirmOverlay.style.display = 'none';
    });
  });

  // --- i18n & Language Selection Logic ---
  const lang = await i18n.init();
  const langOverlay = document.getElementById('lang-overlay');
  const mainUi = document.getElementById('main-ui');
  
  if (!lang) {
    // First time opening popup and no lang selected from welcome page
    langOverlay.style.display = 'flex';
  } else {
    mainUi.style.display = 'flex';
  }

  // Language Modal Logic
  let selectedLang = i18n.currentLang;
  const langBtns = document.querySelectorAll('.lang-btn');
  
  langBtns.forEach(btn => {
    if (btn.getAttribute('data-lang') === selectedLang) btn.classList.add('active');
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLang = btn.getAttribute('data-lang');
    });
  });

  document.getElementById('save-lang-btn').addEventListener('click', () => {
    i18n.setLang(selectedLang);
    langOverlay.style.display = 'none';
    mainUi.style.display = 'flex';
  });

  document.getElementById('change-lang-btn').addEventListener('click', () => {
    langOverlay.style.display = 'flex';
    mainUi.style.display = 'none';
  });

  loadSettings();
});
