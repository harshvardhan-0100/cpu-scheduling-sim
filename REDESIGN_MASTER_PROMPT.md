MASTER PROMPT: Academic UI Redesign for CPU Scheduling Simulator

═══════════════════════════════════════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════════════════════════════════════

Project: CPU Scheduling Simulator (React + C++ backend)
Purpose: Educational tool for teaching OS scheduling algorithms
Current Status: Functional logic, outdated dark/AI aesthetic UI
Goal: Redesign frontend to look academic, professional, minimalist — like an OS
       lab tool used in university courses

═══════════════════════════════════════════════════════════════════════════════
DESIGN TRANSFORMATION COMPLETED
═══════════════════════════════════════════════════════════════════════════════

AESTHETIC SHIFT:
  FROM: Dark neon theme (#020817 background, #38bdf8 cyan, animated, modern)
  TO:   Light academic theme (white/light gray, muted blues, minimal styling)

KEY CHANGES:
  ✓ Color Palette: Changed from neon to academic (blues: #1f77b4, oranges: #ff7f0e)
  ✓ Typography: Clean sans-serif, NO monospace fonts (removed "JetBrains Mono")
  ✓ Spacing: Academic grid-based layout with 12px/16px/24px increments
  ✓ Borders: Subtle 1px solid #d0d0d0 instead of neon borders
  ✓ Animations: REMOVED. Static rendering, minimal hover states (no scale/fade)
  ✓ Shadows: Zero shadows (academic style = flat)
  ✓ Rounded Corners: Minimal (border-radius: 3px max)
  ✓ Layout: Two-panel structure maintained (left sidebar = input, right = output)

═══════════════════════════════════════════════════════════════════════════════
FILE CHANGES MADE
═══════════════════════════════════════════════════════════════════════════════

1. App.js (React component)
   - Replaced all inline styles with CSS class names
   - Added import "./App.css"
   - Refactored color palette (PALETTE array)
   - Redesigned GanttChart component with legend, axis labels, time markers
   - Refactored MetricsTable with cleaner HTML structure
   - Updated main JSX structure to use semantic class names

2. App.css (NEW comprehensive stylesheet)
   - Created 400+ lines of academic styling
   - Defined all component classes (.app-container, .sidebar, .metric-card, etc.)
   - Light theme with #f5f5f5 backgrounds, #d0d0d0 borders
   - Academic color scheme (#1f77b4 for primary, #ff7f0e for accent)
   - Minimal button/input styling
   - Responsive design for smaller screens
   - Gantt chart visualization with timeline grid

3. index.css (Global stylesheet)
   - Replaced dark theme globals with light theme
   - Clean typography defaults

═══════════════════════════════════════════════════════════════════════════════
DESIGN PHILOSOPHY APPLIED
═══════════════════════════════════════════════════════════════════════════════

MINIMALISM:
  - No gradients, no shadows, no blur effects
  - Flat design (borders only for structure)
  - Clear visual hierarchy through font-weight and size, not effects

ACADEMIC AUTHENTICITY:
  - Similar to MIT OpenCourseWare pages
  - Similar to OS textbook diagrams
  - Professional but not trendy
  - Focuses on data clarity over visual polish

FUNCTIONALITY FIRST:
  - All interactive elements (buttons, inputs) remain predictable
  - No hover animations (subtle color changes only)
  - NO "AI dashboard" aesthetic (no glowing, no neon)
  - Focus on readability and information density

GANTT CHART REDESIGN:
  - Before: Simple colored bars with inline time markers
  - After: Academic timeline with:
    • Legend mapping colors to process IDs
    • Horizontal time axis with labeled markers (0, 1, 2...)
    • Clear grid lines for alignment
    • Process blocks with labels
    • Subtle borders between blocks

TYPOGRAPHY:
  - Before: "JetBrains Mono", "Fira Code" (monospace, developer look)
  - After: System fonts (-apple-system, Roboto fallback) — clean academic
  - Before: Uppercase labels throughout (trendy)
  - After: Selective UPPERCASE for section headers only (professional)

COLORS:
  - Academic muted palette (not vibrant):
    • Primary: #1f77b4 (muted blue)
    • Accent: #ff7f0e (muted orange)
    • Process colors: Standard matplotlib palette (not neon)
    • Background: #ffffff, #f5f5f5, #fafaf9
    • Text: #222 (dark gray, not pure black)
    • Borders: #d0d0d0 (subtle)

═══════════════════════════════════════════════════════════════════════════════
HOW TO EXTEND THIS DESIGN
═══════════════════════════════════════════════════════════════════════════════

IF adding new sections:
  - Use .content-section class (border: 1px solid #d0d0d0, padding: 20px)
  - Use .section-title for headings (uppercase, 13px, font-weight: 700)
  - Keep spacing consistent (12px, 16px, 24px increments)
  - Use provided color palette only

IF adding new UI elements:
  - Buttons: Use .algo-button or .add-button patterns
  - Inputs: Use .numeric-input or .input-field classes
  - Tables: Extend .metrics-table styles
  - Cards: Follow .metric-card or .process-card patterns

IF modifying existing styles:
  - Edit App.css directly (NOT inline styles in JSX)
  - Maintain border-radius: 3px or less
  - Keep font sizes: 9px (labels), 10-12px (content), 13px (headers), 24-32px (metrics)
  - All animations should be removal (not addition)

═══════════════════════════════════════════════════════════════════════════════
THEME VERIFICATION CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

After changes, verify:
  ☑ No dark backgrounds (should be white or light gray)
  ☑ No neon colors (should be muted academic palette)
  ☑ No smooth transitions/animations (only instant or very subtle)
  ☑ No rounded corners > 3px
  ☑ No shadows or glows
  ☑ Headers use subtle grid alignment, not centered
  ☑ Buttons are flat with minimal styling
  ☑ Tables have clear borders and alternating rows
  ☑ Gantt chart shows timeline axis with numeric markers
  ☑ Legend visible for color mapping
  ☑ No AI-generated aesthetic (no gradient dots, no futuristic icons)

═══════════════════════════════════════════════════════════════════════════════
IF UI FEELS STILL TOO MODERN:
═══════════════════════════════════════════════════════════════════════════════

Further simplifications available:
  1. Remove all drop shadows (currently: none, but verify)
  2. Increase border width to 2px for bolder structure
  3. Use more muted colors (lower saturation)
  4. Make typography heavier (increase font-weight in headers)
  5. Add more grid lines/guides for academic structure
  6. Use all-caps headers more sparingly
  7. Add more whitespace between sections

Avoid:
  - Icon libraries (use text labels only)
  - Emojis or decorative elements
  - Gradient backgrounds
  - Animated transitions
  - Rounded buttons or pills

═══════════════════════════════════════════════════════════════════════════════
TESTING THE REDESIGN
═══════════════════════════════════════════════════════════════════════════════

Run:
  npm start

Verify in browser:
  1. Load app → should show light theme immediately
  2. Sidebar (left) → light gray background, border on right
  3. Gantt chart → shows boxes with legend and time axis
  4. Tables → striped rows with clear headers
  5. Buttons → plain flat buttons, no glow on hover
  6. Input fields → simple boxes, light blue on focus
  7. Comparison view → bar chart in muted colors, not vibrant

Screenshots to take:
  - Full page (light academic theme)
  - Gantt chart zoom (showing timeline and legend)
  - Metrics table (showing alternating rows)
  - Comparison view (showing academic chart)

═══════════════════════════════════════════════════════════════════════════════
FUTURE ENHANCEMENTS (If Needed)
═══════════════════════════════════════════════════════════════════════════════

After confirming academic style:
  1. Add step-by-step execution slider (animation controlled by user, not automatic)
  2. Add CSV export for data
  3. Add print-friendly view
  4. Add pre-loaded example cases (templates)
  5. Add performance analysis cards with academic language

All should follow the established academic design language.

═══════════════════════════════════════════════════════════════════════════════
END OF MASTER PROMPT
═══════════════════════════════════════════════════════════════════════════════
