# Specification: components-molecules-AdvancedSettingsForm.tsx

## 1. Problem Framing
Collapsible form component that allows users to override default media processing settings (trimming, resolution, preset, quality).

## 2. State Model
- **Ownership:** Props-controlled (mode, trimValue, resolution, preset, etc.).
- **State:** Internal `isOpen` state for collapsible UI.

## 3. Data Flow
- **Input:** External props passed from `FFmpegLabContent` organism.
- **Output:** Callback functions triggered on change.

## 4. Component Design
- **Boundaries:** Molecule component.

## 5. Async & Concurrency
- None.

## 6. Performance
- **Bottlenecks:** Minimal.

## 7. Failure Handling
- **Resilience:** Defensive UI via props validation.

## 8. Findings & Recommendations
- Standard functional form component. No global migration needed.
