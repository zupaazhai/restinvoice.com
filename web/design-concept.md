<!-- Last Check Commit: 035fe79abcd0fb3d72aa68fd865271ab6b3a365d -->
# UI/UX Design System & Principles

## 1. Layout & Architecture
- **Max Width:** The main content container must strictly use `max-w-7xl` with `mx-auto`.
- **Navigation:** Use a **Top Navigation Bar** pattern.
- **Compactness:** Since the menu is small (2-3 items), prioritize high-density information display in the main content area.

### **Page Structure Rules**
All pages rendered inside `AuthenticatedLayout` inherit padding and max-width from the layout's `<main>` container:
```tsx
<main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
```

**CRITICAL:** Pages must NOT define their own padding or max-width wrappers. Follow this pattern:

```tsx
// ✅ CORRECT - Use space-y-6 wrapper, inherit padding from layout
export function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader ... />
      {/* Content here */}
    </div>
  );
}

// ❌ WRONG - Custom padding/max-width creates inconsistency
export function MyPage() {
  return (
    <div className="px-6 py-4 max-w-7xl mx-auto">  {/* DON'T DO THIS */}
      ...
    </div>
  );
}
```

**Why this matters:** At 1600px+ widths, nested max-width containers or different padding values cause misaligned content between pages.

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

### **Copy Button**
- **Usage:** Use the `CopyButton` component (`components/ui/copy-button.tsx`) for consistent copy-to-clipboard functionality.
- **Features:** Encapsulates the copy logic, generic type handling, and provides visual feedback (Icon change from Copy to Check) with a 2-second timeout.
- **Props:**
  - `value`: The string to be copied.
  - `variant`, `size`, `className`: Standard button props to customize appearance.
- **Example:**
```tsx
<CopyButton value="sk_123456789" variant="ghost" size="icon" />
```

### **Copy Input**
- **Usage:** Use the `CopyInput` component (`components/ui/copy-input.tsx`) when you need to display a value (like an API key or ID) that should be easily available for copying but not editable.
- **Design:** Consists of a read-only input field and a `CopyButton` integrated into a single container with a `bg-muted` background.
- **Props:**
  - `value`: The string to be displayed and copied.
  - `className`: Optional classes for the container.
  - `readOnly`: Defaults to `true`.
- **Example:**
```tsx
<CopyInput value="sk_123456789" className="w-full" />
```

### **Inputs & Forms**

We use two component systems for forms:

#### **Field Component (Simple Forms)**
Use the `Field` component for simple forms without validation (e.g., login forms, search inputs).

```tsx
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" placeholder="m@example.com" required />
  </Field>
  <Field>
    <FieldLabel htmlFor="password">Password</FieldLabel>
    <Input id="password" type="password" required />
    <FieldDescription>Must be at least 8 characters</FieldDescription>
  </Field>
</FieldGroup>
```

**Field Components:**
- `FieldGroup`: Container with `gap-7` between fields
- `Field`: Individual field wrapper with `gap-3` (label-to-input spacing)
- `FieldLabel`: Label component linked to input via `htmlFor`
- `FieldDescription`: Helper text below input
- `FieldError`: Error message display
- `FieldSeparator`: Visual separator between field sections

---

#### **Form Component (Validated Forms with react-hook-form)**
Use the `Form` component for complex forms with Zod validation and react-hook-form integration.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

