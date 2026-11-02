import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="max-w-none text-[var(--canvas-text)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading mb-4 text-2xl font-extrabold tracking-tight text-[var(--canvas-text)] sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading mt-6 mb-3 border-b border-[var(--border-glass)] pb-2 text-xl font-bold tracking-tight text-[var(--canvas-text)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 text-lg font-semibold text-[var(--canvas-text)]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 text-sm leading-relaxed text-[var(--canvas-text)] sm:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1.5 pl-5 text-sm text-[var(--canvas-text)] sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1.5 pl-5 text-sm text-[var(--canvas-text)] sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[var(--canvas-text)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-[var(--canvas-text-secondary)] italic">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="glass-panel my-4 rounded-r-lg border-l-4 border-[#3D52A0] py-2 pr-3 pl-4 text-sm text-[var(--canvas-text)] italic dark:border-[#7091E6]">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isCodeBlock = Boolean(className);
            if (isCodeBlock) {
              return (
                <code
                  className="font-mono text-xs text-[var(--canvas-text)] sm:text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md border border-[var(--border-glass)] bg-black/5 px-1.5 py-0.5 font-mono text-xs text-[#3D52A0] dark:bg-black/30 dark:text-[#ADBBDA]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl border border-[var(--border-glass)] bg-[var(--code-bg)] p-4 font-mono text-xs text-[var(--canvas-text)] shadow-inner sm:text-sm">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#3D52A0] underline decoration-[#7091E6]/50 underline-offset-2 transition hover:text-[#7091E6] dark:text-[#7091E6] dark:hover:text-[#ADBBDA]"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
