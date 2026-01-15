# Login Flow Specification

This document outlines the authentication flow, route protection mechanisms, and UI specifications for the Login system.

## 1. Overview
 The application uses a client-side authentication flow. Currently, this is implemented as a **visual and structural prototype** using a mock authentication provider.

## 2. Authentication State
- **Storage**: `localStorage`
- **Key**: `auth_mock_token`
- **Value**: `"true"` (authenticated) or `null` (unauthenticated)

## 3. User Flows

### A. Login Flow
1. **Entry**: User navigates to `/login` or is redirected there by the Route Guard.
2. **UI**: User sees the Login Card with options:
   - **Github** (Mock button)
   - **Google** (Mock button)
   - **Email** (Input + "Send Login Code" button)
3. **Action**: User clicks any login provider button.
4. **Process**:
   - System shows a loading spinner on the button (1 second delay mock).
   - System sets `localStorage.setItem("auth_mock_token", "true")`.
5. **Exit**: System redirects user to the Dashboard (`/`).

### B. Logout Flow
1. **Trigger**: User opens the **User Menu** (top-right avatar) and clicks **"Logout"**.
2. **Process**:
   - Navigation to `/logout` route.
   - Clears session: `localStorage.removeItem("auth_mock_token")`.
3. **Exit**: System immediately redirects user to `/login`.

### C. Route Protection (Guard)
- **Component**: `RequireAuth` (`src/components/auth/RequireAuth.tsx`)
- **Logic**:
  - Intercepts access to all protected routes (e.g., `/`, `/templates`, `/api-keys`).
  - Checks if `auth_mock_token` exists.
  - **If Missing**: Redirects to `/login`.
  - **If Present**: Renders the requested page.

## 4. Component Architecture

### Pages
- **`LoginPage.tsx`**:
  - Path: `/login`
  - Publicly accessible.
  - Layout: Centered Card component.
- **`LogoutPage.tsx`**:
  - Path: `/logout`
  - Functional component (no UI), executes logic and redirects.

### Middleware
- **`RequireAuth.tsx`**:
  - Wrapper component for `AuthenticatedLayout`.
  - Handles the "Gatekeeper" logic.

### Layout
- **`App.tsx`**:
  - Defines the Routing table.
  - Wraps protected routes in `<RequireAuth><AuthenticatedLayout>...</AuthenticatedLayout></RequireAuth>`.
- **`UserMenu.tsx`**:
  - Contains the UI trigger for the Logout flow.
