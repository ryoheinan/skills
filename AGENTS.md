# Repository Instructions

- This repository is the source of truth for repo-managed skills under `skills/`.
- Do not change skill copies already installed in the user's local environment, such as files under `~/.agents/skills` or `~/.codex/skills`, as part of the same task unless the user explicitly asks for that scope.
- When a repository change may need to be reflected in the user's installed skill environment, update only this repository first and explain the separate install/sync step instead of applying it automatically.

## Icon Generation Guidelines

- Before generating or revising an icon, inspect `skills/final-artifact-hygiene/assets/icon-large.png` as the canonical style reference and inspect the nearest existing skill icon for semantic consistency. Match the visual system, not the reference subject matter.
- Use a minimal, friendly, flat visual style with a full-bleed pastel background, simple geometric silhouettes, and a restrained palette shared with the existing skill icons. Avoid text, watermarks, decorative clutter, strong gradients, bevels, and broad glows.
- Use these sampled colors as palette anchors: lavender `#D3D9FB`, white `#FEFEFE`, teal `#12B89F`, indigo `#2A28B6`, neutral gray `#B5B9BD`, and optional mint `#6EE3B7`. Nearby pastel background hues are allowed when they help distinguish a skill, but keep similar saturation, brightness, and contrast.
- At 160 x 160 pixels, keep the main silhouette centered with generous clear space around it, use approximately 4-7 pixel primary strokes, and use approximately 6-12 pixel corner radii for card-like surfaces. Favor one dominant symbol plus at most one supporting accent; every detail must remain legible at 64 x 64 pixels.
- Start by classifying every visible element as either a physical object or a diagrammatic/printed mark, then define an explicit z-order before adding shadows.
- A physical object above the background casts a coherent shadow from its entire silhouette onto the immediately lower visible surface. When that receiving surface changes at an overlap boundary, continue the same shadow naturally instead of clipping it to the overlapping region.
- Use shadow distance to communicate height: an elevated object receives a subtle soft shadow, while an object resting on the background receives only a very tight, faint contact shadow. Shadows should separate layers without making objects appear to float excessively.
- As a 160 x 160 starting point, describe an elevated shadow as roughly 1-3 pixels of offset with 3-6 pixels of blur at low opacity, and a contact shadow as roughly 0-1 pixel of offset with 1-3 pixels of blur at very low opacity. Treat these as prompt guidance rather than a reason to add shadows where the layer model does not require them.
- Diagrammatic arrows, printed lines, labels, and symbols lie on their supporting surface and do not cast shadows unless the design explicitly treats them as physical objects.
- Preserve composition, geometry, colors, and unrelated details when iterating on a single visual property. Save experimental revisions under versioned filenames and do not replace the canonical assets or metadata references until a variant is approved.
- Provide both `icon-large.png` at 160 x 160 pixels and `icon-small.png` at 64 x 64 pixels for an adopted icon. Inspect both sizes visually; details and shadows that work at generation size may become too strong or disappear after downscaling.
