import { defineConfig, presetWind, presetAttributify } from "unocss";

// ─── skill7.dev Visual Identity ──────────────────────────────────────────────
//
// Philosophy: "Craft, not conjuring"
// Dark-first. AI-native. Not purple/indigo.
//
// Color logic:
//   - Midnight navy base (#080c18) — deeper than typical dark, slight blue cast
//   - Acid green accent (#00e5a0) — electric, terminal-native, reads "precision"
//   - Electric cyan secondary (#00b4d8) — aurora undertone, code linkage
//   - Warm sand for light mode — human warmth vs cold competitors
//
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  presets: [presetWind(), presetAttributify()],

  theme: {
    // ── Fonts ────────────────────────────────────────────────────────────────
    // Heading: "Space Grotesk" — geometric with personality, not corporate
    //   Alt A: "Geist" — Vercel's open font, sharp, technical
    //   Alt B: "DM Mono" at display size — full mono aesthetic
    // Body:   "Inter" — maximum legibility at small sizes
    // Code:   "JetBrains Mono" — excellent for CLI output, widely available
    //
    // Load in Base.astro <head>:
    //   https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap
    fontFamily: {
      heading: ["Space Grotesk", "Geist", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Geist Mono", "Fira Code", "monospace"],
    },

    // ── Type Scale ───────────────────────────────────────────────────────────
    // Base: 16px. Ratio: ~1.25 (Major Third) — tight, technical feel.
    // Larger steps break to 1.333 (Perfect Fourth) for hero headings.
    // lineHeight and letterSpacing set in Base.astro global CSS (camelCase
    // is not supported by UnoCSS fontSize shorthand in this version).
    fontSize: {
      xs:   "0.75rem",   // 12px
      sm:   "0.875rem",  // 14px
      base: "1rem",      // 16px
      lg:   "1.125rem",  // 18px
      xl:   "1.25rem",   // 20px
      "2xl":"1.5rem",    // 24px
      "3xl":"1.875rem",  // 30px
      "4xl":"2.25rem",   // 36px
      "5xl":"3rem",      // 48px
      "6xl":"3.75rem",   // 60px
    },

    // ── Border Radius ────────────────────────────────────────────────────────
    // Strategy: sharp at macro scale, softened at micro.
    // Cards: rounded-xl (12px) — polished without being playful
    // Buttons: rounded-lg (8px) — decisive, not pill-shaped (pill = SaaS cliché)
    // Badges: rounded-full — only exception, creates visual contrast
    // Code blocks: rounded-lg (8px)
    // Input fields: rounded-md (6px)
    borderRadius: {
      none: "0",
      sm:   "0.25rem",   // 4px  — tags, small chips
      md:   "0.375rem",  // 6px  — inputs
      lg:   "0.5rem",    // 8px  — buttons, code blocks
      xl:   "0.75rem",   // 12px — cards
      "2xl":"1rem",      // 16px — modal, large surfaces
      "3xl":"1.5rem",    // 24px — hero panels
      full: "9999px",    // badges, avatars
    },

    // ── Colors ───────────────────────────────────────────────────────────────
    //
    // Naming convention: avoid hyphens in nested keys — UnoCSS generates
    // class names by joining keys with "-", so "dark.text1" → "dark-text1".
    //
    // ── Dark Mode Palette (PRIMARY) ────────────────────────────────────────
    // bg:       #080c18  — midnight navy, deepest layer
    // surface:  #0f1629  — card/panel layer
    // surface2: #161e38  — elevated surface (hover, active)
    // border:   #1e2a4a  — subtle structural lines
    // border2:  #2a3a5e  — stronger border for emphasis
    // text1:    #e8edf8  — near-white with blue cast
    // text2:    #8b9cbf  — muted, readable, blue-shifted
    // muted:    #4a5878  — placeholder, disabled
    // codebg:   #060a14  — darker than surface, terminal feel
    //
    // ── Light Mode Palette (SECONDARY) ────────────────────────────────────
    // bg:       #f7f5f0  — warm sand, NOT gray-50
    // surface:  #ffffff  — pure white cards on warm background
    // surface2: #f0ede8  — slightly darker for hover
    // border:   #e2ddd6  — warm gray
    // border2:  #c8c2b8  — stronger border
    // text1:    #1a1612  — very dark warm brown
    // text2:    #6b6059  — warm medium gray
    // muted:    #9e9389  — warm light gray
    // codebg:   #1a1e2e  — dark code block on light page (intentional contrast)

    colors: {
      // ── Dark mode tokens ─────────────────────────────────────────────────
      // Avoid numeric suffixes in nested keys — UnoCSS treats them as shade
      // scales (100, 200…). Use semantic names instead.
      // dark-bg, dark-base, dark-raised, dark-line, dark-edge,
      // dark-hi, dark-lo, dark-dim, dark-code
      dark: {
        bg:    "#080c18",   // deepest background
        base:  "#0f1629",   // card / panel
        raised:"#161e38",   // elevated surface (hover, active)
        line:  "#1e2a4a",   // subtle borders
        edge:  "#2a3a5e",   // strong borders / emphasis
        hi:    "#e8edf8",   // primary text (high contrast)
        lo:    "#8b9cbf",   // secondary text
        dim:   "#667a99",   // muted / placeholder / disabled
        code:  "#060a14",   // code block background
      },

      light: {
        bg:    "#f7f5f0",   // warm sand
        base:  "#ffffff",   // card surface
        raised:"#f0ede8",   // hover surface
        line:  "#e2ddd6",   // warm border
        edge:  "#c8c2b8",   // strong border
        hi:    "#1a1612",   // primary text
        lo:    "#6b6059",   // secondary text
        dim:   "#9e9389",   // muted text
        code:  "#1a1e2e",   // code block (dark on light)
      },

      // ── Acid green — primary accent ───────────────────────────────────────
      // Dark mode: #00e5a0 (electric), light mode: #007a52 (forest)
      acid: {
        DEFAULT: "#00e5a0",
        glow:    "#00ffc2",
        dim:     "#00b37a",
        dark:    "#007a52",   // desaturated for light mode
        muted:   "#003d28",   // subtle backgrounds in dark mode
        mutedlt: "#e8f9f2",   // subtle backgrounds in light mode
      },

      // ── Electric cyan — secondary accent ─────────────────────────────────
      // Dark mode: #00b4d8, light mode: #006b8a
      cyan: {
        DEFAULT: "#00b4d8",
        bright:  "#00d4ff",
        dim:     "#0090b0",
        dark:    "#006b8a",   // desaturated for light mode
        muted:   "#002d3d",   // subtle backgrounds in dark mode
        mutedlt: "#e6f4f8",   // subtle backgrounds in light mode
      },

      // ── Semantic status ───────────────────────────────────────────────────
      ok: {
        DEFAULT: "#00c97a",
        bg:      "#003d28",   // dark mode tint
        bglt:    "#e8f9f2",   // light mode tint
        text:    "#007a52",   // light mode text
      },
      warn: {
        DEFAULT: "#f5a623",
        bg:      "#3d2800",
        bglt:    "#fef3e2",
        text:    "#a06c00",
      },
      err: {
        DEFAULT: "#f0455a",
        bg:      "#3d0010",
        bglt:    "#fdeef0",
        text:    "#c4243a",
      },

      // ── Legacy alias — use acid/cyan for new components ───────────────────
      brand: {
        50:  "#e8f9f2",
        100: "#c0f0e0",
        400: "#00e5a0",
        500: "#00c97a",
        600: "#007a52",
        900: "#003020",
      },
    },

    // ── Box Shadows ──────────────────────────────────────────────────────────
    // Dark mode: glow-based, not elevation-based.
    // Light mode: warm-tinted elevation.
    boxShadow: {
      // Glow effects
      "glow-acid":    "0 0 20px 0 rgba(0,229,160,0.25), 0 0 40px 0 rgba(0,229,160,0.1)",
      "glow-cyan":    "0 0 20px 0 rgba(0,180,216,0.25), 0 0 40px 0 rgba(0,180,216,0.1)",
      "glow-sm":      "0 0 8px 0 rgba(0,229,160,0.15)",
      "glow-lg":      "0 0 40px 0 rgba(0,229,160,0.2), 0 0 80px 0 rgba(0,180,216,0.1)",
      // Dark surface elevation
      card:           "0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)",
      "card-hover":   "0 4px 12px 0 rgba(0,0,0,0.5), 0 0 1px 0 rgba(0,229,160,0.2)",
      panel:          "0 8px 32px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(30,42,74,0.8)",
      // Light mode elevation
      "card-lt":      "0 1px 3px 0 rgba(26,22,18,0.08), 0 1px 2px -1px rgba(26,22,18,0.06)",
      "card-lt-hover":"0 4px 12px 0 rgba(26,22,18,0.12)",
      // Inset for code blocks
      "inset-code":   "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      // Glow ring
      "glow-ring":    "0 0 0 1px rgba(0,229,160,0.15)",
      none: "none",
    },

    // ── Animations ───────────────────────────────────────────────────────────
    animation: {
      "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      "fade-in":    "fade-in 0.4s ease-out",
      "slide-up":   "slide-up 0.5s cubic-bezier(0.16,1,0.3,1)",
      "aurora":     "aurora 10s ease-in-out infinite",
    },
    keyframes: {
      "glow-pulse": {
        "0%,100%": { opacity: "0.6" },
        "50%":     { opacity: "1" },
      },
      "fade-in": {
        from: { opacity: "0" },
        to:   { opacity: "1" },
      },
      "slide-up": {
        from: { opacity: "0", transform: "translateY(16px)" },
        to:   { opacity: "1", transform: "translateY(0)" },
      },
      "aurora": {
        "0%,100%": { backgroundPosition: "0% 50%" },
        "50%":     { backgroundPosition: "100% 50%" },
      },
    },
  },

  // ── Shortcuts ─────────────────────────────────────────────────────────────
  // Dark-mode-first. Components reference dark.* color tokens.
  // Light mode: apply [data-theme=light] overrides via CSS variables.
  shortcuts: {
    // ── Buttons ───────────────────────────────────────────────────────────────
    // ── Token name mapping (for reference) ────────────────────────────────────
    // dark-bg    = #080c18   dark-base  = #0f1629   dark-raised = #161e38
    // dark-line  = #1e2a4a   dark-edge  = #2a3a5e
    // dark-hi    = #e8edf8   dark-lo    = #8b9cbf   dark-dim    = #4a5878
    // dark-code  = #060a14

    // ── Buttons ───────────────────────────────────────────────────────────────
    "btn-primary":
      "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg " +
      "bg-acid text-dark-bg font-semibold text-sm " +
      "hover:bg-acid-glow " +
      "shadow-glow-sm hover:shadow-glow-acid " +
      "transition-all duration-200 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",

    "btn-secondary":
      "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg " +
      "border border-dark-edge text-dark-lo font-medium text-sm " +
      "hover:border-acid hover:text-acid hover:bg-acid-muted " +
      "transition-all duration-200 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",

    "btn-ghost":
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-md " +
      "text-dark-lo font-medium text-sm " +
      "hover:text-dark-hi hover:bg-dark-raised " +
      "transition-all duration-150",

    // ── Cards ─────────────────────────────────────────────────────────────────
    "card":
      "rounded-xl border border-dark-line bg-dark-base p-6 " +
      "shadow-card " +
      "hover:border-dark-edge hover:shadow-card-hover " +
      "transition-all duration-200",

    "card-sm":
      "rounded-xl border border-dark-line bg-dark-base p-4 " +
      "shadow-card " +
      "hover:border-dark-edge " +
      "transition-all duration-200",

    "card-accent":
      "rounded-xl border border-dark-line bg-dark-base p-6 " +
      "shadow-card " +
      "hover:border-acid hover:shadow-glow-acid " +
      "transition-all duration-200",

    // ── Badges ────────────────────────────────────────────────────────────────
    "badge":
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-tight",

    "badge-active":
      "badge bg-ok-bg text-ok border border-ok/30",

    "badge-beta":
      "badge bg-warn-bg text-warn border border-warn/30",

    "badge-deprecated":
      "badge bg-err-bg text-err border border-err/30",

    "badge-verified":
      "badge bg-cyan-muted text-cyan border border-cyan/30",

    "badge-new":
      "badge bg-acid-muted text-acid border border-acid/30",

    // ── Plugin icon avatar ────────────────────────────────────────────────────
    "plugin-icon":
      "flex h-11 w-11 items-center justify-center rounded-lg " +
      "bg-dark-raised border border-dark-line " +
      "text-acid font-mono font-bold text-xs " +
      "group-hover:border-acid group-hover:shadow-glow-sm " +
      "transition-all duration-200 shrink-0",

    // ── Code / terminal ───────────────────────────────────────────────────────
    "code-block":
      "rounded-lg bg-dark-code border border-dark-line " +
      "px-4 py-3 font-mono text-sm text-dark-hi " +
      "shadow-inset-code overflow-x-auto",

    "inline-code":
      "rounded-sm px-1.5 py-0.5 font-mono text-xs " +
      "bg-dark-raised text-acid border border-dark-line",

    // ── Copy command block ────────────────────────────────────────────────────
    "copy-block":
      "flex items-center gap-3 rounded-lg " +
      "bg-dark-code border border-dark-line " +
      "px-4 py-3 font-mono text-sm text-dark-hi " +
      "shadow-inset-code",

    "copy-btn":
      "shrink-0 rounded-sm px-3 py-2 text-xs font-medium " +
      "min-w-16 text-center " +
      "text-dark-lo bg-dark-raised border border-dark-line " +
      "hover:text-acid hover:border-acid " +
      "transition-all duration-150",

    // ── Navigation ────────────────────────────────────────────────────────────
    "nav-link":
      "text-sm font-medium text-dark-lo " +
      "hover:text-dark-hi " +
      "transition-colors duration-150",

    "nav-link-active":
      "text-sm font-medium text-acid",

    // ── Section label ─────────────────────────────────────────────────────────
    "section-label":
      "text-xs font-semibold uppercase tracking-widest text-dark-lo",

    // ── Input ─────────────────────────────────────────────────────────────────
    "input":
      "w-full rounded-md border border-dark-line bg-dark-raised " +
      "px-3 py-2 text-sm text-dark-hi placeholder-dark-dim " +
      "focus:outline-none focus:border-acid focus:ring-1 focus:ring-acid " +
      "transition-colors duration-150",

    // ── Tag / keyword chip ────────────────────────────────────────────────────
    "tag":
      "inline-block rounded-sm px-2 py-0.5 text-xs font-medium " +
      "text-dark-lo bg-dark-raised border border-dark-line " +
      "transition-colors duration-100",

    // ── Callout / alert boxes ─────────────────────────────────────────────────
    "callout-warn":
      "rounded-lg border border-warn/30 bg-warn-bg px-4 py-3 " +
      "text-sm text-warn",

    "callout-info":
      "rounded-lg border border-cyan/30 bg-cyan-muted px-4 py-3 " +
      "text-sm text-cyan",

    "callout-tip":
      "rounded-lg border border-acid/30 bg-acid-muted px-4 py-3 " +
      "text-sm text-acid",

    // ── Step indicator ────────────────────────────────────────────────────────
    "step-indicator":
      "flex items-center justify-center w-7 h-7 rounded-full " +
      "border border-acid/40 text-acid font-mono text-sm font-bold bg-acid-muted",

    // ── Heading section ────────────────────────────────────────────────────────
    "heading-section": "font-heading font-semibold text-dark-hi",

    // ── Layout ────────────────────────────────────────────────────────────────
    "page-container": "mx-auto max-w-6xl px-4",
    "page-gutter":    "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
  },

  // ── Safelist — ensure these are not purged ───────────────────────────────
  // (Required for dynamically constructed class names that the scanner misses)
  safelist: [],
});

