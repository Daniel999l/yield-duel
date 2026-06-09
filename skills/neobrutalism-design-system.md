---
name: "neobrutalism-design-system"
description: "Neobrutalism Design System for Yield Duel and AI coding agents."
metadata:
  author: typeui.sh
  projectName: "Yield Duel"
  primaryColorReference: "#FDC800"
  surfaceColorReference: "#FBFBF9"
  textColorReference: "#1C293C"
---

# Neobrutalism Design System — Yield Duel Implementation

## Tokens (implemented in `globals.css`)

| Token | Value | Usage |
|-------|-------|-------|
| primary | #FDC800 | CTAs, human player accent, win states |
| secondary | #432DD7 | Agent accent, AI panels |
| success | #16A34A | Wins, positive signals |
| warning | #D97706 | Streaks, status badges |
| danger | #DC2626 | Losses, negative signals |
| surface | #FBFBF9 | Page background |
| text | #1C293C | Body, borders, shadows |
| radius-control | 6px | Buttons, inputs |
| radius-card | 8px | Cards |
| radius-overlay | 12px | Modals |

## Neobrutalism Rules

- **Borders:** 3px solid `text` on all interactive surfaces
- **Shadows:** Hard offset shadows (`3px/5px/8px`), never blur-only
- **Typography:** Inter (UI), JetBrains Mono (hashes, APY, addresses)
- **Press states:** `translate(3px, 3px)` + reduced shadow on active
- **Hover states:** `translate(-2px, -2px)` + increased shadow

## Component Classes

- `.neo-card` — white card with border + 5px shadow
- `.neo-border` — 3px border
- `.neo-shadow-sm` / `.neo-shadow` / `.neo-shadow-lg`
- `.neo-btn-press` / `.neo-btn-lift` — interaction feedback

## QA Checklist

- [ ] All text meets WCAG AA contrast on surface/white
- [ ] Focus-visible outline uses secondary (#432DD7)
- [ ] Sliders and buttons have disabled states
- [ ] No soft drop-shadows without hard offset
- [ ] Spacing follows 4/8/12/16/24/32 grid