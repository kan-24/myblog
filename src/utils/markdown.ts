import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(anchor, {
  slugify: (s) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
});

export function renderMarkdown(input: string) {
  return md.render(input);
}
