# Specification: components/Footer.tsx

## Overview
The `Footer` component provides the site-wide footer, featuring branding, site directory navigation, links to active lab environments, social media links, and simulated system log activity.

## Functionality
*   **User Interface:**
    *   **Brand Section:** Displays the "SYS//OP" logo and a brief description.
    *   **Quick Links:** Navigation directory (Root, Blogs, About, Laboratory, RSS, Contact).
    *   **Active Nodes:** Links to specific lab sub-pages.
    *   **Socials:** Direct links to external social media platforms (GitHub, LinkedIn, Email).
    *   **Terminal Log Simulation:** Displays a simulated system console block.
*   **Navigation:**
    *   Contains navigational links to all major site sections and lab tools.

## Behavior
*   Displays site-wide information consistently at the bottom of the page.
*   Includes a terminal-like log simulation block as a decorative element.

## State Management
*   None (Stateless).

## Page/Component Structure
*   `footer`
    *   `div` (Main grid layout)
        *   Brand Column
        *   Directory Column
        *   Active Nodes Column (includes Socials and Terminal block)
    *   `div` (Bottom Bar with copyright and site metadata)

## Logic & Data Handling
*   **Data Handling:** None (Static content).

## Dependencies
*   `lucide-react` (Icons).
*   `next/link` (Navigation).
*   `components/Icons.tsx` (Custom icon components).

## Potential Issues
*   **Maintenance:** Navigation links are hardcoded, making site structural changes more labor-intensive to propagate.
*   **Separation of Concerns:** The footer component is responsible for site-wide navigation structure. If navigation changes, this component needs to be updated.
*   **Redundancy:** Re-implements navigation structures similar to those in the header, which might lead to desynchronization over time.
