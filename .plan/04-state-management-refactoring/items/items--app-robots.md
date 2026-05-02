# Specification: app-robots.ts

## 1. Problem Framing
Generates the `robots.txt` configuration for the application to guide web crawlers.

## 2. State Model
- **Ownership:** Static configuration file.
- **State:** No runtime state; configuration is derived from `ENV`.

## 3. Data Flow
- **Input:** Environment variable `BASE_URL`.
- **Output:** Static object structure for `robots.txt`.

## 4. Component Design
- **Boundaries:** Utility/Config file.

## 5. Async & Concurrency
- None.

## 6. Performance
- **Bottlenecks:** None.

## 7. Failure Handling
- **Resilience:** Static fallback configuration.

## 8. Observability
- N/A.

## 9. Findings & Recommendations
- Purely static configuration. No migration needed.
