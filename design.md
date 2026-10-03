# Design System

> AI-targeted design specification — describes the visual language so that any model can accurately reproduce the look and feel using Tailwind CSS v3 utility classes.

---

## 1. Colour Palette

### 1.1 Primary

| Token          | Value     | TW Usage                                   |
| :------------- | :-------- | :----------------------------------------- |
| `primary-50`   | `#eef3ff` | Lightest backgrounds, badges               |
| `primary-100`  | `#dae4ff` | Icon container backgrounds                 |
| `primary-200`  | `#bdd0ff` | Not currently used                         |
| `primary-300`  | `#90b1ff` | Not currently used                         |
| `primary-400`  | `#5d87ff` | **Default primary**: buttons, icons, rings |
| `primary-500`  | `#3563e9` | **Hover state** for primary elements       |
| `primary-600`  | `#2546d0` | Hero gradient start, text links            |
| `primary-700`  | `#1e36a9` | Hero gradient mid, hover text links        |
| `primary-800`  | `#1e3089` | Not currently used                         |
| `primary-900`  | `#1e2b6f` | Hero gradient end                          |

- All primary interactive elements use `primary-400` as base and `primary-500` as hover.
- The hero section uses a gradient from `primary-600` → `primary-700` → `primary-900`.

### 1.2 Structural

These are the app's neutral/structural text and background colours — not exclusive to a sidebar widget.

| Token              | Value     | Usage                                     |
| :----------------- | :-------- | :---------------------------------------- |
| `sidebar-bg`       | `#ffffff` | Navbar and footer backgrounds             |
| `sidebar-hover`    | `#f5f7fb` | Nav link hover BG, mobile nav items       |
| `sidebar-active`   | `#eef3ff` | Active nav item (not currently visualised)|
| `sidebar-text`     | `#2A3547` | **Body text**, headings, labels           |
| `sidebar-muted`    | `#7C8FAC` | **Muted/secondary text**, placeholders    |

### 1.3 Surface

| Token              | Value     | Usage                                      |
| :----------------- | :-------- | :----------------------------------------- |
| `surface` (DFLT)   | `#F6F9FC` | Page background                            |
| `surface-card`     | `#ffffff` | Card backgrounds                           |
| `surface-border`   | `#EBF1FF` | Card borders, table dividers, footer lines |

### 1.4 Semantic

These are NOT custom tokens — they use stock Tailwind colours.

#### Status

| Status     | BG              | Text               | Border               |
| :--------- | :-------------- | :----------------- | :------------------- |
| **State A**| `bg-amber-50`   | `text-amber-700`   | `border-amber-200`   |
| **State B**| `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` |
| **State C**| `bg-blue-50`    | `text-blue-700`    | `border-blue-200`    |

#### Actions

| Action       | BG                | Hover               | Focus Ring            |
| :----------- | :---------------- | :------------------ | :-------------------- |
| **Danger**   | `bg-red-500`      | `bg-red-600`        | `ring-red-500`        |
| **Success**  | `bg-emerald-500`  | `bg-emerald-600`    | `ring-emerald-500`    |

> **Legend:** TW = Tailwind CSS class prefix.

- Error alerts: `bg-red-50`, `border-red-200`, `text-red-700`.
- Stat card left-border accents (dash): `border-amber-400`, `border-emerald-400`, `border-blue-400`.

---

## 2. Typography

### 2.1 Font Stack

```
font-family: "Inter", system-ui, -apple-system, sans-serif
```

Tailwind: `font-sans` (configured via `tailwind.config.js` extend).

Weights: `400` (regular), `500` (medium), `600` (semibold), `700` (bold).

### 2.2 Type Scale

| Role            | TW Classes                                                          | Usage                                     |
| :-------------- | :------------------------------------------------------------------ | :---------------------------------------- |
| **Hero**        | `text-5xl md:text-7xl font-bold tracking-tight`                     | Landing page main heading                 |
| **Page Title**  | `text-2xl font-bold` (via `.page-title`)                            | Every page `<h1>`                         |
| **Card Header** | `text-lg font-semibold`                                             | Card header, grouped section headings     |
| **Section**     | `text-3xl font-bold`                                                | Landing page section heading              |
| **Body**        | `text-sm`                                                           | Inputs, table cells, form labels          |
| **Label**       | `text-xs text-sidebar-muted uppercase tracking-wider`               | Column headers, detail-card field labels  |
| **Micro**       | `text-xs`                                                           | Footer links, help text, badges           |

