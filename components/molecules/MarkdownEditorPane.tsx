"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages as lezerLanguages } from "@codemirror/language-data";
import { vim, Vim, getCM } from "@replit/codemirror-vim";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Image as ImageIcon } from "lucide-react";
import { LabFile } from "@/types";

export interface MarkdownEditorRef {
  insertTextAtCursor: (text: string) => void;
}

interface MarkdownEditorPaneProps {
  activeFile: LabFile | undefined;
  updateFileContent: (content: string) => void;
  editorParentRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  width: string;
  onOpenAssets?: () => void;
}

/**
 * Molecule: MarkdownEditorPane
 * Wraps the CodeMirror editor with VIM mode and terminal aesthetics.
 */
export const MarkdownEditorPane = forwardRef<MarkdownEditorRef, MarkdownEditorPaneProps>(
  ({ activeFile, updateFileContent, editorParentRef, onScroll, width, onOpenAssets }, ref) => {
    const cmRef = useRef<ReactCodeMirrorRef>(null);

    useImperativeHandle(ref, () => ({
      insertTextAtCursor: (text: string) => {
        const view = cmRef.current?.view;
        if (view) {
          const selection = view.state.selection.main;
          view.dispatch({
            changes: { from: selection.from, to: selection.to, insert: text },
            selection: { anchor: selection.from + text.length }
          });
          view.focus();
        }
      }
    }));

    return (
      <div 
        ref={editorParentRef} 
        onScroll={onScroll} 
        style={{ width }} 
        className="border border-accent/20 bg-card/5 overflow-hidden relative group hover:border-accent/40 transition-colors flex flex-col h-full"
      >
        <CodeMirror
          ref={cmRef}
          value={activeFile?.content || ""}
          height="100%"
          theme={vscodeDark}
          extensions={[
            vim(), 
            markdown({ base: markdownLanguage, codeLanguages: lezerLanguages })
          ]}
          onCreateEditor={(view) => {
            const cm = getCM(view);
            if (cm) {
              Vim.handleKey(cm, 'i', 'user');
            }
          }}
          onChange={updateFileContent}
          className="text-sm font-mono flex-1 overflow-hidden"
          autoFocus={true}
          basicSetup={{ 
            lineNumbers: true, 
            foldGutter: true, 
            dropCursor: true, 
            syntaxHighlighting: true, 
            highlightActiveLine: true, 
            autocompletion: true, 
            defaultKeymap: true 
          }}
        />

        {/* Floating ASSETS Button */}
        {onOpenAssets && (
          <button
            onClick={onOpenAssets}
            className="absolute top-6 right-6 z-20 flex items-center justify-center gap-2 bg-black border border-accent/40 text-accent px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.15)] hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all group-hover:opacity-100 opacity-70"
          >
            <ImageIcon size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Assets</span>
          </button>
        )}
      </div>
    );
  }
);

MarkdownEditorPane.displayName = "MarkdownEditorPane";
