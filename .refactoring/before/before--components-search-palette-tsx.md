# Specification: components/SearchPalette.tsx

## Overview
The `SearchPalette` component provides a global, command-palette-style search interface for blog posts, using `MiniSearch` for client-side full-text indexing and retrieval.

## Functionality
*   **User Interface:**
    *   Toggle button in the navbar for triggering search.
    *   Command palette modal overlay (triggered by `Cmd+K` / `Ctrl+K`).
    *   Search results list displaying titles and descriptions, navigable via link.
*   **Navigation:**
    *   Navigates directly to the chosen blog post upon selection.

## Behavior
*   Fetches `/search-index.json` on mount to build the index.
*   Supports fuzzy searching with configurable thresholds.
*   Handles global key events (`Cmd+K` for open/toggle, `Escape` for closing).

## State Management
*   `isOpen`: Boolean state for palette visibility.
*   `query`: String for input search term.
*   `miniSearch`: State storing the `MiniSearch` index instance.

## Page/Component Structure
*   `button` (Trigger)
*   `AnimatePresence` + `motion.div` (Overlay)
    *   `motion.div` (Palette Content)
        *   `input` (Search input)
        *   `div` (Results list)

## Logic & Data Handling
*   **Search Engine:** Uses `minisearch` library.
*   **Data Fetching:** Loads index data from a static JSON file.
*   **Indexing:** Fields indexed are `title`, `tags`, and `description`.

## Dependencies
*   `minisearch` (Search engine).
*   `lucide-react` (Icons).
*   `motion/react` (Animations).
*   `next/link`, `next/navigation`.

## Potential Issues
*   **Performance:** `MiniSearch` initialization happens on the client after fetch; if the index grows large, this might cause delays in initialization or main-thread blocking during initial search.
*   **Dependency Bloat:** Client-side indexing for a small blog might be overkill, but reasonable for a personal portfolio.
*   **Accessibility:** Does not include standard modal accessibility patterns (e.g., focus trapping inside the palette).
