import { marked } from "marked";

export function MarkdownComponent({ content }: { content: string }) {
  return (
    <div
      className="tw-prose tw-max-w-none tw-prose-blue"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    />
  );
}
