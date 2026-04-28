# Specification: components/PageTransition.tsx

## Overview
The `PageTransition` component provides a stylized, high-fidelity entry animation for page content. It mimics a "boot-up" or "glitch" sequence, including scanlines, flickering, and chromatic aberration effects, giving the application a retro/cyberpunk feel.

## Functionality
*   **User Interface:**
    *   Displays a full-screen "glitch" overlay when the page first loads/boots.
    *   Applies entrance animations to the `children` content.
*   **Navigation:**
    *   Not applicable.

## Behavior
*   **Booting Sequence:** Uses an `isBooting` timer (600ms) to trigger a one-time entrance sequence.
*   **Animations:** 
    *   Main content fades in with a skew/blur transition.
    *   "Data Stream" scanline moves across the screen.
    *   "Glitch" overlay triggers on mount.

## State Management
*   `isBooting`: Boolean tracking the initial boot sequence status.

## Page/Component Structure
*   `div` (Wrapper)
    *   `motion.div` (Glitch Overlay - only shown if `isBooting`)
    *   `motion.div` (Content Wrapper with entry animations)
        *   `motion.div` (Entrance flicker effect)
            *   `children`
    *   `motion.div` (Data stream scanline)

## Logic & Data Handling
*   **Animation Logic:** Uses `motion/react` components for declarative animations (initial, animate, transition).
*   **Data Handling:** None.

## Dependencies
*   `motion/react` (Animation engine).

## Potential Issues
*   **Accessibility:** The intense flickering/glitch effects could be harmful to users with vestibular disorders or photosensitivity. Consider adding a preference to reduce motion.
*   **SSR Hydration:** The component uses `useState` and `useEffect` which may trigger a slight layout shift between the server-rendered HTML and the client-rendered state.
*   **Coupling:** Directly contains hardcoded animation parameters that are specific to the "cyberpunk" theme.
