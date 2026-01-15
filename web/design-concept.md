# UI/UX Design System & Principles

## 1. Layout & Architecture
- **Max Width:** The main content container must strictly use `max-w-7xl` with `mx-auto`.
- **Navigation:** Use a **Top Navigation Bar** pattern.
- **Compactness:** Since the menu is small (2-3 items), prioritize high-density information display in the main content area.

## 2. Mobile-First Responsive Design

### **Core Philosophy**
- **Mobile First:** Design and develop for mobile screens first, then progressively enhance for larger screens.
- **Breakpoint Strategy:** Use Tailwind's default breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) consistently.
  - Base styles = Mobile (< 640px)
  - `sm:` = Small tablets (≥ 640px)
  - `md:` = Tablets (≥ 768px)
  - `lg:` = Desktop (≥ 1024px)
  - `xl:` = Large desktop (≥ 1280px)

### **Touch Targets & Spacing**
- **Minimum Touch Target:** All interactive elements (buttons, links, inputs) must be at least `44px × 44px` (use `min-h-11` or `h-11` for buttons).
- **Spacing:** Use generous padding on mobile (`p-4`, `p-6`) and adjust for desktop (`lg:p-8`, `lg:p-10`).
- **Safe Areas:** Ensure critical content and actions are not placed at screen edges on mobile.

### **Navigation Patterns**
- **Mobile Navigation:**
  - Use a hamburger menu or bottom navigation for mobile if menu items exceed 3.
  - For 2-3 items, a compact top bar with icons + labels is acceptable.
  - Ensure the navigation is sticky (`sticky top-0`) with appropriate z-index.
- **Desktop Navigation:** Expand to full horizontal menu with text labels.

### **Typography & Readability**
- **Font Sizes:** Start with readable mobile sizes:
  - Body text: `text-base` (16px) minimum
  - Headings: `text-xl` to `text-2xl` on mobile, scale up with `lg:text-3xl`, `lg:text-4xl`
- **Line Height:** Use generous line heights (`leading-relaxed`) for better mobile readability.
- **Line Length:** Limit text width on large screens (use `max-w-prose` or `max-w-3xl` for content).

### **Component Adaptations**

#### **Tables**
- **Mobile:** Convert to card-based layouts or use horizontal scroll with `overflow-x-auto`.
- **Desktop:** Display as traditional tables with full columns.

#### **Forms**
- **Mobile:** Stack form fields vertically with full width (`w-full`).
- **Desktop:** Use grid layouts (`grid-cols-2`, `grid-cols-3`) for compact forms.
- **Input Size:** Use larger inputs on mobile (`h-11` or `h-12`) for easier touch interaction.

#### **Cards & Containers**
- **Mobile:** Full-width cards with minimal margins (`mx-2` or `mx-4`).
- **Desktop:** Grid layouts with appropriate gaps (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

#### **Modals & Dialogs**
- **Mobile:** Full-screen or near full-screen modals (`w-full h-full` or `max-h-[90vh]`).
- **Desktop:** Centered modals with max-width constraints (`max-w-lg`, `max-w-2xl`).

#### **Data Visualization**
- **Mobile:** Simplify charts, use vertical orientations, enable horizontal scroll if needed.
- **Desktop:** Full-featured charts with legends and detailed tooltips.

### **Performance & UX**
- **Images:** Use responsive images with `srcset` or Next.js `Image` component.
- **Loading States:** Ensure loading indicators are visible and appropriately sized on mobile.
- **Gestures:** Support swipe gestures where appropriate (e.g., carousel, drawer).
- **Orientation:** Test and support both portrait and landscape orientations.

### **Testing Requirements**
- **Mandatory Testing:** Test on actual mobile devices, not just browser DevTools.
- **Breakpoint Coverage:** Verify layout at all major breakpoints (375px, 768px, 1024px, 1440px).
- **Touch Testing:** Verify all interactive elements are easily tappable without accidental clicks.

## 3. Design Tokens (The "Semantic Only" Rule)
- **Strict Prohibition:** Never use literal color scales (e.g., `text-red-500`, `bg-blue-600`).
- **Standard:** Use only semantic CSS variables defined in your global CSS:
  - Backgrounds: `bg-background`, `bg-card`, `bg-muted`
  - Text: `text-primary`, `text-secondary`, `text-muted-foreground`
  - Accents: `bg-primary`, `border-input`, `ring-ring`
  - States: `text-destructive`, `bg-accent`
  - Sidebar: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`
  - Charts: `text-chart-1`, `text-chart-2`, `text-chart-3`, `text-chart-4`, `text-chart-5` (and equivalent `bg-*`, `border-*`)
  - Shadows: `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

## 4. Header Components

### **Application Header (Top Navigation)**
The main application header (`components/layout/Header.tsx`) provides global navigation and user context.

**Structure:**
- **Logo (Left):** Clickable link to home route (`/`)
- **Navigation (Center):** Desktop navigation items with icons, hidden on mobile
- **Actions (Right):** Credit display, user menu, and mobile menu trigger

**Navigation Pattern:**
- Use `NavLink` from `react-router-dom` for navigation items
- Active state styling: `bg-accent text-accent-foreground`
- Inactive state: `text-muted-foreground`
- Each nav item must have: `[Icon] + [Label]`

**Mobile Navigation:**
- Use Shadcn `Sheet` component (right side)
- Trigger: Hamburger menu button (visible on `md` breakpoint and below)
- Same navigation items with consistent styling
- Minimum touch target: `min-h-11` for all links

**Code Example:**
```tsx
<NavLink
  to="/templates"
  className={({ isActive }) =>
    `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
    }`
  }
>
  <LayoutTemplate className="h-4 w-4" />
  Templates
</NavLink>
```

