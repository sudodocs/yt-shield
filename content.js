// YT Shield – content.js
// Handles: video ad skipping, end card removal, auto-refresh on error,
//          stuck-video detection, and per-feature toggle support.

(function () {
  "use strict";

  // ── Default settings (synced with popup toggles) ────────────────────────
  const DEFAULTS = {
    blockAds: true,
    removeEndCards: true,
    autoRefresh: true,
    autoSkip: true,
  };

  let settings = { ...DEFAULTS };

  // Load saved settings from local storage
  chrome.storage.local.get(Object.keys(DEFAULTS), (saved) => {
    settings = { ...DEFAULTS, ...saved };
  });

  // Listen for toggle updates from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const key in changes) {
      if (key in settings) settings[key] = changes[key].newValue;
    }
  });

  // ── Auto-refresh config ────────────────────────────────────────────────
  const R = {
    checkInterval: 3000,
    refreshDelay: 4000,
    stuckThreshold: 12000,
    maxRefreshes: 5,
  };

  let refreshCount = 0;
  let lastCurrentTime = 0;
  let lastTimeCheck = Date.now();
  let isRefreshScheduled = false;
  let stuckTimer = null;

  // ── Toast notification ─────────────────────────────────────────────────
  function showToast(msg, color = "#212121") {
    document.getElementById("yts-toast")?.remove();
    const t = document.createElement("div");
    t.id = "yts-toast";
    t.style.cssText = `
      position:fixed;bottom:80px;right:24px;background:${color};color:#fff;
      font-family:YouTube Noto,Roboto,Arial,sans-serif;font-size:13px;
      padding:11px 18px;border-radius:8px;z-index:2147483647;
      box-shadow:0 4px 16px rgba(0,0,0,.35);display:flex;align-items:center;
      gap:10px;max-width:300px;animation:yts_in .25s ease;
    `;
    const s = document.createElement("style");
    s.textContent = "@keyframes yts_in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";
    document.head?.appendChild(s);
    t.innerHTML = `<span style="font-size:18px">${color === "#c00" ? "🛡️" : "🔄"}</span><span>${msg}</span>`;
    document.body?.appendChild(t);
    setTimeout(() => t.remove(), R.refreshDelay + 1000);
  }

  // ── Auto-skip ad button ────────────────────────────────────────────────
  function trySkipAd() {
    if (!settings.autoSkip) return;
    const skipBtn = document.querySelector(
      ".ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button"
    );
    if (skipBtn) {
      skipBtn.click();
      console.log("[YT Shield] Ad skipped.");
      return true;
    }

    // Speed through unskippable ads
    const video = document.querySelector("video");
    if (video && document.querySelector(".ad-showing")) {
      video.playbackRate = 16;
      video.currentTime = video.duration - 0.1;
    }
    return false;
  }

  // ── Auto-refresh logic ─────────────────────────────────────────────────
  function scheduleRefresh(reason) {
    if (!settings.autoRefresh || isRefreshScheduled) return;
    if (refreshCount >= R.maxRefreshes) return;
    isRefreshScheduled = true;
    refreshCount++;
    console.log(`[YT Shield] Refresh #${refreshCount}: ${reason}`);
    showToast(`Video error detected — refreshing in 4s… (${refreshCount}/${R.maxRefreshes})`);
    setTimeout(() => window.location.reload(), R.refreshDelay);
  }

  function checkErrorOverlay() {
    const selectors = [
      ".ytp-error",
      ".ytp-error-content",
      "[class*='ytp-error']",
      ".ytd-player-error-message-renderer",
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        const txt = el.innerText || "";
        if (!txt.includes("unavailable") && !txt.includes("private")) {
          scheduleRefresh("error overlay");
          return;
        }
      }
    }
  }

  function checkVideoStuck() {
    const video = document.querySelector("video");
    if (!video || video.paused || video.ended || video.readyState === 0) return;
    if (document.querySelector(".ad-showing")) return; // skip during ads

    const now = Date.now();
    if (now - lastTimeCheck >= 5000) {
      const delta = video.currentTime - lastCurrentTime;
      if (delta < 0.5 && video.readyState < 3) {
        if (!stuckTimer) {
          stuckTimer = setTimeout(() => {
            scheduleRefresh("video frozen");
            stuckTimer = null;
          }, R.stuckThreshold);
        }
      } else {
        clearTimeout(stuckTimer);
        stuckTimer = null;
      }
      lastCurrentTime = video.currentTime;
      lastTimeCheck = now;
    }
  }

  // ── DOM element removal (end cards, overlays) ──────────────────────────
  const REMOVE_SELECTORS = [
    ".ytp-ce-element",
    ".ytp-ce-covering-overlay",
    ".ytp-endscreen-content",
    ".ytp-cards-teaser",
    ".iv-branding",
    ".ytp-watermark",
    "ytd-mealbar-promo-renderer",
    "ytd-merch-shelf-renderer",
  ];

  function removeClutter() {
    if (!settings.removeEndCards) return;
    REMOVE_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    });
  }

  // ── MutationObserver for dynamic DOM changes ───────────────────────────
  const observer = new MutationObserver(() => {
    if (settings.blockAds) trySkipAd();
    if (settings.removeEndCards) removeClutter();
  });

  function startObserver() {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── SPA navigation reset ───────────────────────────────────────────────
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      isRefreshScheduled = false;
      lastCurrentTime = 0;
      lastTimeCheck = Date.now();
      clearTimeout(stuckTimer);
      stuckTimer = null;
      // Don't reset refreshCount — carry across navigation
    }
  }).observe(document, { subtree: true, childList: true });

  // ── Polling loop ───────────────────────────────────────────────────────
  function poll() {
    if (settings.blockAds) trySkipAd();
    if (!isRefreshScheduled) {
      checkErrorOverlay();
      checkVideoStuck();
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────
  function init() {
    startObserver();
    setInterval(poll, R.checkInterval);
    console.log("[YT Shield] Active.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
