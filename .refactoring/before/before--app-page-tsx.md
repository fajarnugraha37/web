# Specification: app/page.tsx

## Overview
The `Home` component is the landing page of the application. It acts as an executive summary page for Fajar Abdi Nugraha, presenting professional background, a simulated terminal interface, featured "Hardware Nodes" (links to lab environments), "Core Paradigms" (engineering philosophy), and a listing of recent blog posts.

## Functionality
*   **User Interface:**
    *   **Hero Section:** Welcoming intro, professional summary, and primary call-to-action buttons (`/labs` and `/blogs`).
    *   **Terminal Section:** Visual terminal window providing a quick look at technical stacks.
    *   **Hardware Nodes Section:** Grid of featured lab links.
    *   **Paradigms Section:** Engineering philosophy highlights with stylized layout.
    *   **Transmissions Section:** List of recent blog posts.
*   **SEO:** Includes a JSON-LD schema for person/professional profile.
*   **Navigation:**
    *   Quick links to `/labs`, `/blogs`, and individual lab nodes.

## Behavior
*   Uses `PageTransition` for smooth route navigation.
*   Provides `ScrollReveal` animations for content entering the viewport.
*   Dynamically fetches recent blog posts using `getSortedBlogsData()`.

## State Management
*   Stateless (Server/Static data).

## Page/Component Structure
*   `PageTransition`
    *   `section` (Hero Section)
    *   `section` (Hardware Nodes Section)
    *   `section` (Core Paradigms Section)
    *   `section` (Recent Transmissions Section)

## Logic & Data Handling
*   **Data Fetching:**
    *   `getSortedBlogsData()`: Fetches blog data to slice the top 3 most recent entries.
*   **SEO:** Injects structured data via JSON-LD.
*   **API Calls:** None.
*   **Storage Handling:** None.

## Dependencies
*   `components/Button.tsx`, `components/ScrollReveal.tsx`, `components/PageTransition.tsx`
*   `lib/mdx.ts` (Data fetching)
*   `lucide-react` (Icons)

## Potential Issues
*   Highly dense layout with multiple sections; needs careful observation for performance if animations are triggered too aggressively.
*   The "Terminal" content in the Hero is hardcoded; if it needs updates, the Home component must be modified.
*   The JSON-LD metadata is hardcoded; ensure the domain URL remains consistent.
*   Large file with diverse responsibilities (SEO, layout, blog fetching, terminal simulation).
