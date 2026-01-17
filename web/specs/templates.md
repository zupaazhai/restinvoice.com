# Templates Feature Specification

This document outlines the current implementation of the Templates feature in the REST Invoice web application.

## 1. What We Have

The feature is divided into three main user interfaces:

### A. Browse System Templates
**Page:** `TemplatesPage` (`/templates`)
- **Purpose**: Allows users to browse standard, pre-defined templates provided by the system.
- **Functionality**:
  - Displays a grid of templates.
  - Shows loading skeleton while fetching.
  - Handles error states.
  - **Key Components**:
    - `TemplateList`: Reusable component to render the grid of `TemplateCard`s.
    - `PageHeader`: Standard header with "Templates" title.

### B. Manage My Templates
**Page:** `MyTemplatesPage` (`/my-templates`)
- **Purpose**: Allows authenticated users to view and manage their customized templates.
- **Functionality**:
  - Requires Authentication (Clerk).
  - Displays user-specific templates.
  - Shows specific "Empty State" message if no templates exist ("Create your first template...").
  - Includes a "Create Template" action button in the header.
  - **Key Components**:
    - `TemplateList` (with `editable` prop enabled).

### C. Template Editor
**Page:** `TemplateEditorPage` (`/templates/editor` - *Route inferred from page existence*)
- **Purpose**: A rich editor for customizing invoice templates.
- **State Management**:
  - `mode`: Toggles between "preview" (visual) and "code" (HTML source) views.
  - `variables`: Manages dynamic values (Primary Color, Company Name, Logo URL, Footer Text).
  - `template`: Stores the raw HTML string with mustache variables (e.g., `{{primary_color}}`).
- **Functionality**:
  - **Preview Mode**:
    - Renders the HTML with variables replaced in real-time.
    - **Variables Panel**: Sidebar (desktop) or Sheet (mobile) to edit variable values.
    - Uses regular expressions to replace `{{variable_id}}` with actual values in the client-side render.
  - **Code Mode**:
    - Raw text editor for the HTML template.
  - **Responsive Layout**: Adopts specific layouts for Mobile (tabs for mode) vs Desktop (split view not fully active, but controls adapt).

## 2. Data Structures & Logic

### Types
Defined in `types/template.types.ts`:
- **Template**:
  ```typescript
  interface Template {
      id: string;
      name: string;
      description: string;
      type: "invoice" | "receipt";
      isSystem: boolean;
      thumbnail?: string;
  }
  ```
- **TemplateVariable**:
  ```typescript
  interface TemplateVariable {
      id: string;
      label: string;
      type: "color" | "text" | "image";
      value: string;
  }
  ```

### Client-Side Logic
- The **Editor** handles variable substitution primarily on the client side using regex:
  ```typescript
  const regex = new RegExp(`{{${v.id}}}`, "g");
  result = result.replace(regex, v.value);
  ```
- No server-side rendering logic is currently connected to the editor's preview.

## 3. API Integration

The application uses a centralized API client structure.
**File**: `lib/api/modules/templates.ts`

### Endpoints

| Function | HTTP Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- | :--- |
| `templatesApi.listSystem()` | `GET` | `/v1/templates/system` | Public | Fetches default system templates. |
| `templatesApi.list(token)` | `GET` | `/v1/templates` | **Required** | Fetches the authenticated user's templates. |

### Call Flow
1. **System Templates**:
   - `TemplatesPage` mounts.
   - Calls `templatesApi.listSystem()`.
   - Populates state `templates`.

2. **User Templates**:
   - `MyTemplatesPage` mounts.
   - Checks `useAuth()` loaded state.
   - Gets fresh token: `await getToken()`.
   - Calls `templatesApi.list(token)`.
   - Populates state `templates`.

---
*Note: The save functionality in the editor is currently UI-only and does not yet call a backend endpoint.*
