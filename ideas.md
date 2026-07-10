# Brutalist Portfolio - Design Philosophy

## Design Movement & Aesthetic
**Brutalism for Digital**: Raw, honest, and unapologetic. Inspired by brutalist architecture's massive concrete forms, exposed structure, and geometric purity. Applied to web: bold typography, stark contrast, minimal ornamentation, and deliberate negative space.

## Core Principles
1. **Structural Honesty**: Every element serves a purpose. No decorative flourishes—only intentional geometry and typography.
2. **Monumental Scale**: Large, commanding typography and generous spacing create presence and gravitas.
3. **High Contrast**: Black/white/gray palette with sharp edges. No gradients or soft transitions.
4. **Vertical Rhythm**: Content flows downward in distinct, full-height sections—each section is a "floor" in the brutalist structure.

## Color Philosophy
- **Primary**: Pure black (`#000000`) and off-white (`#f5f5f5`)
- **Accent**: Industrial gray (`#2a2a2a`, `#666666`)
- **Reasoning**: Mimics raw concrete, steel, and exposed materials. No warmth or softness—pure industrial aesthetic.

## Layout Paradigm
- **Full-Height Sections**: Each project/section occupies 100vh (or close to it)
- **Snap Scroll**: Smooth scroll-snapping between sections creates a "floor-by-floor" navigation
- **Asymmetric Grid**: Content is not centered; instead, it's anchored to the left or right with generous whitespace on the opposite side
- **No Floating Elements**: Everything is grounded to the baseline grid

## Signature Elements
1. **Thick Borders & Frames**: Heavy black borders (4-8px) around project images and key content blocks
2. **Monolithic Typography**: Oversized sans-serif headlines (72px+) that dominate the viewport
3. **Geometric Dividers**: Stark horizontal and vertical lines that separate sections—no curves or gradients

## Interaction Philosophy
- **Instant Feedback**: Hover states are sharp and immediate—no easing, just toggle
- **Minimal Animation**: Only essential transitions (fade, scale) when moving between sections
- **Keyboard-Driven**: Full keyboard navigation for portfolio projects
- **No Micro-Interactions**: Avoid playful animations; interactions are functional and direct

## Animation Guidelines
- **Snap-Scroll Transitions**: When scrolling to a new section, fade in the content (200ms) with a slight scale-up (0.98 → 1.0)
- **Project Hover**: On hover, add a 2px inset shadow or border highlight (100ms ease-out)
- **Section Entry**: Stagger text elements by 50ms each as they enter the viewport
- **No Easing**: Use `ease-out` only; avoid `ease-in` (feels sluggish for brutalism)

## Typography System
- **Display Font**: IBM Plex Mono (monospace, bold) for headlines—evokes technical/industrial feel
- **Body Font**: IBM Plex Sans (sans-serif, regular) for body text—clean and readable
- **Hierarchy**:
  - H1: 72px, IBM Plex Mono, bold, letter-spacing: -2px
  - H2: 48px, IBM Plex Mono, bold
  - Body: 16px, IBM Plex Sans, regular, line-height: 1.6

## Brand Essence
**Positioning**: A portfolio that showcases work with the same uncompromising honesty as brutalist architecture—no fluff, no trends, just pure craft.

**Personality**: 
- Uncompromising
- Structural
- Direct

## Brand Voice
- **Headlines**: Bold, declarative statements. No questions, no soft language.
- **CTAs**: Action-oriented, minimal. "View Work" not "Explore Our Portfolio"
- **Microcopy**: Technical, precise. Avoid marketing speak.

**Example Lines**:
- "Crafted with intention. Built to last."
- "Form follows function. Always."

## Wordmark & Logo
A bold geometric mark: a thick-bordered square with internal grid lines, suggesting both structure and containment. No text, just the symbol. Use solid black on white, or white on black.

## Signature Brand Color
**Industrial Black** (`#1a1a1a`): Unmistakably brutalist. Used for borders, text, and structural elements.

---

## Implementation Notes
- **Snap-Scroll**: Use CSS `scroll-snap-type: y mandatory` on the body and `scroll-snap-align: start` on sections
- **Responsive**: On mobile, reduce font sizes (H1: 48px, H2: 32px) but maintain the same proportional hierarchy
- **No Rounded Corners**: All elements use sharp 90-degree angles
- **Borders Over Shadows**: Use thick borders instead of drop shadows for depth
