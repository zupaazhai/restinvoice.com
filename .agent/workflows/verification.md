---
description: Verification process for Web and API implementations
---

# Verification Protocol

This workflow defines the mandatory verification steps to be followed after every implementation in `web` or `api` projects.

## @web Project Verification

After implementing features or fixes in the `web` folder:

1.  **Browser Preview**:
    -   Use the `open_browser` tool to launch the preview (e.g., `http://localhost:5173` or the relevant dev URL).
    -   **Critical**: Ensure the dev server is running (user-managed, do not start it yourself).
2.  **Scenario Walkthrough**:
    -   Manually click through the user scenarios related to the implementation using the browser tool.
    -   Verify UI responsiveness, styling, and functionality.
    -   Check the browser console for any errors.
3.  **Artifacts**:
    -   The browser tool automatically records the session. Ensure these recordings capture the verification steps.

## @api Project Verification

After implementing features or fixes in the `api` folder:

1.  **Swagger/OpenAPI Documentation**:
    -   Ensure the code uses `@hono/zod-openapi` to verify that the route definition and schema are up-to-date.
    -   Verify that the new endpoints are correctly registered in the OpenAPI document.
2.  **CURL Testing**:
    -   Construct `curl` commands to test the new or modified endpoints.
    -   Run the `curl` commands using `run_command` to verify the response status and body.
    -   Test both success and failure scenarios (e.g., validation errors).
