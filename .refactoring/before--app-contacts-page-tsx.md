# Specification: app/contacts/page.tsx

## Overview
The `ContactsPage` component is a dual-interface contact dashboard. It features a simulated "Terminal" (CLI) for users to interact with social links via commands, and a grid of clickable "Neural Links" cards for standard social/contact navigation.

## Functionality
*   **User Interface:**
    *   **Simulated Terminal:** Interactive CLI input/output area with history management.
    *   **Neural Links Grid:** Clickable cards for social/contact links.
    *   **Visual Atmosphere:** Cyberpunk-themed background with CRT scanlines and atmospheric gradients.
*   **Navigation:**
    *   Terminal navigation: Supports `help`, `ls`, `clear`, `connect [target]`.
    *   Grid links: Navigates to external profiles (GitHub, LinkedIn, Instagram, Email).

## Behavior
*   **Terminal:**
    *   Simulates "boot-up" typing animation on mount.
    *   Handles command input/parsing and history navigation (arrow keys).
    *   Opens links in new tabs when triggered via `connect [target]`.
*   **Grid:** Standard link grid behavior for direct interaction.

## State Management
*   `output`: Array of strings representing terminal console lines.
*   `input`: String for the current active terminal line.
*   `history`: Array of previous user commands.
*   `historyIndex`: Cursor index for history navigation.

## Page/Component Structure
*   `PageTransition`
    *   `header` / `container`
        *   `section` (Simulated Terminal - interactive component)
        *   `section` (Neural Links Grid - static data rendering)

## Logic & Data Handling
*   **Data Structure:** `LINKS` array stores metadata and URLs for external social channels.
*   **Terminal Parsing:** Simple string matching for commands, conditional logic for responses.
*   **Input Handling:** `onKeyDown` listens for `Enter` and arrow keys to drive interaction.

## Dependencies
*   `components/PageTransition.tsx`.
*   `react` (hooks: `useState`, `useEffect`, `useRef`).

## Potential Issues
*   **Complexity:** Large monolithic component; logic for terminal, history, typing, and layout are mixed.
*   **State:** Complex state management for command history navigation could be isolated into a `useTerminal` hook.
*   **Accessibility:** The custom terminal element is not a standard accessible UI. Focus management and screen reader support for the terminal output need refinement.
*   **Dependency Coupling:** Terminal logic is hardcoded and directly dependent on `LINKS` structure.
