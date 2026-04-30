# Specification: app/not-found.tsx

## Overview
The `NotFound` component is the application-wide 404 error page. It maintains the "cyberpunk" theme with glitchy text effects, simulated terminal error logs, and navigation links back to key areas of the site.

## Functionality
*   **User Interface:**
    *   Glitch-effect "404" header.
    *   Simulated error logs block (`[ERR]`, `[SYS]`).
    *   Error status badges (Error Code, Node Status, Sector).
    *   Navigation buttons (Home, Blogs, Contacts).
*   **Navigation:**
    *   `SYS//OP` link to home (`/`).
    *   `READ_BLOGS` link to blogs (`/blogs`).
    *   `CONTACT.EXE` link to contacts (`/contacts`).

## Behavior
*   Displays a highly stylized error message consistent with the rest of the site's retro/cyberpunk aesthetic.
*   The glitch effect is achieved via CSS `clip-path` and `text-shadow` animations.

## State Management
*   None (Stateless).

## Page/Component Structure
*   `div` (Main container with background effects)
    *   `div` (Badge Status)
    *   `div` (404 Glitch Graphic)
    *   `h2` (Page Title)
    *   `div` (Divider)
    *   `div` (Terminal-style log block)
    *   `div` (Error info grid)
    *   `div` (Action buttons/CTAs)

## Logic & Data Handling
*   **Data Handling:** None (Static content).
*   **API Calls:** None.

## Dependencies
*   `lucide-react` (if icon-based features were used; current version mostly uses plain text/divs).
*   `next/link` (Navigation).
*   `app/app.css` (For glitch CSS and background grid/scanlines).

## Potential Issues
*   The component is purely visual. If the application logic needs to change how 404s are reported or handled, this component will need to be updated.
*   Highly dependent on global CSS classes (e.g., `.not-found-glitch-1`, `.cyber-glitch-text`), which makes it brittle if global CSS is refactored.
