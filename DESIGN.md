---
name: Footprint
description: AI-powered travel journal that turns photos into interactive trip stories.
colors:
  bg-base: "#0D1117"
  bg-surface: "#161B22"
  bg-raised: "#21262D"
  border: "#30363D"
  text-primary: "#E8DCC8"
  text-secondary: "#8B8278"
  text-muted: "#5C5650"
  accent: "#F59E0B"
  accent-hover: "#D97706"
  accent-subtle: "rgba(245,158,11,0.10)"
  bg-base-light: "#FDFAF4"
  bg-surface-light: "#FFFEF9"
  bg-raised-light: "#F5F0E6"
  border-light: "#E8E0D0"
  text-primary-light: "#1C1410"
  text-secondary-light: "#6B5E52"
  text-muted-light: "#9E9188"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "#FFFFFF"
  button-secondary:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.text-primary}"
  card-default:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-raised:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input-default:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: Footprint

## Overview

**Creative North Star: "The Midnight Map Room"**

Footprint's visual world is a cartographer's studio after dark — obsidian surfaces, amber safelights, the soft glow of a screen in a quiet room. Every surface exists to hold travel memories with care, not to call attention to itself. The UI is the container; the user's photographs and stories are the artifact. Dark is the default mode and feels native to the product: photos pop on deep neutral backgrounds the way prints look best under controlled light.

The two-mode system is intentional. Dark mode is the map room at night: precise, rich, and emotionally resonant for reviewing memories. Light mode is the morning field journal: warm paper tones, high legibility, a different but equally considered register. Neither mode is an afterthought; both are expressed with the same amber accent, the same font pairing, and the same tonal depth logic.

Typography pairs Fraunces (a variable optical-size serif with expressive ink traps) with Inter (a neutral, legible sans). The combination bridges engineering precision and travel storytelling — Fraunces headings carry editorial authority, Inter handles information density without friction.

