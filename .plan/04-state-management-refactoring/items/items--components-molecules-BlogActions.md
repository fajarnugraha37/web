# Specification: components-molecules-BlogActions.tsx

## 1. Problem Framing
Interaction bar for blog posts, handling copying, sharing, and exports (HTML/PDF).

## 2. State Model
- **Ownership:** Internal local state (`activeMenu`, `copiedLink`, `copiedMd`, `isExporting`).

## 3. Data Flow
- **Input:** Blog data (title, slug, content).

## 4. Component Design
- **Boundaries:** Molecule component.

## 5. Async & Concurrency
- PDF generation (`html2canvas` + `jsPDF`) is highly asynchronous and resource-intensive.

## 6. Performance
- **Bottlenecks:** PDF generation performance.

## 7. Failure Handling
- Basic error handling for clipboard and PDF export.

## 8. Findings & Recommendations
- Highly complex local state. Migration to a Zustand store for export status/menus would clean this component up.
