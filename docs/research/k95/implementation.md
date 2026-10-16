# K95 implementation brief

Source: https://k95.it/en and https://github.com/JCodesMore/ai-website-cloner-template (master, downloaded 2026-10-16).

## Routes

| Source | Local |
| --- | --- |
| /en | /en/ and / |
| /en/works | /en/works/ |
| /en/projects/[slug] | /en/projects/[slug]/ — all 20 works |
| /en/studio | /en/studio/ |
| /en/contacts | /en/contacts/ |
| /en/privacy | /en/privacy/ — preview-specific privacy text |

## Ownership

- `src/components/sites/k95/GalleryScene.tsx`: independently implemented Three.js scene, curved image planes, ring/spiral interpolation, raycast navigation, pointer/wheel/keyboard input, reduced motion and disposal.
- `Home.tsx`, `Works.tsx`, `Shell.tsx`: navigation, layout switches, filters, cookie preference dialog, mobile menu and footer.
- `projects.json`: editable titles, categories, source descriptions and local image paths.
- `src/app/k95.css`: responsive styling, original Adaptive variable font, glass controls and typographic transitions.
- `public/sites/k95/`: local artwork, original logo and font. See asset-map.json for source URLs.

## Source observations

Home inspected at 427×556 and 1440×900. Blue #1500e1, white navigation, chrome emblem, project image planes in a full-window scene. Rings/Spiral changes layout. Mobile uses a menu button and bottom layout controls. Works switches between image grid and oversized text list. Source Nuxt scripts, two canvases and the `lenis` root class were observed; source libraries and timing were not assumed.

## Scope and remaining differences

This is editable reconstruction code, not a download of the original production JavaScript. The original shader effects, exact camera/physics, initial loading choreography and page transitions are approximated. The center emblem is extruded from the real SVG logo rather than the original 3D model. Works uses a responsive DOM grid/list rather than the original spatial renderer. Project pages contain the real cover, description and three additional images per project, not the complete original galleries or videos. Studio contains source-derived introductory/service/team copy with simplified illustration and no awards animation or team photographs. Italian language, social, maps and shop links lead to external services. Privacy text describes this local implementation; analytics are intentionally absent.

Home selects the first 12 works and repeats those images around the 3D gallery. All 20 works are exposed in the accessible list page. Exact visual parity is not claimed.
