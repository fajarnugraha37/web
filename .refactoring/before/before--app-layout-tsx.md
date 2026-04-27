# Specification: app/layout.tsx

## Overview
The `RootLayout` is the primary entry point for all pages in the application. It handles global setup, including fonts, theme configuration, base CSS imports, shared navigation (header, mobile nav), footer, and global utilities (scroll progress, scroll-to-top).

## Functionality
*   **Fonts & Theme:**
    *   Loads Google Fonts (`Orbitron`, `Share Tech Mono`, `JetBrains Mono`) and sets them as CSS variables.
*   **Global Components:**
    *   `ScrollProgress`: Visual indicator of page scroll progress.
    *   `ScrollToTop`: Component to scroll the page to top.
    *   `header`: Contains the primary desktop navigation and mobile navigation.
    *   `main`: The main layout area for page content.
    *   `Footer`: Website footer.
*   **SEO & Metadata:**
    *   Defines the site's default metadata, OpenGraph images, Twitter cards, and RSS feed alternate links.

## Behavior
*   Uses `next/font` for optimized loading.
*   Implements a sticky header with a "Cyberpunk" aesthetic.
*   Defines a navigation dropdown for "Labs" entries.
*   Uses `suppressHydrationWarning` on the `body` tag (likely to avoid hydration mismatches due to theme/UI script interventions).

## State Management
*   Stateless; relies on child components (e.g., `MobileNav`) to handle their internal state.

## Page/Component Structure
*   `html`
    *   `body`
        *   `ScrollProgress`
        *   `ScrollToTop`
        *   `header`
            *   Desktop Nav
            *   `MobileNav`
        *   `main`
            *   `children`
        *   `Footer`

## Logic & Data Handling
*   **Metadata:** Configures site-wide SEO metadata.
*   **Fonts:** Configures Google fonts and maps them to CSS variables.
*   **Routing:** Defines site-wide navigation links.

## Dependencies
*   `components/MobileNav.tsx`, `components/Footer.tsx`, `components/ScrollProgress.tsx`, `components/ScrollToTop.tsx`
*   `./app.css` (Global styles)

## Potential Issues
*   **Gendut (Fat) Component:** This file is a common candidate for becoming a "God component." It holds global layout logic, navigation, metadata, font loading, and global component imports.
*   **Coupling:** The navigation menu is hardcoded inside the layout header. If navigation links change frequently, this component must be updated, violating separation of concerns.
*   **Circular Dependencies:** Header and Footer might become complex as the app scales.
*   **Metadata:** Global metadata might become overly specific and need better partitioning.
