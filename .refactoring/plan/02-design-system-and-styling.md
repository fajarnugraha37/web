# Design System & Styling Strategy

## 1. Centralized Styling via Tailwind CSS
The project will centralize all styling using Tailwind CSS (v4) and Design Tokens. The goal is to eliminate custom CSS files (like `app.css` containing complex class definitions) in favor of utility classes and configuration-based tokens.

### Rules
- **No Inline Styles:** Inline styles (`style={{ ... }}`) are strictly prohibited.
- **Tailwind Utility Classes:** All styling must be achieved through Tailwind utility classes.
- **Design Tokens:** Colors, fonts, spacing, and radii must be mapped as design tokens in the Tailwind configuration or the `@theme` block.
- **Class Merging:** Use `clsx` and `tailwind-merge` (typically combined in a `cn` utility in `lib/utils.ts`) to handle dynamic class assignment and prevent specificity conflicts.

## 2. Migrating Custom CSS to Tailwind
The existing `app/app.css` contains custom utility classes (e.g., `.cyber-chamfer`, `.cyber-glitch-text`). These will be migrated into the Tailwind ecosystem:
- **Custom Utilities:** Define custom utilities within the Tailwind `@layer utilities` directive or as Tailwind plugins if they require dynamic values.
- **Complex Animations:** Animations like `glitch-anim` should be defined in the Tailwind configuration and applied via `animate-*` classes.
- **Framer Motion:** For complex, state-driven animations, use `framer-motion` instead of CSS keyframes.

## 3. Responsive Design
- Implement mobile-responsive logic using Tailwind's breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`).
- Follow a **mobile-first** approach. Base classes apply to mobile, and breakpoint prefixes apply to larger screens.
- Use the `useMobile` hook only when conditional rendering is absolutely necessary (e.g., rendering completely different component structures on mobile vs. desktop) to prevent unnecessary DOM bloat. For pure styling changes, always prefer CSS media queries via Tailwind.

## 4. UI Library Standardization
- **Icons:** Use `lucide-react` exclusively for icons. Wrap them in an `Icon` Atom if standardized sizing or theming is required.
- **Animations:** Use `framer-motion` for entrance animations, layout transitions, and interactive feedback.
- **Variants:** Use `class-variance-authority` (cva) for components with multiple visual states (e.g., Buttons, Badges, Cards) to maintain strict typing for visual variants.

## 5. Example: Tailwind + CVA + Design Tokens
```tsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        outline: "text-foreground",
        // 'cyber' token mapped in Tailwind config
        cyber: "border-cyber-accent text-cyber-accent bg-cyber-accent/10 shadow-[0_0_10px_theme(colors.cyber.accent)]", 
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```