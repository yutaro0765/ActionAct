"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MarkdownPaneProps {
  content: string;
}

export const MarkdownPane = ({ content }: MarkdownPaneProps) => {
  return (
    <ScrollArea className="h-full p-6">
      <article className="prose prose-slate max-w-none dark:prose-invert">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeSanitize]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </ScrollArea>
  );
};