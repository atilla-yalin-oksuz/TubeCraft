// TubeCraft Next-Gen Engine
console.log("TubeCraft: Pro engine loaded.");

const defaultSettings = {
  // Theme Colors
  tcColorMain: '#cc0000',
  tcColorStart: '#800000',
  tcColorEnd: '#ffcc00',
  // Player UI
  tcFloatingBar: true,
  tcCleanUi: true,
  tcProgressBar: true,
  tcHideWatermark: false,
  tcHideEndCards: false,
  tcHideAutoplay: false,
  tcMiniPlayerGlass: true,
  tcAlwaysShowBar: false,
  tcCinematicSubs: true,
  // Animations
  tcAnimations: true,
  tcAmbientGlow: true,
  tcBouncyMenu: true,
  tcPulsingScrubber: true,
  // Distraction Free
  tcHideComments: false,
  tcHideRelated: false,
  tcHideShorts: false,
  tcHideChat: false,
  tcHideHeader: false
};

let settings = { ...defaultSettings };

// Init logic
chrome.storage.sync.get(Object.keys(settings), (result) => {
  for (let key in settings) {
    if (result[key] !== undefined) settings[key] = result[key];
  }
  applySettings();
});

// Real-time listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    for (let key in settings) {
      if (changes[key]) settings[key] = changes[key].newValue;
    }
    applySettings();
  }
});

const applySettings = () => {
  const body = document.body;
  if (!body) return;

  // Apply colors as CSS variables globally
  document.documentElement.style.setProperty('--tc-color-main', settings.tcColorMain);
  document.documentElement.style.setProperty('--tc-color-start', settings.tcColorStart);
  document.documentElement.style.setProperty('--tc-color-end', settings.tcColorEnd);

  // Apply toggle classes
  const classes = {
    'tc-floating-bar-active': settings.tcFloatingBar,
    'tc-clean-ui-active': settings.tcCleanUi,
    'tc-progress-bar-active': settings.tcProgressBar,
    'tc-hide-watermark-active': settings.tcHideWatermark,
    'tc-hide-end-cards-active': settings.tcHideEndCards,
    'tc-hide-autoplay-active': settings.tcHideAutoplay,
    'tc-mini-player-glass-active': settings.tcMiniPlayerGlass,
    'tc-always-show-bar-active': settings.tcAlwaysShowBar,
    'tc-cinematic-subs-active': settings.tcCinematicSubs,
    'tc-animations-active': settings.tcAnimations,
    'tc-ambient-glow-active': settings.tcAmbientGlow,
    'tc-bouncy-menu-active': settings.tcBouncyMenu,
    'tc-pulsing-scrubber-active': settings.tcPulsingScrubber,
    'tc-hide-comments-active': settings.tcHideComments,
    'tc-hide-related-active': settings.tcHideRelated,
    'tc-hide-shorts-active': settings.tcHideShorts,
    'tc-hide-chat-active': settings.tcHideChat,
    'tc-hide-header-active': settings.tcHideHeader
  };

  for (let className in classes) {
    body.classList.toggle(className, classes[className]);
  }
};

setInterval(applySettings, 2000); // Safety loop for SPA navigation

const initTubeCraft = () => {
  const player = document.querySelector('.html5-video-player');
  if (player && !player.classList.contains('tubecraft-initialized')) {
    player.classList.add('tubecraft-initialized');
    
    // Play/Pause listener for glowing effects
    const videoElement = player.querySelector('video');
    if (videoElement) {
      videoElement.addEventListener('play', () => player.classList.add('playing-mode'));
      videoElement.addEventListener('pause', () => player.classList.remove('playing-mode'));
      if (!videoElement.paused) player.classList.add('playing-mode');
    }
  }
};

const observer = new MutationObserver(() => {
  if (window.location.pathname.includes('/watch')) {
    initTubeCraft();
    applySettings();
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
