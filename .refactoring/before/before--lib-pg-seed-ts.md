# Specification: lib/pg-seed.ts

## Overview
The `lib/pg-seed.ts` module contains the raw SQL schema definitions and initial seed data for the browser-based PostgreSQL instance (`PGlite`).

## Functionality
*   **Database Schema:**
    *   Defines core tables: `system_control`, `net_nodes`, `access_logs`, `sys_config`.
*   **Seeding:**
    *   Populates initial records for network infrastructure nodes, simulated access logs, and system configuration.

## Behavior
*   Provides a ready-to-run SQL script that can be executed directly against a PGlite instance to initialize a new database.

## Logic & Data Handling
*   **SQL Schema:** Uses `CREATE TABLE IF NOT EXISTS` to ensure idempotency.
*   **Data:** Contains hardcoded sample network data (e.g., node hostnames, IP addresses, access logs).

## Dependencies
*   None (plain text string).

## Potential Issues
*   **Hardcoded Schema:** If the application requirements for the database grow, this file will need careful management to handle schema migrations rather than just "wiping and recreating" (or relying on `IF NOT EXISTS` for simple additions).
*   **Security:** Contains hardcoded metadata; ensure no actual secrets are ever included here.
