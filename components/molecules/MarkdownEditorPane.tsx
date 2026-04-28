"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages as lezerLanguages } from "@codemirror/language-data";
import { vim, Vim, getCM } from "@replit/codemirror-vim";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { LabFile } from "@/types";

interface MarkdownEditorPaneProps {
  activeFile: LabFile | undefined;
  updateFileContent: (content: string) => void;
  editorParentRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  width: string;
}

/**
 * Molecule: MarkdownEditorPane
 * Wraps the CodeMirror editor with VIM mode and terminal aesthetics.
 */
export function MarkdownEditorPane({
  activeFile,
  updateFileContent,
  editorParentRef,
  onScroll,
  width,
}: MarkdownEditorPaneProps) {
  return (
    <div 
      ref={editorParentRef} 
      onScroll={onScroll} 
      style={{ width }} 
      className="border border-accent/20 bg-card/5 overflow-hidden relative group hover:border-accent/40 transition-colors flex flex-col h-full"
    >
      <div className="absolute top-2 right-4 text-[8px] text-accent/20 uppercase tracking-[0.2em] z-10 pointer-events-none">
        -- VIM_MODE_ACTIVE --
      </div>
      <CodeMirror
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
    </div>
  );
}
