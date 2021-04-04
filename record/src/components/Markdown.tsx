import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMarkdownHtml from 'react-markdown/with-html';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import gfm from 'remark-gfm';
import toc from 'remark-toc';
import remarkSlug from 'remark-slug';

interface Props {
  children: string;
  style: Record<string, string>;
  allowDangerousHtml?: boolean;
  className?: string;
}

/**
 * This is a Markdown renderer to use in your page.
 * Syntax highlighting from react-syntax-highlighter.
 * Additional plugins:
 *  - [remark-gfm](https://github.com/remarkjs/remark-gfm)
 *  - [remark-toc](https://github.com/remarkjs/remark-toc)
 *  - [remark-slug](https://github.com/remarkjs/remark-slug)
 * General styling is provided by [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography).
 *  The `prose` class is applied by default. Use the prose modifier classes to adjust the styling.
 * Use grey-matter to get the frontmatter and the content from a markdown file, then pass
 *  the content as the child of the Markdown component.
 *
 * example:
 * ```js
 * import React from 'react';
 * import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
 * import { Markdown } from 'components/Markdown';
 *
 * export const Component = () => {
 *   const markdown = `
 * # Title
 *
 * Hello there!
 * `;
 *
 *   return <Markdown style={dark}>{markdown}</Markdown>;
 * };
 * ```
 *
 * @param props.style The style from react-syntax-highlighter to apply to the code in the markdown.
 * @param props.allowDangerousHtml Whether to allow dangerous HTML in your markdown.
 * @param props.className Any additional classes you want to add to the markdown component.
 * @param children The markdown text that you want to render in the markdown.
 */
export const Markdown: React.FC<Props> = ({ className, children, allowDangerousHtml, style }) => {
  const renderers: ReactMarkdown.ReactMarkdownPropsBase['renderers'] = {
    code: ({ language, value }) => (
      <SyntaxHighlighter language={language} style={style} wrapLines showLineNumbers>
        {value}
      </SyntaxHighlighter>
    ),
  };

  const plugins = [
    gfm,
    remarkSlug,
    toc,
  ];

  if (allowDangerousHtml) {
    return (
      <ReactMarkdownHtml
        className={`prose ${className ?? ''}`}
        plugins={plugins}
        renderers={renderers}
        allowDangerousHtml
      >
        {children}
      </ReactMarkdownHtml>
    );
  }

  return (
    <ReactMarkdown className={`prose ${className ?? ''}`} plugins={plugins} renderers={renderers}>
      {children}
    </ReactMarkdown>
  );
};