Body text colour: `text-sidebar-text` (`#2A3547`).
Muted text colour: `text-sidebar-muted` (`#7C8FAC`).
Placeholder text: `placeholder:text-[#7C8FAC]`.

---

## 3. Spacing & Layout

### 3.1 Page Shell

```html
<body class="min-h-screen flex flex-col">
  <!-- navbar (sticky) -->
  <main class="flex-1">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- page content -->
    </div>
  </main>
  <!-- footer -->
</body>
```

| Property            | Value                                |
| :------------------ | :----------------------------------- |
| Max width           | `max-w-7xl`                          |
| Horizontal padding  | `px-4 sm:px-6 lg:px-8`              |
| Main vertical pad   | `py-6`                               |
| Section gap         | `space-y-6`                          |

### 3.2 Auth Pages

Centred card layout:

```html
<div class="flex items-center justify-center py-12">
  <div class="w-full max-w-md">
    <div class="card p-8">
      <!-- form -->
    </div>
  </div>
</div>
```

| Property            | Value              |
| :------------------ | :----------------- |
| Card max width      | `max-w-md`         |
| Card internal pad   | `p-8`              |
| Form field gap      | `space-y-4`        |

### 3.3 Stats Grid (Dashboard)

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
```

### 3.4 Feature Cards Grid (Landing)

```html
<div class="grid md:grid-cols-3 gap-8">
```

---

## 4. Components

### 4.1 Buttons

**Base:** `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`

| Variant       | CSS               | BG                    | Text                | Hover                          | Focus Ring          |
| :------------ | :---------------- | :-------------------- | :------------------ | :----------------------------- | :------------------ |
| **Primary**   | `.btn-primary`    | `bg-primary-400`      | `white`             | `bg-primary-500`               | `ring-primary-400`  |
| **Secondary** | `.btn-secondary`  | `bg-white` + `border-gray-200` | `text-sidebar-text` | `bg-gray-50` + `border-gray-300` | `ring-primary-400`  |
| **Danger**    | `.btn-danger`     | `bg-red-500`          | `white`             | `bg-red-600`                   | `ring-red-500`      |
| **Success**   | `.btn-success`    | `bg-emerald-500`      | `white`             | `bg-emerald-600`               | `ring-emerald-500`  |

| Variant           | Classes                              | Usage                                     |
| :---------------- | :----------------------------------- | :---------------------------------------- |
| Compact           | `!text-xs !px-3 !py-1.5`             | Table actions, nav logout                 |
| Full-width        | `w-full !py-2.5`                     | Auth form submit                          |

### 4.2 Cards

```css
.card {
  @apply rounded-xl border border-surface-border bg-surface-card shadow-card;
}
```

| Variant                   | Additional Classes                              |
| :------------------------ | :---------------------------------------------- |
| Default                   | —                                               |
| Card header               | `px-6 py-4 border-b border-gray-100`            |
| Card body                 | `p-6`                                           |
| Feature card (landing)    | `p-8 text-center hover:shadow-md transition-shadow` |

- Default card: `rounded-xl`, white BG, light blue-grey border, subtle shadow.
- Card header: bottom border divider, padding `px-6 py-4`.
- Card body: padding `p-6`.

### 4.3 Stat Cards

```css
.stat-card {
  @apply rounded-xl border border-surface-border bg-surface-card shadow-card p-5;
}
```

| Element      | Classes                                              |
| :----------- | :--------------------------------------------------- |
| Stat value   | `text-3xl font-bold`                                 |
| Stat label   | `text-sidebar-muted text-sm font-medium`             |
| Left accent  | `border-l-4 border-{colour}-400`                     |

Stat cards with coloured left-border accents use `border-l-4` plus the appropriate colour class.

### 4.4 Inputs

```css
.input-field {
  @apply block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-sidebar-text shadow-sm placeholder:text-[#7C8FAC] focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 transition-all;
}
```

Error state:

```css
.input-error {
  @apply border-red-400 text-red-700 focus:border-red-500 focus:ring-red-500/20;
}
```

### 4.5 Labels

```css
.label {
  @apply block text-sm font-medium text-sidebar-text mb-1.5;
}
```

### 4.6 Badges

```css
.badge         { @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium; }
.badge-state-a { @apply badge bg-amber-50 text-amber-700 border border-amber-200; }
.badge-state-b { @apply badge bg-emerald-50 text-emerald-700 border border-emerald-200; }
.badge-state-c { @apply badge bg-blue-50 text-blue-700 border border-blue-200; }
```

Role/accent badge (non-status, inline use):

```html
<span class="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-500 border border-primary-100 capitalize">
  role-name
</span>
```

### 4.7 Tables

```html
<div class="card">
  <div class="px-6 py-4 border-b border-gray-100">
    <h2 class="text-lg font-semibold text-sidebar-text">Table Title</h2>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 text-left">
          <th class="px-3 sm:px-6 py-3 font-medium text-sidebar-muted text-xs uppercase tracking-wider">Col</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-3 sm:px-6 py-4">Data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

| Pattern              | Classes                                                |
| :------------------- | :----------------------------------------------------- |
| Monospace cells      | `font-mono font-medium` (e.g. reference IDs)           |
| Empty state          | `<td colspan="N" class="py-8 text-center text-gray-400">...</td>` |
| Mobile scroll        | `overflow-x-auto` on wrapper                           |
| Mobile cell pad      | `px-3` vs desktop `px-6`                               |

### 4.8 Detail Field Grids

```html
<div class="card p-6">
  <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
    <div>
      <p class="text-xs text-sidebar-muted uppercase tracking-wider">Label</p>
      <p class="font-medium mt-1">Value</p>
    </div>
    <!-- more fields... -->
  </div>
</div>
```

### 4.9 Form Layout (Standard Page)

```html
<div class="card">
  <div class="px-6 py-4 border-b border-surface-border">
    <h2 class="text-lg font-semibold text-sidebar-text">Form Section</h2>
  </div>
  <form class="p-6 space-y-4">
    <div>
      <label class="label" for="field">Field Label</label>
      <input class="input-field" id="field" name="field" />
    </div>
    <div class="flex items-center justify-end space-x-3 pt-2">
      <a href="..." class="btn-secondary">Cancel</a>
      <button type="submit" class="btn-primary">Save</button>
    </div>
  </form>
</div>
```

- Form actions are right-aligned, separated by `space-x-3`.

### 4.10 Error Alert

```html
<div class="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
  <p class="text-red-700 text-sm">Error message</p>
</div>
```

### 4.11 Search Bar Pattern

```html
<form method="GET" class="flex flex-wrap items-center gap-2">
  <input type="text" class="input-field text-sm font-mono w-full sm:w-40" maxlength="6" />
  <input type="date" class="input-field text-sm w-full sm:w-auto" />
  <button type="submit" class="btn-primary !text-xs !px-3 !py-1.5 w-full sm:w-auto">Search</button>
</form>
```

---

## 5. Navigation

### 5.1 Top Navbar

| Property            | Value                                                               |
| :------------------ | :------------------------------------------------------------------ |
| Position            | `sticky top-0 z-50`                                                 |
| Background          | `bg-white border-b border-surface-border shadow-nav`                |
| Height              | `h-16`                                                              |
| Content container   | `max-w-7xl` + `justify-between` flex                                |
| Logo                | `w-8 h-8 bg-primary-400 rounded-lg` square with white initial       |
| Logo text           | `text-lg font-bold text-sidebar-text` next to logo                  |
| Desktop nav links   | `text-sidebar-text hover:text-primary-400 hover:bg-sidebar-hover px-3 py-2 rounded-lg text-sm font-medium transition-colors` |
| User info area      | `hidden md:flex` — role badge + name                                |
| Secondary action    | `btn-secondary !text-xs !px-3 !py-1.5` (e.g. logout)               |

### 5.2 Mobile Menu

| Element             | Classes / Notes                                                                 |
| :------------------ | :------------------------------------------------------------------------------ |
| Toggle button       | `md:hidden` hamburger icon, swaps to X via JS                                   |
| Menu panel          | `md:hidden hidden border-t border-surface-border bg-white shadow-lg`            |
| Mobile nav links    | `.mobile-nav-link` — `block px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:text-primary-400 hover:bg-sidebar-hover transition-colors` |
| User info (mobile)  | Shown at top of menu panel with bottom border divider                           |

### 5.3 Footer

| Section             | Classes                                                          |
| :------------------ | :--------------------------------------------------------------- |
| Container BG        | `bg-white border-t border-surface-border mt-auto`                |
| Content             | `max-w-7xl` + `py-6`                                             |
| Link columns        | `grid grid-cols-2 md:grid-cols-4 gap-6 pb-5 border-b border-surface-border mb-4` |
| Column headings     | `text-xs font-semibold text-sidebar-text uppercase tracking-wider`|
| Links               | `text-xs text-sidebar-muted hover:text-primary-500 transition-colors` |
| Bottom bar          | Flexbox with small logo square + `text-sidebar-muted text-sm` copyright |

---

## 6. Landing Page

### 6.1 Hero Section

```html
<section class="relative overflow-hidden rounded-3xl">
  <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900"></div>
  <!-- svg pattern overlay at opacity-10 for texture -->
  <div class="max-w-7xl ... py-24 md:py-32 relative z-10">
    <!-- centred content -->
  </div>
</section>
```

| Element             | Classes                                                                 |
| :------------------ | :---------------------------------------------------------------------- |
| Background          | `bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900`     |
| Texture overlay     | Inline SVG dot-grid, `absolute inset-0 opacity-10`                      |
| Large logo          | `w-16 h-16 bg-white/20 backdrop-blur rounded-2xl` with white initial    |
| Title               | `text-5xl md:text-7xl font-bold text-white tracking-tight`              |
| Subtitle            | `text-xl md:text-2xl text-primary-100 mb-4 font-light`                  |
| Description         | `text-primary-200 max-w-2xl mx-auto mb-10 text-lg`                      |
| CTA primary         | White filled: `bg-white text-primary-700 font-semibold rounded-xl px-8 py-3.5 shadow-lg` |
| CTA secondary       | White outlined: `border border-white/30 text-white rounded-xl px-8 py-3.5` |

### 6.2 Features Section

```html
<section class="py-20 bg-surface">
  <!-- section heading -->
  <div class="grid md:grid-cols-3 gap-8">
    <div class="card p-8 text-center hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <!-- svg icon -->
      </div>
      <h3 class="text-lg font-semibold text-sidebar-text mb-2">Title</h3>
      <p class="text-sidebar-muted text-sm">Description</p>
    </div>
  </div>
</section>
```

- Icon containers: `bg-primary-100` with icon in `text-primary-600`.

---

## 7. Shadows

| Token                | Box Shadow                                                                                  | Usage                |
| :------------------- | :------------------------------------------------------------------------------------------ | :------------------- |
| `shadow-card`        | `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`                         | Cards, stat cards    |
| `shadow-card-hover`  | `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`                      | Feature cards hover  |
| `shadow-nav`         | `0 1px 3px 0 rgb(0 0 0 / 0.04)`                                                            | Navbar               |

---

## 8. Iconography

All icons are **inline SVGs** with these attributes:

| Attribute           | Value                                    |
| :------------------ | :--------------------------------------- |
| Base class          | `w-5 h-5`                                |
| Button icon class   | `w-3.5 h-3.5`                            |
| Feature icon class  | `w-6 h-6`                                |
| Fill                | `fill="none"`                            |
| Stroke              | `stroke="currentColor"`                  |
| Stroke style        | `stroke-linecap="round" stroke-linejoin="round" stroke-width="2"` |
| ViewBox             | `viewBox="0 0 24 24"`                    |

> No icon library is used — all icons are hand-crafted SVG paths.

---

## 9. Modal Overlay (Consent / Dialog)

| Section             | Classes                                                                        |
| :------------------ | :----------------------------------------------------------------------------- |
| Overlay             | `fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4`      |
| Backdrop            | `fixed inset-0 bg-black/40`                                                    |
| Dialog              | `max-w-lg bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-surface-border` |
| Icon container      | Icon in `bg-primary-100` rounded container                                     |
| Actions             | Right-aligned flex with `space-x-3`, Decline (`btn-secondary`) + Accept (`btn-primary`) |
| Initial state       | `hidden`, toggled via external JS                                              |

---

## 10. CSS Component Class Summary

All custom reusable classes are defined in `@layer components` in the Tailwind input CSS.

| Class                | Purpose                                    |
| :------------------- | :----------------------------------------- |
| `.btn-primary`       | Primary action button                      |
| `.btn-secondary`     | Secondary/outline button                   |
| `.btn-danger`        | Destructive action button                  |
| `.btn-success`       | Positive/confirm action button             |
| `.input-field`       | Text, email, password, date inputs         |
| `.input-error`       | Input validation error state               |
| `.label`             | Form field label                           |
| `.card`              | Container with border and shadow           |
| `.card-hover`        | Card with hover shadow effect              |
| `.badge`             | Base badge (prefer semantic variants)      |
| `.badge-state-a`     | Amber status badge                         |
| `.badge-state-b`     | Emerald status badge                       |
| `.badge-state-c`     | Blue status badge                          |
| `.stat-card`         | Dashboard metric card                      |
| `.page-title`        | Page `<h1>` styling                        |
| `.page-subtitle`     | Subtitle below page title                  |
| `.mobile-nav-link`   | Mobile nav menu item                       |

---

## 11. Page-Level Composition Patterns

### 11.1 List/Index Page (CRUD)

```
Page Title + Subtitle
[Optional: Create button (top-right or top-left above table)]
[Optional: Search bar]
Card > Card header + Table (with action buttons per row)
```

### 11.2 Dashboard

```
Page Title + Subtitle
[Optional: Search form with text + date inputs]
Stat cards (2-col → 4-col grid)
Grouped sections (cards per category/date) each containing a table
```

### 11.3 Detail/View Page

```
Page Title (with Back button)
Detail field grid card
Subordinate data table card(s)
```

### 11.4 Form Page (Create/Edit)

```
Page Title (with Back button)
Card > Card header + Form body + Action buttons (Cancel/Save)
```

### 11.5 Auth Pages

```
Centred card with logo icon + heading + form + alt-action link
```

---

## 12. Responsive Behaviour

| Breakpoint | Value  |
| :--------- | :----- |
| `sm`       | 640px  |
| `md`       | 768px  |
| `lg`       | 1024px |

| Component            | Mobile                           | Desktop                      |
| :------------------- | :------------------------------- | :--------------------------- |
| Nav links            | `hidden`                         | `md:flex`                    |
| Hamburger            | `block`                          | `md:hidden`                  |
| Stat cards grid      | `grid-cols-2`                    | `md:grid-cols-4`             |
| Features grid        | stacked                          | `md:grid-cols-3`             |
| Tables               | `overflow-x-auto`, `px-3` cells  | `px-6` cells                 |
| Search bar
 | inputs + button stacked          | `sm:` inline                 |
| Detail field grid    | `grid-cols-2`                    | `md:grid-cols-5`             |
| Form buttons         | `w-full`                         | `sm:w-auto`                  |
| Modal overlay        | `items-end` (bottom)             | `sm:items-center` (centred)  |

---

## 13. Design Principles

1. **Clean & minimal** — Ample whitespace, restrained palette, no unnecessary decoration.
2. **High contrast** — `#2A3547` text on `#F6F9FC` / `#FFFFFF` backgrounds meets WCAG AA.
3. **Consistent radius** — `rounded-lg` for inputs/buttons, `rounded-xl` for cards, `rounded-full` for badges.
4. **Subtle depth** — Light shadows (`shadow-card`, `shadow-nav`) provide layering without heavy drop shadows.
5. **State clarity** — Every interactive element has hover, focus (ring), and disabled states.
6. **No client-side frameworks** — All interactivity via vanilla JS in external files.
7. **No inline styles** — All styling via Tailwind utility classes or `@apply` component classes.

---

**Legend:** TW = Tailwind CSS class prefix, BG = Background, DFLT = Default.
