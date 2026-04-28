# Specification: components/SqlTerminal/SqlEditor.tsx

## Overview
The `SqlEditor` component is a dedicated SQL code editor interface featuring syntax highlighting, command history management (with local storage persistence), file import capabilities, and execution triggers.

## Functionality
*   **User Interface:**
    *   **Header Toolbar:** Status indicators, import button, history toggle, clear buffer, and "RUN_QUERY" button.
    *   **Editor:** `CodeMirror` instance with SQL language support and Dark theme.
    *   **History Overlay:** Modal interface to review and reuse previous query commands.
*   **Navigation:**
    *   None.

## Behavior
*   Uses `CodeMirror` for editing.
*   Supports command history navigation using arrow keys.
*   Persists history in `localStorage`.
*   Triggers the `onExecute` callback with keyboard shortcut (`Ctrl/Meta+Enter`).

## State Management
*   `query`: The current SQL query string in the editor.
*   `history`: Array of past queries, loaded from and saved to `localStorage`.
*   `historyIndex`: Index for tracking the current item in history during arrow-key navigation.
*   `showHistory`: Boolean for toggling history overlay.

## Page/Component Structure
*   `div` (Main Container)
    *   `header` (Toolbar)
    *   `div` (CodeMirror Wrapper)
        *   `CodeMirror`
        *   `History Overlay` (Conditional)
        *   `Boot Sequence Overlay` (Conditional)
    *   `footer` (Keyboard shortcuts label)

## Logic & Data Handling
*   **Editor Logic:** Wraps `CodeMirror` with basic setup (line numbers, etc.).
*   **History:** Uses `localStorage` to save/load command buffers.
*   **Execution:** Collects query from state, manages basic history logic (deduplication, slicing to 50), and executes via `onExecute`.

## Dependencies
*   `@uiw/react-codemirror` (Editor).
*   `@codemirror/lang-sql` (SQL Syntax).
*   `lucide-react` (Icons).

## Potential Issues
*   **Performance:** No major issues expected.
*   **Robustness:** Parsing of `localStorage` has basic error handling, but could be more robust.
*   **UX/Accessibility:** Modal-based history overlays could trap keyboard navigation focus.
*   **Coupling:** The logic for execution and history tracking is tied to this specific component; could be separated into a hook (e.g., `useSqlEditor`).