// ─── Design Tokens Reference (for documentation) ──────────────────────────────
//
// SPACING SYSTEM (base 4px = 0.25rem):
//   Section padding: py-16 sm:py-20 (4–5rem)
//   Card padding:    p-6 (1.5rem) standard | p-4 (1rem) compact
//   Gap:             gap-4 (cards) | gap-6 (section grid) | gap-3 (inline)
//   Content max-w:   max-w-6xl (site) | max-w-2xl (prose)
//
// GRADIENT DEFINITIONS (apply via <style> in components):
//
//   Aurora hero (animated):
//     background: linear-gradient(135deg, #080c18 0%, #0d1a2e 30%, #0a1f1a 60%, #080c18 100%);
//     background-size: 300% 300%;
//     animation: aurora 10s ease-in-out infinite;
//
//   Gradient border (padding-box technique):
//     background: linear-gradient(#0f1629, #0f1629) padding-box,
//                 linear-gradient(135deg, #00e5a0, #00b4d8) border-box;
//     border: 1px solid transparent;
//
//   Hero heading gradient text:
//     background: linear-gradient(135deg, #e8edf8 20%, #00e5a0 100%);
//     -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//
//   Dot grid pattern:
//     background-image: radial-gradient(circle, #1e2a4a 1px, transparent 1px);
//     background-size: 28px 28px;
//
// TYPE SCALE (set via global CSS, not UnoCSS fontSize shorthand):
//   xs:   12px / lh:1rem    / ls:0.01em
//   sm:   14px / lh:1.25rem / ls:0.005em
//   base: 16px / lh:1.625rem/ ls:0
//   lg:   18px / lh:1.75rem / ls:-0.01em
//   xl:   20px / lh:1.75rem / ls:-0.015em
//   2xl:  24px / lh:2rem    / ls:-0.02em
//   3xl:  30px / lh:2.25rem / ls:-0.025em
//   4xl:  36px / lh:2.5rem  / ls:-0.03em
//   5xl:  48px / lh:1.1     / ls:-0.04em
//   6xl:  60px / lh:1       / ls:-0.05em
//
// ─────────────────────────────────────────────────────────────────────────────
