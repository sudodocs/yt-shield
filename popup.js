const DEFAULTS = { blockAds: true, autoSkip: true, removeEndCards: true, autoRefresh: true };
const KEYS = Object.keys(DEFAULTS);

function loadAll() {
  chrome.storage.local.get(null, (all) => {
    if (chrome.runtime.lastError) return;
    setStats(all.adsBlocked || 0, all.refreshes || 0, all.cardsRemoved || 0);
    KEYS.forEach(key => {
      const el = document.getElementById(key);
      if (el) el.checked = (key in all) ? all[key] : DEFAULTS[key];
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadAll();

  KEYS.forEach(key => {
    const row = document.getElementById('row-' + key);
    const checkbox = document.getElementById(key);
    if (row) row.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      chrome.storage.local.set({ [key]: checkbox.checked });
    });
    if (checkbox) {
      checkbox.addEventListener('click', e => e.stopPropagation());
      checkbox.addEventListener('change', () => {
        chrome.storage.local.set({ [key]: checkbox.checked });
      });
    }
  });
  });
});