**Form Components:**
- `Form`: Provider wrapper (extends react-hook-form's `FormProvider`)
- `FormField`: Controller wrapper for individual fields
- `FormItem`: Field container with `grid gap-2` spacing
- `FormLabel`: Label with automatic error state styling
- `FormControl`: Wraps input for accessibility attributes
- `FormMessage`: Displays validation errors
- `FormDescription`: Helper text

---

#### **When to Use Which**

| Use Case | Component |
|----------|-----------|
| Simple login/signup | `Field` |
| Search inputs | `Field` |
| Settings forms with validation | `Form` |
| Multi-step wizards | `Form` |
| Any form with Zod schema | `Form` |

**Spacing Rules:**
- `FieldGroup` uses `gap-7` (28px) between fields
- `Field` uses `gap-3` (12px) between label and input
- `FormItem` uses `grid gap-2` (8px) between elements
- Form container uses `space-y-6` (24px) between FormField groups

### **Modals (Dialogs)**
- **Interlock Rule:** If a modal contains a loading state (e.g., a form submission in progress):
  - The `onPointerDownOutside` and `onEscapeKeyDown` events must be prevented.
  - The "Close" (X) button must be hidden or disabled.
  - The user must not be able to exit until the process completes or fails.
- **Success State Design:**
  - Do NOT use colored headers (e.g., green text in the title).
  - Use a large, centered icon (e.g., `h-12 w-12` inside a rounded container) above the `DialogHeader`.
  - Center the title and description text.
  - The layout should be simple and focused on the confirmation message.
- **State Management:**
  - **Reset on Open:** Form forms inside dialogs MUST reset their state (values and validation errors) every time the dialog opens. Do not rely on "destroy on close" unless the library handles it perfectly. Explicit reset on `open=true` is preferred.
  - **Success to Form Reset:** If a dialog has a success state, closing it and reopening it MUST return the user to the initial form state, not the success state.

## 6. Spacing & Layout Standards

### **Border Radius Scale**

Use a consistent 3-size scale for border radius across all components:

| Size | Class | Pixels | Use Case |
|------|-------|--------|----------|
| **Small** | `rounded-md` | 6px | Buttons, Inputs, Badges, Dropdown items, Tab items |
| **Medium** | `rounded-lg` | 8px | Icon containers, Tabs container, Small cards, Empty state containers |
| **Large** | `rounded-xl` | 12px | Cards, Modals, Sheets, Large containers |
| **Circle** | `rounded-full` | 50% | Avatars, Circular icon buttons |

**Rules:**
- Never use `rounded-sm` (4px) or arbitrary values like `rounded-[10px]`
- Stick to the 3-size scale + circle for all components
- Use `rounded-md` as the default for interactive elements

### **Card Padding Standards**

#### Standard Card (Default Pattern)
```tsx
<Card className="rounded-xl border py-6 gap-6">
  <CardHeader className="px-6">...</CardHeader>
  <CardContent className="px-6">...</CardContent>
  <CardFooter className="px-6">...</CardFooter>
</Card>
```

**Measurements:**
- **Vertical Padding:** `py-6` (24px) top/bottom on Card itself
- **Horizontal Padding:** `px-6` (24px) on all Card sub-components
- **Internal Gap:** `gap-6` (24px) between Card children (flexbox gap)
- **Border Radius:** `rounded-xl` (12px)

**When to use:** Single cards, detail views, forms, dashboard widgets

---

#### Compact Card Variant
```tsx
<Card className="rounded-xl border py-0 gap-4">
  <CardContent className="p-0">
    {/* Full-width content like images */}
  </CardContent>
  <CardFooter className="px-3 pb-3">
    {/* Compact footer */}
  </CardFooter>
</Card>
```

**Measurements:**
- **Vertical Padding:** `py-0` (remove default padding for flush content)
- **Horizontal Padding:** `px-3` (12px) for footer/header areas
- **Bottom Padding:** `pb-3` (12px) for final spacing
- **Internal Gap:** `gap-4` (16px) between sections (reduced from standard)

**When to use:** Grid layouts with many cards (e.g., TemplateCard, product grids, gallery views)

**Example:** `TemplateCard` uses this pattern for tighter spacing in the templates grid.

### **Content Spacing (Gap) Scale**

Use this standardized gap scale for consistent spacing:

| Gap Class | Pixels | Use Case | Examples |
|-----------|--------|----------|----------|
| `gap-1` | 4px | Tight inline elements | Breadcrumbs, tag lists |
| `gap-2` | 8px | Icon + text pairs, form internals | Button icons, input addons, tight vertical lists |
| `gap-3` | 12px | Horizontal nav items, medium lists | Page header horizontal spacing, nav links |
| `gap-4` | 16px | Stacked content sections, form fields | Compact card sections, form field spacing, page header vertical |
| `gap-6` | 24px | Card sections, generous layouts | Standard card sections, page sections, empty states |

**Rules:**
- Avoid `gap-5`, `gap-8`, or arbitrary gap values
- Use `gap-2` as default for icon + text combinations
- Use `gap-4` for compact layouts, `gap-6` for generous layouts
- Never mix multiple gap sizes within the same flex/grid container

### **Icon Container Standards**

#### Small Icon Container (8×8)
```tsx
<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
  <Icon className="h-4 w-4" />
</div>
```
**Use:** Button icons, inline elements, tight UI areas

---

#### Medium Icon Container (10×10)
```tsx
<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
  <Icon className="h-5 w-5 text-primary" />
</div>
```
**Use:** Page headers, section headers, medium prominence

**Example:** `PageHeader` component uses this pattern

---

#### Large Icon Container (12×12)
```tsx
<div className="size-12 rounded-lg bg-muted flex items-center justify-center">
  <Icon className="h-6 w-6 text-muted-foreground" />
</div>
```
**Use:** Empty states, feature showcases, high prominence areas

**Example:** `Empty` component uses this pattern

---

### **Padding Standards Summary**

| Element | Horizontal | Vertical | Notes |
|---------|-----------|----------|-------|
| Card (standard) | — | `py-6` | 24px top/bottom |
| CardContent | `px-6` | — | 24px left/right |
| Card (compact) | — | `py-0` | Remove default |
| Compact Footer | `px-3` | `pb-3` | 12px padding |
| Button | `px-4` | `py-2` | Default size |
| Input | `px-3` | `py-1` | Standard input |
| Empty State | `p-6 md:p-12` | — | Responsive padding |

## 7. Coding Style (Antigravity Specific)
- **DRY:** If a UI pattern repeats twice, create a local component in `components/ui/shared`.
- **Clean:** Use Zod for schema validation on all forms to maintain strict type safety.

## 8. Authentication & Loading States

### **Clerk Authentication Theme**

We use the official Shadcn theme package from Clerk for seamless integration.

**Configuration** (`main.tsx`):
- Package: `@clerk/themes`
- Theme: `shadcn`
- Import: `import { shadcn } from "@clerk/themes";`

**Setup Code:**
```tsx
<ClerkProvider
  appearance={{
    theme: shadcn,
  }}
>
```

**Benefits:**
- Automatically matches Shadcn UI design tokens (radius, primary colors, fonts)
- Reduces custom CSS maintenance
- Provides a "native" look and feel out of the box

### **Dedicated Clerk CSS Variables**

We use supplementary CSS variables in `index.css` to handle any edge cases where Clerk's content needs specific targeting, although the `shadcn` theme handles most of this automatically now.

```css
:root {
  --clerk-accent: var(--accent);
  --clerk-accent-foreground: var(--accent-foreground);
}
```

### **Skeleton Loading States**

For slow network conditions, implement skeleton loaders that mirror the actual component structure.

**Pattern:** Use `useClerk()` hook to detect loading state:
```tsx
import { useClerk } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";

export function LoginPage() {
  const clerk = useClerk();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      {!clerk.loaded ? <SignInSkeleton /> : <SignIn />}
    </div>
  );
}
```

**Skeleton Design Rules:**
- Match exact dimensions of the actual component
- Use same border radius and padding (`rounded-xl`, `p-8`)
- Include placeholders for all major UI elements (title, buttons, inputs, footer)
- Use `grid` layout for side-by-side elements (e.g., `grid-cols-2` for social buttons)
- Follow spacing standards (`mb-6`, `mb-8`)

**Example Structure:**
```tsx
function SignInSkeleton() {
  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      {/* Title and description */}
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-3 h-8 w-64 rounded" />
        <Skeleton className="mx-auto h-5 w-80 rounded" />
      </div>

      {/* Social buttons (2-column grid) */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Form fields and submit */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <Skeleton className="mb-8 h-10 w-full rounded-md" />

      {/* Footer */}
      <div className="text-center">
        <Skeleton className="mx-auto h-4 w-56 rounded" />
      </div>
    </div>
  );
}
```

## 9. Formatting & Critical Actions

### **Date & Time Formatting**
- **Standard:** All dates and times must be formatted using the `formatDateTime` utility from `@/lib/utils`.
- **Consistency:** Do not use `new Date().toLocaleDateString()` or raw strings directly in UI components.
- **Default Style:** Medium date, short time (e.g., "Oct 24, 2024, 10:30 AM").
- **Example:**
```tsx
import { formatDateTime } from "@/lib/utils";

```

### **Number Formatting**
- **Standard:** Use `formatNumber` utility from `@/lib/utils` for all numeric displays.
- **Features:** Supports currency, percentages, and compact notation (1.2k).
- **Example:**
```tsx
import { formatNumber } from "@/lib/utils";

// Standard
<span>{formatNumber(1234.56)}</span> // "1,234.56"

// Compact
<span>{formatNumber(1500, { style: "compact" })}</span> // "1.5K"
```

### **Destructive Actions (Delete)**
- **Requirement:** Any destructive action (deleting a key, removing a template) **MUST** be confirmed by the user.
- **Component:** Use `AlertDialog` from Shadcn UI (`components/ui/alert-dialog.tsx`).
- **Pattern:**
  - **Trigger:** A button with `text-destructive` (usually a trash icon).
  - **Title:** "Are you absolutely sure?"
  - **Description:** Explain the consequences clearly (e.g., "This action cannot be undone...").
  - **Action Button:** Use `AlertDialogAction` with specific destructive styling:
    ```tsx
    <AlertDialogAction
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      onClick={handleDelete}
    >
      Delete
    </AlertDialogAction>
    ```
- **UX Rule:** Never perform a delete operation immediately on button click.