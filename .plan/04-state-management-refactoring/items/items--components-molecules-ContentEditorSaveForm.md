# Specification: components-molecules-ContentEditorSaveForm.tsx

## 1. Problem Framing
Provides a form to save/update markdown blog content with metadata (slug, title, tags, description).

## 2. State Model
- **Ownership:** Local state for form values (`isSaving`, `metadata`, `tagInput`). 
- **Ownership:** Currently handles its own API `POST` logic.

## 3. Findings & Recommendations
- This form has complex metadata logic. Migration: Recommend moving the metadata state to a Zustand store (or local form state) and using React Query for the save mutation (`useMutation`).
