# UI/UX Design System & Principles

## 1. Layout & Architecture
- **Max Width:** The main content container must strictly use `max-w-7xl` with `mx-auto`.
- **Navigation:** Use a **Top Navigation Bar** pattern.
- **Compactness:** Since the menu is small (2-3 items), prioritize high-density information display in the main content area.

## 2. Design Tokens (The "Semantic Only" Rule)
- **Strict Prohibition:** Never use literal color scales (e.g., `text-red-500`, `bg-blue-600`).
- **Standard:** Use only semantic CSS variables defined in your global CSS:
  - Backgrounds: `bg-background`, `bg-card`, `bg-muted`
  - Text: `text-primary`, `text-secondary`, `text-muted-foreground`
  - Accents: `bg-primary`, `border-input`, `ring-ring`
  - States: `text-destructive`, `bg-accent`

## 3. Component Standards

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

## 4. Coding Style (Antigravity Specific)
- **DRY:** If a UI pattern repeats twice, create a local component in `components/ui/shared`.
- **Clean:** Use Zod for schema validation on all forms to maintain strict type safety.