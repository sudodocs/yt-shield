// YT Shield – content.js
// Single purpose: auto-refresh YouTube when ad-blocker detection
// causes a blank video or playback error.

(function () {
  "use strict";

  const CONFIG = {
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
  function showToast(msg) {
    document.getElementById("yts-toast")?.remove();
    const t = document.createElement("div");
    t.id = "yts-toast";
    t.style.cssText = `
      position:fixed;bottom:80px;right:24px;background:#212121;color:#fff;
      font-family:Roboto,Arial,sans-serif;font-size:13px;
      padding:11px 18px;border-radius:8px;z-index:2147483647;
      box-shadow:0 4px 16px rgba(0,0,0,.35);display:flex;align-items:center;
      gap:10px;max-width:300px;animation:yts_in .25s ease;
    `;
    const s = document.createElement("style");
    s.textContent = "@keyframes yts_in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";
    document.head?.appendChild(s);
    t.innerHTML = `<span style="font-size:18px">🔄</span><span>${msg}</span>`;
    document.body?.appendChild(t);
    setTimeout(() => t.remove(), CONFIG.refreshDelay + 1000);
  }

  // ── Schedule a page refresh ────────────────────────────────────────────
  function scheduleRefresh(reason) {
    if (isRefreshScheduled) return;
    if (refreshCount >= CONFIG.maxRefreshes) return;
    isRefreshScheduled = true;
    refreshCount++;
    console.log(`[YT Shield] Refresh #${refreshCount}: ${reason}`);
    showToast(`Video error detected — refreshing in 4s… (${refreshCount}/${CONFIG.maxRefreshes})`);
    setTimeout(() => window.location.reload(), CONFIG.refreshDelay);
  }

  // ── Detect YouTube error overlays ──────────────────────────────────────
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
        const txt = (el.innerText || "").toLowerCase();
        if (!txt.includes("unavailable") && !txt.includes("private")) {
          scheduleRefresh("error overlay detected");
          return;
        }
      }
    }
  }

  // ── Detect blank video (ad-blocker detection causes white/blank player) ─
  function checkBlankVideo() {
    const video = document.querySelector("video");
    if (!video) return;
    if (video.paused || video.ended) return;

    // Video is "playing" but has no visible content — readyState 0 or 1
    if (video.readyState < 2 && video.currentTime === 0) {
      if (!stuckTimer) {
        stuckTimer = setTimeout(() => {
          scheduleRefresh("blank video detected");
          stuckTimer = null;
        }, CONFIG.stuckThreshold);
      }
    } else {
      clearTimeout(stuckTimer);
      stuckTimer = null;
    }
  }

  // ── Detect stuck / frozen video ────────────────────────────────────────
  function checkVideoStuck() {
    const video = document.querySelector("video");
    if (!video || video.paused || video.ended || video.readyState === 0) return;

    const now = Date.now();
    if (now - lastTimeCheck >= 5000) {
      const delta = video.currentTime - lastCurrentTime;
      if (delta < 0.5 && video.readyState < 3) {
        if (!stuckTimer) {
          stuckTimer = setTimeout(() => {
            scheduleRefresh("video frozen");
            stuckTimer = null;
          }, CONFIG.stuckThreshold);
        }
      } else {
        clearTimeout(stuckTimer);
        stuckTimer = null;
      }
      lastCurrentTime = video.currentTime;
      lastTimeCheck = now;
    }
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
    }
  }).observe(document, { subtree: true, childList: true });

  // ── Main polling loop ──────────────────────────────────────────────────
  function poll() {
    if (isRefreshScheduled) return;
    checkErrorOverlay();
    checkBlankVideo();
    checkVideoStuck();
  }

  setInterval(poll, CONFIG.checkInterval);
  console.log("[YT Shield] Auto-refresh active.");
})();
