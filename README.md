# 🛡️ YT Shield – Auto-Refresh for YouTube

A lightweight Chrome/Brave extension that automatically refreshes YouTube when ad-blocker detection causes a blank video or playback error — no manual refresh needed.

![Version](https://img.shields.io/badge/version-1.1.0-red)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## The Problem

YouTube detects ad-blockers and responds by blanking the video player while still playing ad audio in the background, or showing a "An error occurred, please try again" message. The only fix is to manually refresh the page — every single time a new video starts.

**YT Shield automates that refresh for you.**

---

## Features

| Feature | What it does |
|---|---|
| 🔄 **Auto-Refresh on Error** | Detects YouTube's error overlay and refreshes automatically |
| 📺 **Blank Video Detection** | Detects when the video player is blank and refreshes |
| ⏸️ **Frozen Video Detection** | Detects stuck/frozen playback and refreshes |
| 🔁 **SPA Navigation Aware** | Resets correctly when you click to a new video |

---

## Installation

### From Chrome Web Store *(pending approval)*
Search for **YT Shield** on the [Chrome Web Store](https://chromewebstore.google.com).

### Manual (Developer Mode)
1. Download and unzip this repository
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the unzipped folder
5. Navigate to YouTube — YT Shield is active

---

## How it works

YT Shield polls the YouTube page every 3 seconds looking for:
- YouTube's error overlay (`.ytp-error`, `.ytd-player-error-message-renderer`)
- A blank video player with no content loading
- A video that has stopped progressing for more than 12 seconds

When any of these are detected, it waits 4 seconds (shows a toast notification) then refreshes the page. It will auto-refresh up to 5 times per session to avoid infinite loops.

---

## Browser Compatibility

| Browser | Status |
|---|---|
| Chrome 88+ | ✅ Full support |
| Brave | ✅ Full support |
| Edge | ✅ Full support |
| Opera | ✅ Full support |
| Firefox | ❌ Different extension API (not supported) |

---

## Permissions

| Permission | Reason |
|---|---|
| `tabs` | Detect YouTube page navigation to reset the refresh counter |
| `storage` | Save the on/off toggle preference |

---

## File Structure

```
yt-shield-extension/
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Auto-refresh detection logic
├── background.js       # Service worker — initialises storage defaults
├── popup.html          # Extension popup UI
├── popup.js            # Popup toggle logic
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── privacy-policy.html # Privacy policy
└── README.md
```

---

## Privacy

YT Shield collects **zero data**. No analytics, no telemetry, no external servers. Your toggle preference is stored locally in your browser only.

See the full [Privacy Policy](privacy-policy.html).

---

## License

MIT — free to use, modify, and distribute.

---

## Author

Built by [Saurabh Sugandh (SudoDocs)](https://github.com/SudoDocs) out of frustration with having to manually refresh YouTube every time a video errored out.

---

*YT Shield is not affiliated with YouTube, Google, or Alphabet Inc.*
