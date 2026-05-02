# Specification: app-feed.xml-route.ts

## 1. Problem Framing
Generates the application's RSS feed (XML) server-side.

## 2. State Model
- **Ownership:** Static server-side generation.
- **State:** No runtime state.

## 3. Data Flow
- **Input:** Blog data from MDX.
- **Output:** XML feed string.

## 4. Component Design
- **Boundaries:** Next.js Route Handler.

## 5. Findings & Recommendations
- Purely static. No migration needed.
