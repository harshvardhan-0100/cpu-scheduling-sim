# Visual Design Reference — Academic OS Lab Style

## Color Palette

### Academic Muted Colors (NEW)
```
Primary Blue:     #1f77b4  (used for active states, primary actions)
Accent Orange:    #ff7f0e  (used for highlights, best algorithm badge)
Light Gray BG:    #f5f5f5  (main background)
Off-White:        #fafaf9  (sidebar, cards)
Pure White:       #ffffff  (panels, tables)
Subtle Border:    #d0d0d0  (dividers, borders)
Dark Text:        #222222  (headings)
Medium Text:      #666666  (body text)
Muted Text:       #999999  (labels, hints)
```

### Process Colors (Matplotlib inspired — muted, not neon)
```
Process 1:  #1f77b4  (muted blue)
Process 2:  #ff7f0e  (muted orange)
Process 3:  #2ca02c  (muted green)
Process 4:  #d62728  (muted red)
Process 5:  #9467bd  (muted purple)
Process 6:  #8c564b  (muted brown)
Process 7:  #e377c2  (muted pink)
Process 8:  #7f7f7f  (muted gray)
```

---

## Typography Hierarchy

### Font Stack
```
Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif
Monospace: "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace (only for code)
```

### Font Sizes & Weights
```
Headings (h1):      24px, weight 600, letter-spacing -0.5px
Section Titles:     13px, weight 700, UPPERCASE, letter-spacing 0.5px
Labels:             11px, weight 700, UPPERCASE, letter-spacing 0.5px
Button Text:        12px, weight 500-600
Body Text:          12px, weight 400
Small Text:         10px, weight 500
Labels/Hints:       9px, weight 600, UPPERCASE, letter-spacing 0.4px
```

---

## Layout Grid

### Spacing System (increments of 4px)
```
2px   — micro gaps (internal text spacing)
4px   — tiny spacing
8px   — small spacing
12px  — content padding (inputs, cards)
16px  — medium spacing (between sections within a card)
24px  — large spacing (between major sections)
32px  — extra large spacing (main content padding)
```

### Component Spacing
```
Section padding:        16-20px
Card padding:           12-18px
Input padding:          8px
Button padding:         8-10px vertical, 12-16px horizontal
Gap between items:      6-12px
Gap between sections:   24-28px
```

---

## Borders & Borders

### Border Style
```
Type:       1px solid
Color:      #d0d0d0 (subtle gray)
Radius:     0-3px (NO rounded UI)

Header border:      2px solid #d0d0d0 (bottom)
Sidebar border:     2px solid #d0d0d0 (right)
Card border:        1px solid #d0d0d0
Table border:       1px solid #d0d0d0 (cells), 2px solid #d0d0d0 (header)
Input border:       1px solid #ccc (default), #1f77b4 (focus)
```

### Shadows
```
None. Zero shadows. Flat design only.
```

---

## Button Styles

### Default Button
```
Padding:        8px 16px
Border:         1px solid #ccc
Background:     #ffffff
Color:          #666666
Font:           12px, weight 500
Radius:         3px
Transition:     border-color 0.1s, background-color 0.1s
Hover:          border #999, bg #f9f9f9
Active:         border #1f77b4, bg #e8f4ff, color #1f77b4
```

### Small Button (Add, Remove)
```
Padding:        4-8px
Font:           10px, weight 700
Color:          #1f77b4 (primary color)
Hover:          border #1f77b4, bg #f0f7ff
```

---

## Input Fields

### Text Input
```
Padding:        8px
Border:         1px solid #ccc
Background:     #ffffff (default), #fafaf9 (sidebar)
Color:          #333333
Font:           12px, family inherit
Radius:         3px
Focus:          border #1f77b4, bg #f0f7ff
```

---

## Tables

### Header Row
```
Background:     #f0f0f0
Border:         2px solid #d0d0d0 (bottom)
Padding:        10px 12px
Color:          #333333
Font:           10px, weight 700, UPPERCASE, letter-spacing 0.4px
```

### Data Rows
```
Padding:        10px 12px
Border:         1px solid #e0e0e0 (bottom)
Color:          #666666
Even rows:      background #f9f9f9
Odd rows:       background #ffffff
Hover:          background #f0f7ff (soft blue)
```

---

## Cards & Sections

### Metric Card
```
Border:         1px solid #d0d0d0
Padding:        18px
Background:     #fafaf9
Radius:         3px
Label:          11px, weight 700, UPPERCASE, color #666
Value:          32px, weight 700, color #222, letter-spacing -0.5px
Unit:           11px, color #999, margin-top 4px
```

### Content Section
```
Border:         1px solid #d0d0d0
Padding:        20px
Background:     #ffffff
Radius:         3px
Title:          13px, weight 700, UPPERCASE, color #222, letter-spacing 0.5px
Title margin:   0 0 16px 0
```

