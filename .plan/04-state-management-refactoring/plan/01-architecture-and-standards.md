# Architecture & Engineering Standards

## 1. Objective
Refactor the application's state management to use **Zustand** for global client-side state and **React Query** for server-side asynchronous state, adhering strictly to Atomic Design, 0% logic in render, and complete separation of concerns.

## 2. Core Constraints & Principles

### 2.1. Strict Separation of Concerns
- **UI (Components):** Must be purely declarative. **0% business or data fetching logic is allowed inside the render function.** Components only consume data from hooks or props and emit events (callbacks).
- **Logic (Hooks):** 100% of business logic, state mutations, and API calls reside here.
- **State (Stores):** Global, centralized stores (Zustand) manage cross-component data.
- **Remote Data (Query):** Server state is managed exclusively by React Query.

### 2.2. Type-First Development
- **Interfaces First:** All new components, hooks, and stores MUST have explicit TypeScript interfaces defined before implementation.
- **Strict Typing:** No `any`. Avoid `as` assertions. Prefer discriminated unions for complex states.
- **Props Definition:** Clearly delineate required vs. optional props.

### 2.3. Modularity & Anti-Giant Files
- **No Monoliths:** Break down giant orchestrator components (e.g., `MarkdownPlaygroundContent`) into smaller, single-responsibility modules.
- **DRY (Don't Repeat Yourself):** Extract repeated UI patterns into Atoms or Molecules.
- **KISS (Keep It Stupid Simple):** Prefer straightforward, readable code over clever, "golfed" solutions.

### 2.4. Defensive Programming
- **No Silent Failures:** All API calls and WASM executions must have explicit error handling and user feedback (Toasts).
- **Graceful Degradation:** Defensively handle empty states (e.g., no data), loading states (skeleton or spinners), and massive payloads (throttling/pagination).

## 3. The "Distributed Node" Concept
Treat the frontend as a distributed system node:
- Assume the network is slow and unreliable.
- Use Optimistic UI updates where safe, backed by React Query's mutation callbacks for rollback on failure.
- Rely on persistent local storage (via Zustand `persist`) as an offline cache/buffer before syncing with the server.
