---
name: HomePortal
description: A polished neutral control surface for one household's infrastructure.
colors:
  canvas: "#f4f6f6"
  surface: "#fbfcfc"
  surface-raised: "#ffffff"
  surface-subtle: "#e9eeee"
  ink: "#19282d"
  muted-ink: "#59686c"
  border: "#ccd6d6"
  border-strong: "#9babad"
  action-teal: "#078d91"
  action-teal-strong: "#067b7f"
  action-teal-soft: "#d8eeee"
  structural-navy: "#14344e"
  attention-amber: "#b9781e"
  attention-amber-soft: "#fff2dc"
  success: "#2f7655"
  danger: "#a53e36"
  white: "#ffffff"
  dark-canvas: "#151b1d"
  dark-surface: "#1b2326"
  dark-surface-raised: "#222c2f"
  dark-surface-subtle: "#283336"
  dark-ink: "#edf3f3"
  dark-muted-ink: "#afbec0"
  dark-border: "#3b494c"
  dark-border-strong: "#68787b"
  dark-action-teal: "#55c7c7"
  dark-action-teal-strong: "#74d5d4"
  dark-action-teal-soft: "#203b3d"
  dark-structural-navy: "#9dbbd0"
  dark-attention-amber: "#e3ad5d"
  dark-attention-amber-soft: "#3c3022"
  dark-success: "#79ba92"
  dark-danger: "#ee9188"
typography:
  display:
    fontFamily: "Spline HP, sans-serif"
    fontSize: "clamp(2.75rem, 4vw, 4.6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  title:
    fontFamily: "Spline HP, sans-serif"
    fontSize: "1.22rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Atkinson HP, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Atkinson HP, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  compact: "8px"
  control: "12px"
  object: "14px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "30px"
  field-height: "58px"
components:
  button-primary:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
    height: "58px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.action-teal-strong}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "14px 17px"
    height: "58px"
    width: "100%"
  raised-object:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.object}"
    padding: "24px"
---

# Design System: HomePortal

## Overview

**Creative North Star: "The Quiet Control Surface"**

HomePortal is a polished, neutral control surface for one household. It should feel calm enough to live with every day and exact enough to trust with infrastructure: cool neutral fields carry most of every screen, typography makes the current task unmistakable, and the unchanged house/server mark supplies identity without ornamental brand theater.

This is an operational dashboard world, not a civic register and not a navy-drenched developer console. Open canvases, restrained structure, softly eased controls, and factual supporting context keep attention on the work. Teal marks action, navy selectively anchors hierarchy, and amber appears only when something genuinely needs attention. Light and dark are equal expressions of the same system.

**Key Characteristics:**

- Cool neutral surfaces occupy roughly 80–90% of each interface.
- One dominant task or reading path is paired with quiet, truthful context.
- Spline HP names products, screens, and sections; Atkinson HP handles operation and explanation.
- Teal actions, selective navy structure, and restrained amber attention create hierarchy without color flooding.
- Soft 12–14px geometry and low ambient depth make interactive objects feel precise and approachable.
- The existing HomePortal logo remains unchanged and leads identity treatments.

## Colors

The palette is a cool neutral foundation with disciplined teal, navy, and amber roles; every meaningful light role has a purpose-built dark counterpart.

### Primary

- **Action Teal:** The routine interactive voice for primary actions, selected controls, links, focus-adjacent details, and small directional marks.
- **Strong Action Teal:** The hover and emphasis state for teal actions; it is not a second brand color.
- **Soft Action Teal:** A quiet background for supportive icons and low-emphasis selected states.

### Secondary

- **Structural Navy:** Gives selected headings, location labels, and identity text extra authority. Use it selectively, never as a dominant page field.

### Tertiary

- **Attention Amber:** Signals attention, caution, or an important support note.
- **Soft Attention Amber:** The paired low-intensity field for amber notices and icon tiles.
- **Success and Danger:** Reserved for semantic feedback and state; neither is decorative.

### Neutral

- **Canvas:** The cool page ground and largest visual field.
- **Surface:** A near-canvas support field that separates regions without a heavy boundary.
- **Raised Surface:** Inputs, slips, summaries, and other handled objects.
- **Subtle Surface:** Quiet icon-button hovers, code rows, and nested utility areas.
- **Ink:** Default high-contrast text.
- **Muted Ink:** Supporting prose, hints, metadata, and subdued labels.
- **Border / Strong Border:** Hairline region separation and the firmer stroke used on editable controls.

