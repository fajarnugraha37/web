# Specification: app-not-found.tsx

## 1. Problem Framing
Provides a standardized 404 error page using a branded cyberpunk aesthetic.

## 2. State Model
- **Ownership:** Static content rendering.
- **State:** No internal client-side state.
- **Source of Truth:** Static metadata and `NotFoundContent` organism.

## 3. Data Flow
- None.

## 4. Component Design
- **Boundaries:** Functional wrapper for `NotFoundContent` organism.

## 5. Async & Concurrency
- None.

## 6. Performance
- **Bottlenecks:** None.

## 7. Failure Handling
- **Resilience:** Serves as a fallback for missing routes.

## 8. Observability
- N/A.

## 9. Findings & Recommendations
- Component is purely presentational.
- Migration to state management libraries is not required.
