interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): TocItem[] {
  return markdown
    .split('\n')
    .map((line) => {
      const match = /^(#{1,3})\s+(.*)/.exec(line);
      if (!match) return null;
      return {
        id: match[2]
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
        text: match[2].trim(),
        level: match[1].length
      };
    })
    .filter(Boolean) as TocItem[];
}
