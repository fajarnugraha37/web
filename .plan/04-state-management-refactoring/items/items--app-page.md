# Specification: app-page.tsx

## 1. Problem Framing
Entry point for the application. Fetches static blog data server-side and injects it into the client-side `HomeContent` orchestrator.

## 2. State Model
- **Ownership:** The component is a Server Component. It owns the initial data fetch.
- **State:** No internal client-side state.
- **Source of Truth:** MDX filesystem (via `getSortedBlogsData`).

## 3. Data Flow
- **Fetch:** `getSortedBlogsData()` (Server-side).
- **Injection:** Data passed as props to `HomeContent`.

## 4. Component Design
- **Boundaries:** Server-side fetch layer, UI injection layer.

## 5. Async & Concurrency
- **Concurrency:** Data fetching is sequential at the server level.

## 6. Performance
- **Bottlenecks:** Minimal; static data fetch.

## 7. Failure Handling
- **Resilience:** Basic server-side execution.

## 8. Observability
- N/A.

## 9. Findings & Recommendations
- The page is pure Server Component logic. 
- Migration to React Query/Zustand is unnecessary for this component as it deals with static data props. Keep it as-is or evaluate if the client-side needs to re-fetch/update this list in the future.