**The Neutral Majority Rule.** Cool neutrals occupy roughly 80–90% of a screen. Accent color must clarify action, structure, or state.

**The Three-Accent Rule.** Teal acts, navy structures, and amber alerts. Do not exchange their jobs or let them compete in the same region.

**The Equal Themes Rule.** Dark mode uses charcoal and graphite surfaces with retuned accents; it is not an inverted light palette or a navy flood.

## Typography

**Display Font:** Spline HP (with sans-serif fallback)  
**Body Font:** Atkinson HP (with sans-serif fallback)

**Character:** Spline HP gives large headings and the HomePortal lockup a compact, confident silhouette. Atkinson HP keeps forms, navigation, supporting copy, and system information highly legible and unshowy.

### Hierarchy

- **Display:** Medium Spline with tight tracking and close line height; use for the single dominant page or task heading, generally bounded to 9–14 characters per line depending on viewport.
- **Title:** Semibold Spline; use for the product lockup, support headings, and meaningful object titles.
- **Body:** Regular Atkinson with a relaxed line height; keep explanatory copy near 55–65 characters per line.
- **Label:** Bold Atkinson in sentence case; use above controls and on high-confidence actions.
- **Micro label:** Semibold Atkinson may use tracked uppercase only for compact metadata such as “Required” or a small category marker.

**The Two-Voice Rule.** Spline names the place, object, or task; Atkinson explains and operates it. Add no novelty or decorative face.

**The Sentence-Case Rule.** Actions, navigation, headings, and prose use sentence case. Uppercase is limited to short metadata labels.

## Layout

The durable spatial model is an open operational canvas with one obvious primary region and a quieter support region. On wide screens, a compact 68–76px identity header sits above a two-column field; the task receives the broader flexible column, while the support field may use a subtly different neutral surface. The content canvas is centered and capped near 1540px. Primary task content stays left aligned and bounded near 650–670px rather than floating inside a card.

Use an 8px-root rhythm with 10px, 16px, 22px, and 30px practical steps. Major regions receive fluid padding from about 36–108px horizontally and 52–96px vertically. Handled controls share a 58px minimum height.

At 900px, tighten the two-column proportions and padding. At 700px, collapse to one column: retain the compact identity header, place the task first, remove oversized decorative identity staging, and follow with all useful support context. Do not hide information needed to understand or complete the task.

The prototype engine may frame the surface, but engine chrome remains visually secondary and theme-synchronized through explicit System, Light, and Dark choices.

**The Open Canvas Rule.** Put the main task directly on the canvas. Containers are for discrete objects, not for wrapping an entire page or form by habit.

**The One Clear Task Rule.** The task or primary operational reading path always receives the strongest type, broadest useful measure, and first responsive position.

## Elevation & Depth

Depth is restrained but present. Tonal separation establishes large regions; low, cool ambient shadows identify handled or raised objects such as primary actions, slips, QR blocks, and summaries. Page regions and resting navigation stay flat. Hover may increase lift by one pixel, while press returns the object toward the canvas.

### Shadow Vocabulary

- **Input focus** (`0 4px 18px color-mix(in srgb, var(--action-teal) 13%, transparent)`): A soft teal atmosphere around the active field, paired with a teal border.
- **Primary action** (`0 8px 20px color-mix(in srgb, var(--action-teal) 20%, transparent)`): Soft offset depth under the dominant action.
- **Raised object** (`0 10px 28px rgba(21, 36, 40, .09)`): Quiet separation for slips, recovery-code blocks, and account summaries.
- **Workbench frame** (`0 18px 45px rgba(25, 29, 36, .18)`): Prototype-engine framing only; remove it in responsive full-canvas mode.

**The Ambient-Only Rule.** Shadows stay soft, cool, and low contrast. Never use hard drop shadows, stacked elevation, glow as decoration, or shadow around whole page regions.

## Shapes

The form language is crisp with soft easing. Inputs, primary buttons, notices, and icon tiles use 12px corners; discrete raised objects use 14px; compact utility controls and code rows use 8px. Circles belong to tiny indicators and geometry already present in the unchanged logo.

