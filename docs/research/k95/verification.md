# Verification — 2026-10-16

- Dependency installation: pnpm install completed successfully, including unrs-resolver postinstall.
- `node scripts/check.mjs`: ESLint passed, TypeScript passed, Next.js production static export passed (29 generated outputs, including 20 project routes).
- HTTP smoke check: all 108 page/asset URLs returned status 200 (26 page routes, 82 distinct local assets).
- Browser: home canvas rendered; Rings/Spiral buttons changed selected states and layouts. No captured browser errors on the home page.
- Mobile: Works navigation, Type Design filter (2 projects), Grid/List change and Herbert project navigation checked. Project images loaded in the inspected detail page.
- Mobile navigation opened, Studio link navigated, Branding service expanded and displayed its copy.
- Final viewport checks: 1440×900 home had no horizontal overflow. 390×844 home document width was exactly 390px and had one canvas. Browser viewport override was reset afterward.
- Desktop and mobile screenshots saved under docs/design-references/local-*.jpg.

These checks establish rendering and the exercised interactions. Original shader parity, exact motion timing, every external destination and all possible device/GPU combinations are not verified. Source differences are listed in implementation.md and README_KO.md.