**Key Characteristics:**
- Obsidian-to-charcoal dark base; warm cream-to-parchment light base
- Single amber accent (#F59E0B) used sparingly as an attention signal
- Fraunces for headings, Inter for everything else
- Tonal layering for depth; structural shadows only on floating UI (dialogs, tooltips, map popups)
- Warm and considered: generous padding, amber rewards interactions without loudness
- Photos are the hero; interface recedes

## Colors

A two-register palette — obsidian darks (default) and parchment lights — anchored by a single amber accent that reads as both a trail marker and a film-room safelight.

### Primary
- **Amber Trail Marker** (`#F59E0B`): The single accent. Used on active nav indicators, primary button fills, upload progress, AI tag highlights, and focus rings. Its rarity is the point — when amber appears, something is active or important.
- **Amber Deep** (`#D97706`, dark mode hover / `#B45309`, light mode hover): The accent pressed or hovered state. Never used as a standalone decorative color.

### Secondary
- **Accent Fog** (`rgba(245,158,11,0.10)` dark / `rgba(245,158,11,0.08)` light): The ambient amber blush. Fills active nav item backgrounds, selected state washes, and hover ghosts on accent-adjacent interactive surfaces.

### Neutral
- **Obsidian** (`#0D1117`): Page base in dark mode. The deepest surface; holds the full-bleed app background and the landing page canvas.
- **Deep Slate** (`#161B22`): Primary card and sidebar surface in dark mode. One step lighter than the base, creating the first tonal lift.
- **Charcoal** (`#21262D`): Raised surfaces — inputs, hovered states, tooltips, elevated cards.
- **Map Grid** (`#30363D`): Borders and dividers. Subtle enough not to cut; present enough to delineate.
- **Film Cream** (`#E8DCC8`): Primary text in dark mode. Not pure white — the warmth prevents harshness against dark neutrals.
- **Faded Ink** (`#8B8278`): Secondary text; metadata, labels, supporting copy.
- **Exposed Paper** (`#5C5650`): Muted text; disabled states, placeholder copy, de-emphasized labels.
- **Parchment** (`#FDFAF4`): Page base in light mode.
- **Vellum** (`#FFFEF9`): Card surface in light mode.
- **Aged Paper** (`#F5F0E6`): Raised surfaces in light mode.
- **Dried Ink** (`#1C1410`): Primary text in light mode.

### Named Rules
**The One Amber Rule.** The amber accent appears on ≤10% of any surface. Trip cards, nav items, buttons: one amber element per zone. Amber everywhere is amber nowhere.

**The No White Text Rule.** Primary text is Film Cream (`#E8DCC8`) in dark mode, not pure white. Pure white reads as UI chrome; Film Cream reads as authored content.

## Typography

**Display Font:** Fraunces (variable, optical-size), Georgia, serif
**Body Font:** Inter, system-ui, sans-serif

**Character:** Fraunces brings editorial weight and ink-trap texture to headings — it reads like a well-designed atlas title. Inter handles everything else with density and legibility that disappears into the task. The pairing is deliberate asymmetry: one voice for story, one for information.

### Hierarchy
- **Display** (700, `2.25rem / 36px`, line-height 1.1, letter-spacing -0.01em): Page titles, trip names in hero banners. Fraunces only. Rare by design.
- **Title** (700, `1.5rem / 24px`, line-height 1.2): Section headers, modal titles, card headings. Fraunces.
- **Subheading** (600, `1.125rem / 18px`, line-height 1.4): Card names, tab labels, list item primary text. Inter.
- **Body** (400, `0.875rem / 14px`, line-height 1.6): All descriptive copy, metadata, descriptions. Inter. Max line length 65ch in reading contexts.
- **Label** (500, `0.75rem / 12px`, letter-spacing 0.02em): Badges, tags, caption overlines, button text at small size. Inter. Uppercase only for section eyebrows (letter-spacing 0.24em).

### Named Rules
**The Serif Rationing Rule.** Fraunces appears only in Display and Title roles. Body copy, labels, and UI chrome are Inter throughout. Mixing the two at the same size level degrades both.

## Layout

The app shell uses a fixed collapsible sidebar (52px collapsed / 220px expanded) with `ml-[52px]` offset on the content area. All app pages are constrained to this model; the sidebar is always present for authenticated routes.

Content pages use generous horizontal padding (`px-6`) with a max-width of `max-w-7xl` for full-width sections and `max-w-6xl` for feature content. Vertical rhythm is `space-y` or `gap`-based (multiples of 8px). The grid system is 1-col mobile, 2-col tablet, 3-col desktop for trip/photo grids.

The landing page breaks the shell: full-bleed, no sidebar, a centered `max-w-7xl` container. Hero sections are 2-col on large screens (text left, visual right), single-column on mobile.

Map views break out of the content container entirely: `fixed inset-0 ml-[52px]` with no additional padding, giving the Leaflet viewport maximum real estate.

## Elevation & Depth

The system is tonal-first with structural shadows reserved for floating UI. Static surfaces (page background → card surface → raised input) separate by stepping through the neutral ramp: `bg-base` → `bg-surface` → `bg-raised`. No shadows on these layers — contrast does the work.

Structural shadows appear only on elements that genuinely float above the document flow: dialogs, tooltips, map popups, and the collapsible sidebar when expanded. The philosophy is: shadows are physical evidence of actual elevation, not decorative texture.

### Shadow Vocabulary
- **Tooltip / Floating Label** (`box-shadow: 0 2px 8px rgba(0,0,0,0.35)`): Small, tight; used on tooltips and collapsed-sidebar labels.
- **Map Popup** (`box-shadow: 0 4px 16px rgba(0,0,0,0.30)`): Medium diffuse; used on the `.footprint-popup` Leaflet popup wrapper.
- **Dialog / Modal** (`box-shadow: 0 8px 40px rgba(0,0,0,0.45)`): Full-depth; used on modal overlays and the Clerk auth sheet.
- **Card Hover** (`box-shadow: 0 0 0 1px rgba(245,158,11,0.15)`): Amber ring-shadow on trip card hover — combines with a `-translate-y-0.5` lift to signal interactivity.

### Named Rules
**The Flat-By-Default Rule.** Static cards, inputs, and nav items cast no shadow at rest. A shadow on hover is a response to state, not a permanent decoration.

## Shapes

Footprint uses a restrained, consistently rounded vocabulary. The form language is soft enough to feel approachable but not so rounded that it loses editorial authority.

- **Small (4px):** Buttons, input fields, tooltips, badges, tags. The dominant radius — most interactive UI elements use this.
- **Medium (8px):** Card containers, modal corners, map popups, sidebar tooltips. Slightly more generous; used where the surface holds content.
- **Large (12px):** Feature cards on the landing page, hero visual mock frames. Marketing surfaces can breathe more.
- **Extra-large (16px):** Polaroid-style landing page visual stack only. The most expressive radius in the system; not used in app UI.
- **Full / Pill:** Not used. Pill buttons are explicitly avoided; the system prefers precision over softness.

### Named Rules
**The No-Pill Rule.** Rounded-full buttons are not part of this system. Every button uses the small (4px) radius. Pills read as consumer-app; this system reads as editorial tool.

## Components

### Buttons

Warm and considered — amber primary feels rewarding without aggression; secondary and ghost variants recede appropriately.

- **Shape:** Small radius (4px), tight horizontal padding
- **Primary** (`bg-accent text-white`, `px-4 py-2`, height 36px): The accent-amber fill. Used for the single most important action per surface. On hover: `bg-accent-hover`, no other change.
- **Secondary** (`bg-bg-raised text-text-primary border border-border-token`, same geometry): For secondary actions that need containment. Border creates a clear silhouette against the base surface.
- **Ghost** (`text-text-secondary`, no background at rest, `hover:bg-bg-raised hover:text-text-primary`): For tertiary actions and icon-adjacent controls. Disappears until needed.
- **Destructive** (`bg-red-500 text-white hover:bg-red-600`): Delete flows only. No amber in destructive states.
- **Icon** (`h-9 w-9 p-0`, ghost coloring): Square icon buttons in toolbars and action strips.
- **Focus ring:** `ring-2 ring-accent/50` on all variants.

### Cards / Containers

- **Default Card** (`bg-bg-surface border border-border-token rounded-lg`): The standard content container. Border is the `Map Grid` token — subtle against the surface.
- **Raised Card** (`bg-bg-raised rounded-lg`, no border): Used for inputs, code-like surfaces, and secondary containers nested within default cards.
- **Trip Card** extends default card with: `4/3` cover image, `p-4` info block, amber ring-shadow + `-translate-y-0.5` on hover. The hover interaction is the only place a static card shows depth.
- **Internal Padding:** `p-4` (16px) standard; `p-6` (24px) on landing feature cards.

### Inputs / Fields

- **Style:** `bg-bg-surface border border-border-token rounded` (4px radius), `px-3 py-2 text-sm`
- **Icon variant:** Left-slot icon at `pl-9`, icon colored `text-text-muted`
- **Focus:** `ring-1 ring-accent` — single-width amber ring, no border color change
- **Placeholder:** `text-text-muted`
- **Disabled:** `opacity-50 pointer-events-none`

### Navigation (Sidebar)

A collapsible icon-rail: 52px collapsed, 220px expanded on hover. Transition is width-only at 200ms.

- **Container:** `bg-bg-surface border-r border-border-token`
- **Brand mark:** Amber `Plane` icon (Lucide) + Fraunces wordmark when expanded
- **Nav item (default):** `text-text-secondary`, `border-l-2 border-transparent`, `hover:bg-bg-raised hover:text-text-primary`
- **Nav item (active):** `border-l-2 border-accent bg-accent-subtle text-text-primary` — the left border + amber wash is the only active-state indicator
- **Tooltip (collapsed):** `bg-bg-raised px-2.5 py-1 rounded text-xs` on right side

### AI Tag Badges (Signature Component)

Contextual classification chips on photo thumbnails and in the lightbox. Three semantic categories with distinct color treatments:

- **Landmark:** `bg-amber-100 text-amber-700` (light) / `bg-amber-500/15 text-amber-400` (dark)
- **Scene:** `bg-teal-100 text-teal-700` (light) / `bg-teal-500/15 text-teal-400` (dark)
- **Object:** `bg-violet-100 text-violet-700` (light) / `bg-violet-500/15 text-violet-400` (dark)
- **Shape:** `rounded text-xs font-medium px-2 py-0.5` — same geometry as all badges

The category colors break from the amber-only accent rule deliberately: they encode semantic type, not UI state.

### Map Popup (Signature Component)

Leaflet popups styled to match the token system rather than the browser default:

- **Container:** `bg-bg-surface border border-border-token rounded-lg` (8px)
- **Shadow:** `0 4px 16px rgba(0,0,0,0.30)`
- **Popup tip:** Matches `bg-bg-surface` to create seamless connection
- **Close button:** `text-text-muted`

## Do's and Don'ts

### Do:
- **Do** use amber (`#F59E0B`) only for the single highest-priority interactive element per view.
- **Do** use Fraunces for trip names, page titles, and modal headings — and Inter for everything else.
- **Do** separate card layers tonally: `bg-base` page → `bg-surface` card → `bg-raised` nested input.
- **Do** use `border-l-2 border-accent` as the active state signal for navigation items.
- **Do** apply structural shadows (`box-shadow`) only to floating elements: dialogs, tooltips, map popups.
- **Do** use `film cream` (`#E8DCC8`) as primary text in dark mode — never pure white.

### Don't:
- **Don't** use heavy, colored borders on cards — rely on the tonal contrast between `bg-base` and `bg-surface`.
- **Don't** use pitch-black (`#000000`) as a photo background — use `bg-base` (`#0D1117`) to preserve photo color fidelity.
- **Don't** use rounded-full (pill) buttons — all buttons use the 4px `rounded-sm` radius.
- **Don't** mix amber with other accent colors in the same UI zone — the three badge categories (amber/teal/violet) are the only permitted exception, and only in the semantic tagging context.
- **Don't** apply decorative shadows to static cards at rest — the card hover shadow is a state signal, not an always-on style.
- **Don't** use oversaturated neon greens or any green in this system (this is the incumbent amber world; Alpine Forest is the replacement direction).
