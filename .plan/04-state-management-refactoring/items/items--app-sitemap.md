# Specification: app-sitemap.ts

## 1. Problem Framing
Generates the application's XML sitemap for SEO purposes by aggregating static routes and dynamic blog content.

## 2. State Model
- **Ownership:** Static content generation.
- **State:** No runtime state; configuration is derived from MDX filesystem and `ENV`.

## 3. Data Flow
- **Input:** MDX filesystem data (`getSortedBlogsData`), Environment variable `BASE_URL`.
- **Output:** Array of sitemap URL objects.

## 4. Component Design
- **Boundaries:** Utility/Config file.

## 5. Async & Concurrency
- None.

## 6. Performance
- **Bottlenecks:** None; data is processed synchronously during build time.

## 7. Failure Handling
- **Resilience:** Static configuration generation.

## 8. Observability
- N/A.

## 9. Findings & Recommendations
- Purely static generation. No migration needed.
