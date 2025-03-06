import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";

interface MarkdownContentProps {
  content: string;
}

// 安全なHTML要素と属性の設定
const sanitizeOptions = {
  strip: ["script", "style"],
  allowedTags: [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "em",
    "strong",
    "del",
    "a",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "target"],
    img: ["src", "alt", "title"],
    code: ["className"],
  },
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight], [rehypeSanitize, sanitizeOptions]]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="my-4 leading-relaxed" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-6 my-4" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-6 my-4" {...props} />
          ),
          li: ({ ...props }) => <li className="my-1" {...props} />,
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => (
            <pre
              className="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto"
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 my-4 italic"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
