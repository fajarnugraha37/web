# Architectural Foundations & Atomic Design

## 1. Core Principles
The UI refactoring will strictly adhere to the following architectural principles:
- **Atomic Design:** UI components will be categorized into Atoms, Molecules, Organisms, and Templates.
- **Strict Separation of Concerns:** 0% business logic inside render functions. UI components must only be responsible for rendering based on provided props.
- **Type-First Development:** TypeScript interfaces must be defined before implementing the component or hook. This establishes a clean API contract and prevents prop drilling confusion.
- **Data vs. Presentation:** Data fetching and complex state management will be restricted to Server Components and custom hooks. UI components are fully controlled via props.

## 2. Directory Structure Mapping
We will reorganize the `components/` directory to reflect the Atomic Design methodology:

```text
components/
├── atoms/       # Primitives: Button, Icon, Input, Badge
├── molecules/   # Combinations: SearchBar, BlogCard, PaginationControls
├── organisms/   # Sections: Header, Footer, BlogListSection, HeroSection
└── templates/   # Layouts: Page layouts without injected data
hooks/           # Extracted logic (e.g., usePagination, useBlogFilter)
lib/             # Utilities and design tokens
types/           # Global interfaces and domain models
```

## 3. Atomic Design Definitions

### Atoms
- **Definition:** The smallest, indivisible building blocks of the UI.
- **Responsibility:** Visual presentation of primitive elements.
- **Rules:** Cannot contain other components (except icons). Completely stateless. Must expose a clean API (props) extending standard HTML attributes.
- **Examples:** `Button`, `Input`, `Typography`, `Icon` (via `lucide-react`).

### Molecules
- **Definition:** Simple groups of UI elements functioning together as a unit.
- **Responsibility:** Combining atoms to form reusable functional pieces.
- **Rules:** Can contain Atoms and other Molecules. Minimal internal state (e.g., local toggle state for UI purposes only). Fully controlled via props for business logic.
- **Examples:** `SearchBar` (Input + Button), `BlogCard` (Typography + Badge + Image).

### Organisms
- **Definition:** Relatively complex UI components that form distinct sections of an interface.
- **Responsibility:** Orchestrating molecules and atoms into standalone features.
- **Rules:** Must expose a clean API surface. Should NOT fetch data directly; data is passed down from the Page/Template. Can integrate with custom hooks for complex UI interactions, but business logic (like filtering data) must be injected via props or abstracted into headless hooks.
- **Examples:** `Header`, `BlogListSection` (Sidebar + Grid + Pagination), `HeroSection`.

### Templates & Pages
- **Templates:** Page-level structures that define where organisms sit. They are agnostic to the actual data content.
- **Pages (`app/**/page.tsx`):** Server Components responsible for data fetching, SEO (JSON-LD), and injecting data into Templates/Organisms.

## 4. Component Contract Guidelines
Every component must follow a strict structure:
1.  **Interface Definition:** Exported `Props` interface detailing required and optional properties.
2.  **Component Implementation:** Functional component definition.
3.  **Logic Separation:** Use headless hooks if component needs logic, keeping the render function clean.

```tsx
// Example of an Atom Contract
import { ButtonHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button.variants';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

// Render function contains 0% business logic
export const Button = ({ children, isLoading, leftIcon, ...props }: ButtonProps) => {
  // ...
};
```