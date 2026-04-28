# Specification: app/about/page.tsx

## Overview
The `AboutPage` component displays the professional profile and career history of Fajar Abdi Nugraha. It features an executive summary, a chronological career log with job details and tech stacks, and an education/certification history.

## Functionality
*   **User Interface:**
    *   Displays an executive summary using `ExpandableSummary`.
    *   Lists professional experience in a timeline format.
    *   Lists education and certifications in a timeline format.
    *   Uses a "CRT-style" aesthetic with visual overlays and neon accents.
*   **Navigation:**
    *   No direct interactivity beyond viewing the content.
*   **Accessibility:**
    *   Uses semantic HTML structure.
    *   The page utilizes a `PageTransition` wrapper.

## Behavior
*   The page displays static content arranged chronologically.
*   The design includes animated elements like fading in the executive summary.
*   The UI incorporates a "CRT scanline" overlay for a retro aesthetic.

## State Management
*   The component is functional and relies on hardcoded `CAREER_DATA` and `EDUCATION_DATA` arrays.
*   State handling (expand/collapse) is delegated to imported `ExpandableSummary` and `ExpandableDescriptions` components.

## Page/Component Structure
*   `div` (Main Container)
    *   `div` (Background Theme)
    *   `div` (CRT Scanline Overlay)
    *   `div` (Ambient Glow)
    *   `PageTransition`
        *   `div` (Max-width container)
            *   `Section 1: Executive Summary` (`ExpandableSummary`)
            *   `Section 2: Career Logs` (Timeline list iterating `CAREER_DATA`)
            *   `Section 3: Education` (Timeline list iterating `EDUCATION_DATA`)

## Logic & Data Handling
*   **Data Structure:**
    *   `CAREER_DATA`: Array of objects containing year, role, company, descriptions (array), and tech stack (array).
    *   `EDUCATION_DATA`: Array of objects containing year, degree, school, location, and description.
*   **API Calls:** None (Static content).
*   **Storage Handling:** None.

## Dependencies
*   `next/metadata`: For SEO/OpenGraph configuration.
*   `@/components/ExpandableSummary`: UI component for collapsible summary text.
*   `@/components/ExpandableDescriptions`: UI component for collapsible career descriptions.
*   `@/components/PageTransition`: UI wrapper for page transitions.

## Potential Issues
*   The content is static and hardcoded, which will require code updates for future profile changes.
*   The design uses custom CSS/Tailwind classes for retro visual effects which might conflict with future global style updates if not properly modularized.
*   Large static data arrays inside the component file make it harder to manage if the content grows significantly.
