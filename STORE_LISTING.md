# YT Shield – Chrome Web Store Listing Assets

---

## Extension Name
YT Shield – Auto-Refresh for YouTube

## Short Description (132 chars max)
Automatically refreshes YouTube when ad-blocker detection causes a blank video or playback error. No more manual refreshing.

---

## Full Description (for Chrome Web Store)

**Tired of refreshing YouTube manually every time the video goes blank?**

YouTube detects ad-blockers and responds by blanking the video player — sometimes playing ad audio in the background — or showing a "An error occurred, please try again" message. The only fix is to manually refresh the page, every single time.

**YT Shield fixes this automatically.**

🔄 **Auto-Refresh on Error**
Detects YouTube's playback error overlay and refreshes the page automatically so your video resumes without any action from you.

📺 **Blank Video Detection**
Detects when the video player loads blank (YouTube's ad-blocker punishment) and triggers a refresh before you even notice.

⏸️ **Frozen Video Detection**
If your video stops progressing for more than 12 seconds, YT Shield refreshes the page to get it going again.

**Simple, focused, and private.**
One toggle. No ads. No data collection. No bloat. Just the one thing it's supposed to do, done well.

---

## Category
Productivity

## Tags / Keywords
youtube, auto refresh, youtube error, ad blocker fix, youtube blank video, playback error, youtube refresh, youtube fix

---

## Permissions Justification (needed during submission)

| Permission | Reason |
|---|---|
| `tabs` | Detects YouTube SPA navigation so the auto-refresh counter resets correctly when the user clicks to a new video |
| `storage` | Saves the user's on/off toggle preference locally in their browser |
| `*://*.youtube.com/*` | Required to run the content script on YouTube pages to monitor the video player for blank screens, playback errors, and frozen video in order to trigger an automatic page refresh |

---

## Single Purpose Description
YT Shield automatically refreshes YouTube when ad-blocker detection causes a blank video player or playback error, eliminating the need to manually refresh the page.

---

## Privacy
YT Shield collects no user data. No browsing history, no watch history, no personal identifiers. The only data stored is the user's on/off preference, saved locally using Chrome's storage API.

---

## Pricing
Free

## Publisher
SudoDocs (Saurabh Sugandh)

## Developer Notes
- Built with Manifest V3
- Only 2 permissions: `tabs` and `storage`
- No background network requests
- No remote code execution
- Compatible with Chrome 88+ and all Chromium-based browsers
