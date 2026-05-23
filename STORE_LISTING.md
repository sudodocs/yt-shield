# YT Shield – Chrome Web Store Listing Assets

---

## Extension Name
YT Shield – Ad Blocker & Auto-Refresh

## Short Description (132 chars max)
Blocks YouTube ads, removes end cards & overlays, and auto-refreshes when video errors occur. Works on Chrome and Brave.

---

## Full Description (for Chrome Web Store)

**YT Shield** is a lightweight YouTube enhancement extension that does four things really well:

🚫 **Block Ads**
Blocks YouTube ads at the network level before they load, and hides ad DOM elements so your viewing experience stays clean. No pre-rolls, no mid-rolls, no banner ads.

⏭️ **Auto-Skip Ads**
If a skippable ad does appear, YT Shield clicks the skip button the moment it becomes available. For unskippable short ads, it fast-forwards through them automatically.

🃏 **Remove End Cards & Overlays**
Hides the clickable end-screen cards, info card teasers, branding overlays, and channel watermarks that cover the video at the end. Watch the full video without distractions.

🔄 **Auto-Refresh on Error**
When YouTube detects an ad-blocker and shows a playback error ("An error occurred, please try again"), YT Shield automatically refreshes the page so your video resumes without any manual action.

**Toggle each feature individually** from the popup — you're in full control.

---

**Why YT Shield?**
Brave browser users have built-in ad blocking, but Chrome users don't. YT Shield fills that gap specifically for YouTube, staying lightweight and focused instead of trying to be a full-page ad blocker.

**Privacy first** — YT Shield collects zero data. It has no analytics, no tracking, and no external servers. Everything runs locally in your browser.

---

## Category
Productivity

## Tags / Keywords
youtube, ad blocker, youtube ads, skip ads, end cards, auto refresh, youtube enhancer, no ads, youtube cleaner

---

## Permissions Justification (needed during submission)

| Permission | Reason |
|---|---|
| `tabs` | Needed to detect YouTube tab navigation for auto-refresh logic |
| `scripting` | Needed to inject the content script that removes DOM ad elements |
| `storage` | Needed to save your toggle preferences (on/off per feature) |
| `declarativeNetRequest` | Needed to block ad network requests before they load |
| `*://*.youtube.com/*` | The extension only operates on YouTube |
| `*://*.doubleclick.net/*` etc. | Required to block ad tracking network requests |

---

## Pricing
Free

## Developer Notes
- Built with Manifest V3 (the current Chrome extension standard)
- No background service worker needed for core features
- Compatible with Chrome 88+ and all Chromium-based browsers (Brave, Edge, Opera, Vivaldi)
