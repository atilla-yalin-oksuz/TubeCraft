document.addEventListener('DOMContentLoaded', async () => {
  const langOverlay = document.getElementById('lang-overlay');
  const mainUi = document.getElementById('main-ui');

  // Init language. If none, show overlay
  const lang = await i18n.init();

  if (!lang) {
    langOverlay.style.display = 'flex';
  } else {
    mainUi.style.display = 'block';
  }

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
    mainUi.style.display = 'block';
  });

  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.location.href = 'https://www.youtube.com';
    });
  }
});
