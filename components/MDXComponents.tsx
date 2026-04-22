import React from "react";
import { CodeBlock } from "./CodeBlock";

export const mdxComponents: any = {
  pre: ({ children }: any) => {
    return <>{children}</>;
  },
  code: (props: any) => {
    const { children, className, ...rest } = props;
    if (className) {
      const codeString = Array.isArray(children)
        ? children.join("")
        : String(children);
      return <CodeBlock code={codeString} className={className} {...rest} />;
    }
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-sm text-accent-secondary"
        {...props}
      />
    );
  },
  h2: (props: any) => (
    <h2
      {...props}
      id={props.children.toString().toLowerCase().replace(/\s+/g, "-")}
    />
  ),
  h3: (props: any) => (
    <h3
      {...props}
      id={props.children.toString().toLowerCase().replace(/\s+/g, "-")}
    />
  ),
  table: (props: any) => (
    <div className="w-full overflow-x-auto my-6 border border-border/30 rounded-lg">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border-b border-border/30 bg-muted/50 px-4 py-3 text-left font-bold text-accent uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border-b border-border/10 px-4 py-3 text-foreground/80"
      {...props}
    />
  ),
};
