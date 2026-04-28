"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import { Maximize2, Info, Lightbulb, MessageSquare, AlertTriangle, AlertOctagon } from "lucide-react";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import { MermaidDiagram } from "@/components/molecules/MermaidDiagram";

// --- Internal Helper Components ---

const Alert = ({ children, type }: { children: React.ReactNode; type: string }) => {
  const icons: Record<string, any> = {
    note: Info,
    tip: Lightbulb,
    important: MessageSquare,
    warning: AlertTriangle,
    caution: AlertOctagon,
  };
  const Icon = icons[type] || Info;
  return (
    <div className={`markdown-alert markdown-alert-${type}`}>
      <p className="markdown-alert-title"><Icon size={16} />{type}</p>
      <div className="markdown-alert-content">{children}</div>
    </div>
  );
};

const customComponents = {
  ...mdxComponents,
  mermaid: MermaidDiagram,
  blockquote: (props: any) => {
    const text = props.children?.[1]?.props?.children?.[0] || "";
    const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (match) {
      const type = match[1].toLowerCase();
      const newChildren = React.Children.map(props.children, (child: any) => {
        if (child.props?.children?.[0] === text) {
          return {
            ...child,
            props: {
              ...child.props,
              children: [
                text.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, ""),
                ...child.props.children.slice(1),
              ],
            },
          };
        }
        return child;
      });
      return <Alert type={type}>{newChildren}</Alert>;
    }
    return <blockquote {...props} />;
  },
};

interface MarkdownPreviewPaneProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onFullScreen: () => void;
  width: string;
}

/**
 * Molecule: MarkdownPreviewPane
 * Renders the formatted markdown with custom plugins and components.
 */
export function MarkdownPreviewPane({
  content,
  previewRef,
  onScroll,
  onFullScreen,
  width,
}: MarkdownPreviewPaneProps) {
  return (
    <div 
      ref={previewRef} 
      onScroll={onScroll} 
      style={{ width }} 
      className="markdown-body p-6 md:p-10 bg-card/5 border border-border/20 font-mono overflow-auto relative h-full"
    >
      <button 
        onClick={onFullScreen} 
        className="absolute top-4 right-4 p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-black transition-all z-20"
      >
        <Maximize2 size={14} />
      </button>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]} 
          rehypePlugins={[rehypeKatex, rehypeSlug, rehypeRaw]} 
          components={customComponents as any}
        >
          {DOMPurify.sanitize(content || "")}
        </ReactMarkdown>
      </div>
    </div>
  );
}
