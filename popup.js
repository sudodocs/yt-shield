document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('autoRefresh');

  // Load saved state
  chrome.storage.local.get({ autoRefresh: true }, (s) => {
    checkbox.checked = s.autoRefresh;
  });

  // Save on change
  checkbox.addEventListener('change', () => {
    chrome.storage.local.set({ autoRefresh: checkbox.checked });
  });
});
