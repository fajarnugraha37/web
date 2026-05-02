# Specification: components-organisms-BlogContent.tsx

## 1. Problem Framing
Orchestrates the blog post layout including TOC and related posts sidebar.

## 2. State Model
- **Ownership:** Props-controlled (postData, headings, relatedPosts).

## 3. Findings & Recommendations
- The logic (TOC navigation, actions) is passed via props or delegated to child molecules. The organism itself remains declarative. Migration to state management not required for the organism itself.
