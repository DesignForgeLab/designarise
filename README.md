# FORMA — independent digital studio

A dependency-free, responsive static website with a CSS 3D laptop, three concept portfolios, expandable services, accessible dialogs, and a local project-brief download. All fonts and images are included locally; the site makes no third-party runtime requests.

## Run, verify, and build

Node.js 18 or newer is required for these development commands. No package installation is needed.

```sh
npm run dev
npm run check
npm test
npm run build
```

Open http://localhost:3000. The preview server binds only to your computer. `PORT` can override port 3000.

Deploy the contents of `dist/` to a static HTTPS host. The `_headers` file supplies security headers on hosts supporting that format; configure equivalent headers on other hosts. No Node server is needed in production. Re-run the build after changing source files.

## Responsive behavior

- **Desktop:** pinned center-to-right device animation, pointer depth, and asymmetric projects.
- **Tablet and tall portrait screens:** centered device above the headline, restrained vertical movement, and balanced columns.
- **Mobile below 768px:** headline first, device in normal document flow, vertical projects, stacked dimensional gallery, tap-to-expand services, and a full-screen modal menu.
- **Small phones below 375px:** tighter typography and spacing, stacked hero controls, and fewer secondary labels.
- **Accessibility:** minimum 44px touch targets, visible focus rings, skip link, semantic native dialogs with Escape handling and focus containment, labeled forms, and keyboard-operable services. Device motion respects OS reduced-motion preferences; a footer control also enables reduced motion for the current page session.

See `QA.md` for tested viewport sizes and verification limits.

## Files

- `index.html`: page content and semantic structure.
- `styles.css`: core art direction and original component styles.
- `responsive.css`: responsive compositions, accessibility, touch sizing, and reduced-motion overrides.
- `fonts.css` and `assets/`: locally hosted variable WOFF2 fonts, WebP images in 640px and 1280px widths, font licenses, and source attribution.
- `app.js`: adaptive scroll choreography, dialogs, navigation, services, motion preference, and project-brief download.
- `build.mjs`: creates the deployable static folder.
- `server.mjs` and `tests/`: development server and public-file/security checks.

## Before launching a real agency website

FORMA is a placeholder identity. The portfolio is explicitly labeled as self-initiated concepts. No client testimonials, social accounts, contact addresses, or performance claims have been invented.

Replace the identity and concept artwork with your real content. Update project descriptions in the `projects` array in `app.js`. Responsive background images are controlled by `--architecture-image` and `--forest-image` in `responsive.css`. Use `background-size: contain` for website screenshots that must stay fully visible.

The inquiry form currently downloads a text brief; it does **not** send inquiries. A real submission endpoint, destination address, privacy copy, and any required server-side validation must be configured before accepting client inquiries. The form clearly explains its current behavior.

Fonts use the included SIL Open Font licenses. Image source endpoints are listed in `assets/ATTRIBUTION.txt`. Use owned/licensed portfolio material for your actual client work.
