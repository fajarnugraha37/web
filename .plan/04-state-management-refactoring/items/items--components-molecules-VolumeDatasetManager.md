# Specification: components-molecules-VolumeDatasetManager.tsx

## 1. Problem Framing
Manages mounted datasets and volume information for the SQL/Analytics laboratory.

## 2. State Model
- **Ownership:** Internal UI state (`isVolumesOpen`, `isDatasetsOpen`).

## 3. Findings & Recommendations
- Migration: The `copiedQuery` state (for copying dataset links) would be better managed via a central clipboard/UI state store, but local is acceptable for now.
