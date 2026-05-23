# 🛡️ YT Shield – Ad Blocker & Auto-Refresh

A lightweight Chrome/Brave extension that blocks YouTube ads, removes end cards, and auto-refreshes when video errors occur.

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

| Feature | What it does |
|---|---|
| 🚫 **Block Ads** | Network-level + DOM blocking of YouTube ads |
| ⏭️ **Auto-Skip** | Instantly clicks skip button; fast-forwards unskippable ads |
| 🃏 **Remove End Cards** | Hides end screens, info cards, branding overlays |
| 🔄 **Auto-Refresh** | Detects playback errors and refreshes automatically |

All features can be toggled individually from the popup.

---

## Installation

### From Chrome Web Store *(coming soon)*
Search for **YT Shield** on the [Chrome Web Store](https://chromewebstore.google.com).

### Manual (Developer Mode)
1. Download and unzip this repository
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the unzipped folder
5. Navigate to YouTube — YT Shield is active

---

## How it works

**Ad blocking** uses two layers:
1. `declarativeNetRequest` rules block ad network requests before they reach the browser
2. A content script + CSS hides any remaining ad DOM elements

**Auto-refresh** polls the page every 3 seconds for YouTube's error overlay and monitors whether the video is progressing. If the video is stuck for 12+ seconds or an error overlay appears, it schedules a refresh (up to 5 times per session).

**End card removal** uses a MutationObserver to catch and remove YouTube's `.ytp-ce-element` and related nodes as soon as they appear in the DOM.

---

## Browser Compatibility

| Browser | Status |
|---|---|
| Chrome 88+ | ✅ Full support |
| Brave | ✅ Full support |
| Edge | ✅ Full support |
| Opera | ✅ Full support |
| Firefox | ❌ Uses different extension API (not supported) |

---

## Privacy

YT Shield collects **zero data**. No analytics, no telemetry, no external servers.  
See the full [Privacy Policy](privacy-policy.html).

---

## File Structure

```
yt-shield-extension/
├── manifest.json       # Extension config (Manifest V3)
├── rules.json          # declarativeNetRequest ad-blocking rules
├── content.js          # Main content script (skip, refresh, remove)
├── content.css         # CSS hiding rules for ad elements
├── popup.html          # Extension popup with toggles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── STORE_LISTING.md    # Chrome Web Store copy
├── privacy-policy.html # Privacy policy (host on GitHub Pages)
└── README.md
```

---

## License

MIT — free to use, modify, and distribute.

---

## Contributing

Pull requests welcome. If YouTube updates their ad delivery and something breaks, open an issue with the CSS selector or network request that needs blocking.

---

*YT Shield is not affiliated with YouTube, Google, or Alphabet Inc.*
