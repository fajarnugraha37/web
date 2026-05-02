# Specification: components-molecules-AssetsPickerModal.tsx

## 1. Problem Framing
Modal component for browsing, uploading, and deleting assets (images, videos, etc.) in the media laboratory.

## 2. State Model
- **Ownership:** Internal local state (`assets`, `activeTab`, `searchQuery`, `deleteItem`, `isDeleting`, `isUploading`).

## 3. Data Flow
- **Input:** `isOpen`, callbacks (`onClose`, `onSelect`).
- **Sync:** Fetches asset metadata from `/api/labs/assets` or `assets-index.json`.

## 4. Component Design
- **Boundaries:** Molecule component.

## 5. Async & Concurrency
- API interaction for CRUD (GET, POST, DELETE). Potential race conditions during rapid upload.

## 6. Performance
- **Bottlenecks:** Sequential file uploads.

## 7. Failure Handling
- Try/catch blocks for API calls with toast notifications.

## 8. Findings & Recommendations
- This component manages a significant amount of data state. Migration to Zustand for `assets` state and React Query for fetching would greatly improve maintainability.
