import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { children: string; className?: string };

/**
 * Markdown for examples docs: internal `/…` anchors use SPA navigation; external links open new tab.
 */
export function ExamplesMarkdown({ children, className }: Props) {
  return (
    <div className={className ?? "doc-viewer-markdown"} style={{ fontSize: 15 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: ch, ...rest }) => {
            if (href?.startsWith("http://") || href?.startsWith("https://")) {
              return (
                <a href={href} target="_blank" rel="noreferrer" {...rest}>
                  {ch}
                </a>
              );
            }
            if (href?.startsWith("/")) {
              return (
                <Link to={href} {...rest}>
                  {ch}
                </Link>
              );
            }
            return (
              <a href={href} {...rest}>
                {ch}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
