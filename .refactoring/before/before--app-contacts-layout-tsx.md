# Specification: app/contacts/layout.tsx

## Overview
The `ContactsLayout` component acts as a layout wrapper for the contacts section of the website. It defines the metadata for pages under `/contacts`.

## Functionality
*   **User Interface:**
    *   Serves as a container/wrapper for children pages.
*   **Metadata:**
    *   Defines SEO/meta tags (`title`, `description`) for the contact pages.

## Behavior
*   Passes children directly to the layout.

## State Management
*   None (Stateless).

## Page/Component Structure
*   `Fragment` (`<>`)
    *   `children`

## Logic & Data Handling
*   **Data Handling:** None.
*   **Metadata:** Sets SEO tags specifically for the contact section.

## Dependencies
*   `next`: For Metadata type.

## Potential Issues
*   The layout is essentially a pass-through and might not be strictly necessary unless future global layout changes are planned for this section.
