# Specification: hooks/usePgliteActions.ts

## 1. Problem Framing
Provides UI-side actions for Pglite (PostgreSQL) lab instance.

## 2. State Model
- **Ownership:** Props-controlled (exec). 

## 3. Findings & Recommendations
- Migration: The Pglite actions (purge, export) could potentially live inside a `usePgliteStore` action suite, but for now, they are cleanly abstracted in this hook.
