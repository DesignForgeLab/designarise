# Responsive verification — 9 September 2026

## Layout audit

The running site was checked in the Codex Chromium browser at these viewport sizes:

| Layout | Viewport sizes |
| --- | --- |
| Small/mobile | 320×568, 360×800, 375×812, 390×844, 414×896, 430×932 |
| Tablet/portrait | 768×1024, 820×1180, 1024×1366 |
| Desktop | 1024×768, 1280×720, 1440×900, 1920×1080 |
| Phone landscape | 667×375 |

Across these sizes, the document had no horizontal overflow. The DOM geometry audit found no internal horizontal text overflow in primary headings, section descriptions, service summaries, project metadata, process text, about copy, CTA groups, or the footer. Mobile layouts use document flow rather than masking a misplaced desktop device with global overflow hiding.

## Interaction checks

- Desktop hero initial and scrolled states were visually inspected. The device clears the messaging and CTA.
- Showcase selection updates the displayed concept and pressed state.
- Full-screen mobile menu opens, closes with Escape, navigates to sections, and opens the project dialog.
- Mobile form was completed with test data and produced the local download confirmation.
- Services open by click/tap; project artwork and explicit case-study links open dialogs.
- Reduced-motion mode removes the pinned hero and leaves all reveal content visible.
- Touch-target audit covers visible links, buttons, and service summaries, with a 44px minimum target.
- Local assets, correct MIME types, HEAD responses, security headers, disallowed methods, and denial of source/configuration paths are covered by the automated server test.
- JavaScript syntax and the static build are checked locally.

## Limits and launch requirements

Browser viewport testing is not a substitute for physical iPhone, Android, iPad, or Safari testing. Hardware frame rates, real network conditions, screen-reader announcements, and Core Web Vitals have not been independently measured. The OS media-query path is implemented, and the shared reduced-motion behavior was exercised using the on-page control.

This is a deployable static concept website. Actual agency content and live inquiry delivery still need configuration; the current form intentionally downloads a brief instead of transmitting personal data.