---

## Gantt Chart

### Legend
```
Layout:         Horizontal flex, space-between
Title:          11px, weight 600, UPPERCASE, color #222
Items:          Flex gap 16px
Item:           Color box (12x12px) + label
Color box:      border 1px solid #999
```

### Timeline/Axis
```
Height:         40px (bars)
Border:         1px solid #ccc
Background:     #ffffff
Blocks:         Flex items with no min-width restriction
Border between: 1px solid rgba(255,255,255,0.3)
Label:          11px, weight 600, color #ffffff, text-shadow 0 1px 2px rgba(0,0,0,0.2)
```

### Time Markers
```
Font:           9-10px
Color:          #999999
Spacing:        Flex-based, distributes evenly
```

---

## Comparison Dashboard

### Bar Chart (Recharts)
```
Axis lines:     #999
Axis labels:    #555, font 11px
Grid:           #d0d0d0 dashed 3px 3px
Bars:           #1f77b4 (blue) and #ff7f0e (orange)
Tooltip bg:     #f9f9f9
Tooltip border: 1px solid #ccc
No glow, no animation
```

---

## Sidebar

### Structure
```
Background:     #fafaf9
Border:         2px solid #d0d0d0 (right side)
Padding:        24px
Gap between sections: 24px
```

### Process Card
```
Border:         1px solid #d0d0d0
Padding:        10px
Background:     #ffffff
Radius:         3px
Header:         Flex space-between (PID label + remove button)
PID color:      #1f77b4
Inputs:         Grid 3 columns, small styling
```

---

## Main Panel

### Structure
```
Padding:        32px
Background:     #ffffff
Grid layout:    Flex column, gap 28px between sections
Overflow:       Vertical scroll allowed
```

### Header
```
Background:     #fafaf9
Border:         2px solid #d0d0d0 (bottom)
Padding:        24px 32px
Display:        Flex space-between
Title:          24px, weight 600
Subtitle:       13px, color #666
Tabs:           Flex gap 8px
```

---

## Responsive Design

### Breakpoints
```
Desktop:        >= 900px
Tablet:         900px - 768px
Mobile:         < 768px
```

### Mobile Changes
```
Sidebar:        Changes to horizontal or hidden
Layout:         Single column
Padding:        Reduced to 16px
Font sizes:     Slightly reduced (11px min)
Card width:     100% (no grid)
```

---

## Animation Guidelines

### Current Implementation
```
NO animations on page load
NO smooth transitions on interactions
NO hover animations
NO scroll animations
```

### If Future Animation Needed
```
User-controlled: Slider for step-by-step execution (user clicks next)
Focus shifts: Subtle color changes only (0s transition)
Loading: Simple spinner if needed, not animated background
```

---

## Accessibility

### Color Contrast
```
Text on light bg:   >= 4.5:1 contrast ratio
All text readable   No reliance on color alone
```

### Interactive Elements
```
Buttons:            Clear hover state (color + border change)
Links:              Underlined or color + weight change
Form labels:        Always present, clear
Focus states:       Visible border change
```

---

## Do's and Don'ts

### ✅ DO
- Use subtle borders (#d0d0d0)
- Implement flat design (no shadows)
- Use academic color palette
- Add hover states (color + border)
- Keep spacing consistent (4px grid)
- Use clear typography hierarchy
- Maintain white/light backgrounds
- Include clear labels and headings

### ❌ DON'T
- Add gradients
- Use shadows or glows
- Use neon or vibrant colors
- Add smooth animations
- Use rounded corners > 3px
- Relying on decorative icons
- Dark backgrounds
- Excessive whitespace on data
- Trendy or flashy effects

---

## Reference Projects (Aesthetic Inspiration)

If you want to maintain this style:
- **MIT OpenCourseWare** pages
- **Academic textbooks** (OS diagrams)
- **GitHub** (light enterprise theme)
- **Arxiv.org** (research paper browser)
- **Professional documentation sites** (Stripe, GitHub Docs)

---

## Color Code Cheat Sheet (For Quick Reference)

```css
/* Primary */
--primary: #1f77b4;
--accent: #ff7f0e;

/* Backgrounds */
--bg-main: #ffffff;
--bg-alt: #f5f5f5;
--bg-light: #fafaf9;
--bg-hover: #f0f7ff;

/* Borders & Dividers */
--border: #d0d0d0;
--border-light: #e0e0e0;

/* Text */
--text-dark: #222222;
--text-main: #666666;
--text-muted: #999999;

/* Process Colors */
--process-1: #1f77b4;
--process-2: #ff7f0e;
--process-3: #2ca02c;
--process-4: #d62728;
--process-5: #9467bd;
```

---

**This guide ensures all future changes maintain the clean, academic, professional aesthetic of your CPU Scheduling Simulator.**

