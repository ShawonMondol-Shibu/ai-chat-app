"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib";

interface MarkdownContentProps {
  text: string;
}

export function MarkdownContent({ text }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        pre: ({ children, ...props }) => (
          <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-sm" {...props}>
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-muted/50 px-1.5 py-0.5 text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className={cn("text-sm font-mono", className)} {...props}>
              {children}
            </code>
          );
        },
        a: ({ children, href, ...props }) => (
          <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc pl-6" {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal pl-6" {...props}>{children}</ol>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-2 border-primary pl-4 italic" {...props}>{children}</blockquote>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
