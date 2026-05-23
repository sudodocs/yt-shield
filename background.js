const DEFAULTS = {
  blockAds: true,
  autoSkip: true,
  removeEndCards: true,
  autoRefresh: true,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(Object.keys(DEFAULTS), (stored) => {
    const toWrite = {};
    for (const key in DEFAULTS) {
      if (!(key in stored)) toWrite[key] = DEFAULTS[key];
    }
    if (Object.keys(toWrite).length > 0) chrome.storage.local.set(toWrite);
  });
});
