# Specification: components-molecules-FileTabs.tsx

## 1. Problem Framing
Manages navigation and context menu for active lab files.

## 2. State Model
- **Ownership:** Internal local state (`activeMenu`). Parent manages the list of files and active file ID.

## 3. Findings & Recommendations
- The tab menu state is local, which is fine. However, consider if this menu state needs to be managed if we introduce more complex workspace-wide context menus in the future.
