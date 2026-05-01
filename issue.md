# Feature Plan: Assets Picker for Markdown Playground

## 1. Feature Description
An integrated "Assets Picker" feature for the Markdown Laboratory that allows users to manage (view, upload, delete) and inject assets (images, videos, audio, documents) directly into the markdown editor. The system adapts its capabilities based on the application's runtime mode (`Read` vs `Write`).

## 2. Supported File Types & Storage Structure
Assets will be stored locally in the `public/` directory so they can be served directly by Next.js and seamlessly included in static exports.

**Folder Structure:**
- `public/assets/img/`: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`
- `public/assets/video/`: `.mp4`, `.mov`, `.avi`, `.webm`, `.ogg`, `.mkv`
- `public/assets/audio/`: `.mp3`, `.wav`, `.aac`, `.flac`, `.ogg`
- `public/assets/doc/`: `.md`, `.mdx`, `.txt`, `.json`, `.yaml`, `.docs`, `.docx`, `.ppt`, `.pptx`, `.csv`, `.xls`, `.xlsx`, `.pdf`, `.zip`, `.rar`

**Collision Strategy (Option B):** 
If an uploaded file shares the exact name as an existing file, a timestamp suffix will be automatically appended (e.g., `diagram-17012345.png`) to prevent broken links on older posts.

## 3. API Design & Static Indexing
Because Next.js `export` mode (Read Mode) cannot run dynamic API routes, we will use a hybrid approach:
- **Build-Time Indexing (Read Mode)**: The `scripts/pre-build.ts` will scan `public/assets/` and generate a static `public/assets-index.json`. The frontend will fetch this JSON to render the Gallery.
- **Dynamic Endpoints (Write Mode Only)**: `app/api/labs/assets/route.ts`
  - **`GET`**: Dynamically scans `public/assets/*` and returns the categorized list.
  - **`POST`**: Accepts `multipart/form-data`. Determines the category, resolves naming collisions, saves the file to the filesystem, and optionally updates `assets-index.json` or forces the client to re-fetch the dynamic `GET`.
  - **`DELETE`**: Removes the file from the filesystem using `fs.unlinkSync`.

## 4. UI/UX Design (Frontend)
- **Trigger**: A new "ASSETS" button (with an `ImageIcon`) in the `MarkdownToolbar`.
- **AssetsPickerModal**: A Cyberpunk-themed modal featuring:
  - **Gallery Tab**: A searchable and filterable grid/list of existing assets. Images get thumbnails; other types get specific icons.
  - **Upload Tab (Write Mode Only)**: A drag-and-drop zone for uploading new files. Shows progress and supports multi-file uploads natively or sequentially.
- **Read Mode Behavior**: The upload tab and delete buttons within the gallery will be hidden.

## 5. CodeMirror Injection Strategy
To inject the selected asset exactly where the user is typing, the `MarkdownEditorPane` will be updated:
- Expose the underlying CodeMirror instance using `forwardRef` and `useImperativeHandle`.
- When an asset is selected from the modal, the parent component will calculate the current cursor position (`caret`) and inject the specific syntax:
  - **Image**: `![alt text](/assets/img/file.jpg)`
  - **Video**: `<video controls width="100%"><source src="/assets/video/file.mp4" /></video>`
  - **Audio**: `<audio controls><source src="/assets/audio/file.mp3" /></audio>`
  - **Document**: `[Download file.pdf](/assets/doc/file.pdf)`

## 6. Execution Plan (Step-by-Step)

### Phase 1: API & File System
1. Update `types/index.ts` to include Asset interfaces (e.g., `AssetItem`, `AssetCategory`).
2. Create `app/api/labs/assets/route.ts` to handle `GET`, `POST`, and `DELETE` requests.
3. Ensure the API automatically creates missing directories (`public/assets/img`, etc.) upon the first upload.

### Phase 2: CodeMirror Integration
1. Refactor `components/molecules/MarkdownEditorPane.tsx` to forward a ref (`MarkdownEditorRef`) exposing an `insertTextAtCursor(text)` function.
2. Update `hooks/useMarkdownEditor.ts` and `MarkdownPlaygroundContent` to handle this new ref.

### Phase 3: UI Components
1. Build `components/molecules/AssetsPickerModal.tsx` containing the Gallery and Upload functionalities.
2. Integrate file upload logic (calling the `POST` API) with loading states.
3. Integrate fetch logic (calling the `GET` API) to populate the gallery.
4. Integrate delete logic (calling the `DELETE` API) with a confirmation prompt.

### Phase 4: Orchestration & Testing
1. Add the "ASSETS" button to `MarkdownToolbar.tsx`.
2. Connect the toolbar button to open `AssetsPickerModal` in `MarkdownPlaygroundContent.tsx`.
3. Link the modal's `onSelect` callback to the `insertTextAtCursor` function of the CodeMirror ref.
4. Test in both Read Mode (`NEXT_PUBLIC_APP_MODE=read`) and Write Mode (`NEXT_PUBLIC_APP_MODE=write`) to ensure UI components and APIs behave according to their restrictions.
