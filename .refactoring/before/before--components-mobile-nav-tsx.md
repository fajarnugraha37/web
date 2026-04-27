# Specification: components/MobileNav.tsx

## Overview
The `MobileNav` component provides a mobile-optimized navigation menu triggered by a hamburger button. It includes logic for expanding/collapsing sub-menus (Labs) and closing the menu upon navigation or window resizing.

## Functionality
*   **User Interface:**
    *   **Hamburger Toggle:** Animated SVG-like menu button.
    *   **Dropdown Menu:** A full-width mobile menu overlaid on the page content.
    *   **Navigation Links:** List of site-wide links with nested sub-menus for "Labs".
*   **Navigation:**
    *   Navigates to various application routes. Automatically closes the menu on click/navigation.

## Behavior
*   Uses `usePathname` for active link highlighting.
*   Automatically closes on route change via `useEffect`.
*   Automatically closes on resize (if switching to desktop mode).
*   Implements a backdrop to handle clicks outside the menu area.
*   Animated menu entrance using state-based class toggling.

## State Management
*   `open`: Tracks menu open/close status.
*   `expandedLabs`: Tracks visibility status of the nested Lab navigation menu.

## Page/Component Structure
*   `div` (Container)
    *   `button` (Hamburger)
    *   `nav` (Dropdown Menu)
        *   `ul` (Navigation list)
            *   `Link` components (Root pages)
            *   Nested `ul` (Lab links)

## Logic & Data Handling
*   **Data Structure:** `NAV_LINKS` constant defines the menu structure, labels, and specific styling for each link.
*   **Mobile Detection:** Listens to `resize` events to ensure menu is closed if screen width crosses the `768px` threshold.

## Dependencies
*   `lucide-react` (Icons).
*   `next/link`, `next/navigation` (Next.js routing).

## Potential Issues
*   **Redundancy:** The `NAV_LINKS` structure partially duplicates information in the main `Layout` component's navigation, increasing risk of desynchronization.
*   **Accessibility:** Relies heavily on ARIA and state-managed visibility, but focus management (trapping focus inside the menu) is missing.
*   **Performance:** Resize listener could be throttled/debounced if necessary, though lightweight for this implementation.
