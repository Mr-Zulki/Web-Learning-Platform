import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="max-w-none text-on-surface">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight mb-space-sm">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-title-md text-title-md text-on-surface font-semibold mt-space-md mb-space-xs border-b border-surface-variant/40 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-title-md text-body-md text-on-surface font-semibold mt-space-sm mb-space-xs">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2.5 text-body-md font-body-md text-on-surface-variant leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2.5 list-disc space-y-1 pl-5 text-body-md font-body-md text-on-surface-variant">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 list-decimal space-y-1 pl-5 text-body-md font-body-md text-on-surface-variant">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-on-surface">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-on-surface-variant italic">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-r-lg border-l-4 border-primary bg-surface-container-low py-2 pr-3 pl-4 text-body-md italic text-on-surface-variant">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isCodeBlock = Boolean(className);
            if (isCodeBlock) {
              return (
                <code
                  className="font-label-code-sm text-xs sm:text-sm text-on-tertiary"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-surface-variant px-1.5 py-0.5 font-label-code-sm text-[12px] font-semibold text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-xl bg-tertiary p-space-md font-label-code-sm text-xs text-on-tertiary shadow-inner sm:text-sm leading-relaxed">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline transition hover:text-secondary"
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
