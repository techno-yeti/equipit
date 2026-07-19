# TailwindCSS Components and Design Tokens

All reusable UI components are defined in the TailwindCSS `@layer components` directive within `app.css`. The custom color palette is defined in `tailwind.config.js` under the `theme.extend.colors` key.

---

## Custom Color Palette

### Primary Blue Scale

| Token         | Hex       | Usage                               |
| ------------- | --------- | ----------------------------------- |
| `primary-50`  | `#eef3ff` | Light backgrounds, hover states     |
| `primary-100` | `#dae4ff` | Selected states                     |
| `primary-200` | `#bdd0ff` | Borders / muted accents             |
| `primary-300` | `#90b1ff` | Interactive element borders         |
| `primary-400` | `#5d87ff` | **Default button, primary actions** |
| `primary-500` | `#3563e9` | Hover states on primary elements    |
| `primary-600` | `#2546d0` | Active states                       |
| `primary-700` | `#1e36a9` | Dark text / headings on light bg    |
| `primary-800` | `#1e3089` | Darker variant                      |
| `primary-900` | `#1e2b6f` | Darkest variant, deep accents       |

### Sidebar / Navigation

| Token            | Hex       | Usage                      |
| ---------------- | --------- | -------------------------- |
| `sidebar-bg`     | `#ffffff` | Sidebar background         |
| `sidebar-hover`  | `#f5f7fb` | Nav item hover background  |
| `sidebar-active` | `#eef3ff` | Nav item active background |
| `sidebar-text`   | `#2A3547` | Nav item text color        |
| `sidebar-muted`  | `#7C8FAC` | Secondary / muted text     |

### Surface / Layout Colors

| Token            | Hex       | Usage                       |
| ---------------- | --------- | --------------------------- |
| `surface`        | `#F6F9FC` | Page background             |
| `surface-card`   | `#ffffff` | Card / container background |
| `surface-border` | `#EBF1FF` | Subtle borders              |

---

## Button Components

### `.btn-primary`

- Background: `#5d87ff` (primary-400)
- Text: white
- Border radius: `rounded-lg`
- Padding: `px-4 py-2`
- Hover: `bg-[#4b6fe0]` (primary-500)
- Focus: `ring-2 ring-[#5d87ff] ring-offset-2`
- Transition: `transition-colors duration-150`

### `.btn-secondary`

- Background: white
- Border: `border border-gray-300`
- Text: `text-gray-700`
- Hover: `bg-gray-50`
- Focus: same ring style as primary

### `.btn-danger`

- Background: `#ef4444` (red-500)
- Text: white
- Hover: `bg-red-600`
- Focus: `ring-2 ring-red-500 ring-offset-2`

### `.btn-success`

- Background: `emerald-500`
- Text: white
- Hover: `bg-emerald-600`
- Focus: `ring-2 ring-emerald-500 ring-offset-2`

---

## Form Components

### `.input-field`

- Border: `border border-gray-300`
- Border radius: `rounded-lg`
- Padding: `px-3 py-2`
- Width: `w-full`
- Focus state: `ring-2 ring-[#5d87ff] ring-offset-1 outline-none`
- Placeholder color: `#7C8FAC`
- Text size: `text-sm`

### `.input-error`

- Inherits all styles from `.input-field`
- Border color: `border-red-500`
- Focus ring: `ring-red-500`

### `.label`

- Display: `block`
- Text: `text-sm font-medium text-gray-700`
- Margin: `mb-1`

---

## Container Components

### `.card`

- Background: white
- Border: `border border-[#EBF1FF]`
- Border radius: `rounded-xl`
- Shadow: `shadow-sm`
- Padding: `p-6`

### `.card-hover`

- Inherits all styles from `.card`
- Hover state: `shadow-md`
- Transition: `transition-shadow duration-200`

---

## Badge Components

### `.badge`

- Display: `inline-flex`
- Border radius: `rounded-full` (pill shape)
- Padding: `px-2.5 py-0.5`
- Font size: `text-xs`
- Font weight: `font-medium`

### `.badge-pending`

- Inherits `.badge`
- Background: amber-100
- Text: amber-800

### `.badge-fulfilled`

- Inherits `.badge`
- Background: emerald-100
- Text: emerald-800

### `.badge-dispatched`

- Inherits `.badge`
- Background: blue-100
- Text: blue-800

---

## Dashboard / Heading Components

### `.stat-card`

- Inherits `.card`
- Additional: flex layout, stat value in large bold text, stat label in muted small text

### `.page-title`

- Font size: `text-2xl`
- Font weight: `font-bold`
- Color: `text-gray-900`

### `.page-subtitle`

- Font size: `text-sm`
- Color: `text-gray-500`
- Margin: `mt-1`
- Purpose: muted description line displayed below the page title
