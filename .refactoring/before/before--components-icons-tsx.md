# Specification: components/Icons.tsx

## Overview
The `Icons.tsx` component is a central repository for custom SVG icons used throughout the application, specifically for social media links and export file formats.

## Functionality
*   **Icons Provided:**
    *   Social Media: `XIcon`, `LinkedInIcon`, `WhatsAppIcon`, `TelegramIcon`, `FacebookIcon`.
    *   File Formats: `MarkdownIcon`, `HtmlIcon`, `PdfIcon`.

## Behavior
*   Provides functional, reusable SVG components that accept a `className` prop for styling.

## State Management
*   None (Stateless).

## Page/Component Structure
*   Functional React components wrapping SVG paths.

## Logic & Data Handling
*   Static SVG data.

## Dependencies
*   `React` (type definitions).

## Potential Issues
*   The icons are hardcoded as inline SVGs. If the icon set grows significantly, this file might become unwieldy.
*   Consistency: Ensure viewBox attributes are consistent for correct scaling across the app.