Borders are one pixel and cool neutral. Avoid ornamental clipping, capsules as a default, excessive nesting, and repeated rounded cards. The existing PNG house/server mark is the sole identity source: preserve its aspect ratio, transparency, and artwork from favicon through large support-stage use.

**The Soft Precision Rule.** Use 12px for handled controls, 14px for discrete objects, and 8px for compact utilities. Radius softens interaction; it does not turn every content group into a card.

## Components

### Buttons

- **Shape:** Full-measure 58px controls with 12px corners and centered bold Atkinson text.
- **Primary:** Action Teal with white text and one optional directional icon aligned to the far edge.
- **Hover / Active:** Shift to Strong Action Teal and lift one pixel on hover; press one pixel toward the canvas with reduced shadow.
- **Focus:** A clear three-pixel teal-tinted outline with three-pixel offset remains visible beyond the ambient shadow.
- **Disabled:** Preserve silhouette, reduce opacity to about half, remove lift, and retain a not-allowed cursor.

### Inputs / Fields

- **Style:** Visible sentence-case label above a Raised Surface field, one-pixel Strong Border, 12px corners, and 58px minimum height.
- **Focus:** Shift the border to Action Teal and add the soft Input Focus shadow; keyboard focus retains the global three-pixel ring.
- **Support:** Hints use Muted Ink. Password visibility is a 40px compact ghost control inside the field.
- **Error / Disabled:** Use semantic color plus adjacent plain-language explanation; never rely on placeholder text or color alone.

### Cards / Containers

- **Corner Style:** Discrete raised objects use 14px corners; large layout regions remain open and uncarded.
- **Background:** Raised Surface over Canvas or Surface.
- **Shadow Strategy:** Raised Object only when the item is meaningfully handled or grouped.
- **Border:** Prefer no border when elevation suffices; use a one-pixel Border for internal separation.
- **Internal Padding:** Usually 20–24px.

### Notices and context items

- **Notices:** Soft semantic fields with 12px corners, concise title, and muted supporting copy.
- **Context items:** A 44px teal- or amber-soft icon tile beside a Spline title and short factual explanation. Dividers may separate siblings.
- **Role discipline:** Context supports the task; it never introduces fictional state, promotional proof, or permissions claims.

### Navigation and identity

- **Header:** Compact logo lockup at the leading edge, followed by a lightly divided area/surface location label when helpful.
- **Logo:** Use the existing supplied `logo.png` unchanged at 36–44px in compact identity and up to about 190px in a spacious support field.
- **Stateful controls:** Switches for persistent modes such as theme display the current state through their visible icon or label, like a physical light switch. The accessible name may additionally explain the action that will occur when activated.
- **Engine navigation:** Keep typography, neutral palette, theme controls, and focus language aligned with the product world while retaining a visibly secondary framing role.

## Do's and Don'ts

### Do:

- **Do** let cool neutral surfaces carry roughly 80–90% of each interface.
- **Do** make one operational task or reading path unmistakably dominant and left aligned.
- **Do** use teal for action, navy for selective structure, and amber for attention.
- **Do** pair Spline headings with Atkinson controls and prose using the shipped self-hosted fonts.
- **Do** preserve the existing HomePortal logo artwork, aspect ratio, and transparent surround.
- **Do** build equal light and dark themes, using charcoal and graphite rather than navy flooding in dark mode.
- **Do** retain accessible focus, 58px controls, responsive stacking, factual context, and reduced-motion behavior.

### Don't:

- **Don't** revive the old green civic-register, mineral-paper, ledger-line, or public-service visual language.
- **Don't** turn HomePortal into a navy-drenched developer dashboard, neon console, or generic smart-home tile grid.
- **Don't** wrap the primary task in a floating card or place every content group inside a rounded container.
- **Don't** use amber as a general brand fill, teal as decoration, or semantic red and green for ordinary emphasis.
- **Don't** redraw, simplify, recolor, or replace the supplied logo.
- **Don't** add glass effects, loud gradients, hard shadows, paper texture, decorative nostalgia, or gratuitous motion.
- **Don't** canonize route-specific authentication copy or prototype fixture data as product-wide behavior.