---

### **Page Header Component**
The `PageHeader` component (`components/ui/page-header.tsx`) provides a standardized header pattern for all content pages.

**Purpose:**
- Consistent page header layout across all pages
- DRY principle: Reusable component eliminates duplication
- Responsive design built-in

**Props:**
- `icon` (required): Lucide icon component
- `title` (required): Page title string
- `description` (optional): Subtitle/description text
- `action` (optional): ReactNode for CTA buttons (e.g., "Create" button)

**Layout Pattern:**
- **Mobile:** Stacked layout (`flex-col`)
- **Desktop:** Horizontal layout with space-between (`sm:flex-row sm:justify-between`)
- **Icon Container:** `bg-primary/10` with icon in `text-primary`
- **Title:** `text-2xl lg:text-3xl` with `font-semibold tracking-tight`
- **Description:** `text-sm text-muted-foreground`
- **Action:** Full width on mobile (`w-full`), auto width on desktop (`sm:w-auto`)

**Code Example:**
```tsx
<PageHeader
  icon={LayoutTemplate}
  title="Templates"
  description="Browse and manage invoice templates for your business"
  action={
    <Button variant="default" className="w-full sm:w-auto">
      <LayoutTemplate className="h-4 w-4" />
      Create Template
    </Button>
  }
/>
```

**Design Rules:**
- Always use semantic colors (no literal scales)
- Icon must be from Lucide library
- Action button must follow button composition rules (`[Icon] + [Label]`)
- Responsive spacing: `gap-4` mobile → maintained on desktop

## 5. Component Standards

### **Buttons**
- **Priority:** Use `variant="default"` (Primary) exclusively for the "Happy Path" or "Submit" actions.
- **Composition:** Every button **must** be a composite of `[Lucide Icon] + [Label]`.
- **Loading State:** When an `isLoading` state is active, the button must switch to `variant="loading"` and disable pointer events.

### **Inputs & Forms**
- **Structure:** Never use a raw `<Input />`. Wrap all inputs in the Shadcn `FormField` / `FormItem` pattern.
- **Requirements:** Every input must contain a clear, descriptive `placeholder`.
- **Validation:** Always include a `<FormMessage />` for error state handling.

### **Modals (Dialogs)**
- **Interlock Rule:** If a modal contains a loading state (e.g., a form submission in progress):
  - The `onPointerDownOutside` and `onEscapeKeyDown` events must be prevented.
  - The "Close" (X) button must be hidden or disabled.
  - The user must not be able to exit until the process completes or fails.

## 6. Coding Style (Antigravity Specific)
- **DRY:** If a UI pattern repeats twice, create a local component in `components/ui/shared`.
- **Clean:** Use Zod for schema validation on all forms to maintain strict type safety.