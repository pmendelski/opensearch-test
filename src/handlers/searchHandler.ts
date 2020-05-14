import { RequestHandler, Request } from 'express';

const stringParam = (req: Request, name: string, defaultValue: string = ''): string => {
  const value = req.query[name];
  return (value == undefined || value == null) ? defaultValue : value.toString();
}

const intParam = (req: Request, name: string, defaultValue: number = 0): number => {
  const value = stringParam(req, name, '' + defaultValue);
  return parseInt(value, 10);
}

export const searchHandler = (baseUrl: string): RequestHandler => {
  return (req, res, _) => {
    const totalElements = 100;
    const phrase = stringParam(req, 'phrase', '');
    const skip = intParam(req, 'skip', 0);
    const size = intParam(req, 'size' , 10);
    const elements = Math.max(0, Math.min(totalElements - skip, size));
    const titleSuffix = phrase != '' ? ` about ${phrase}` : ""
    const items = Array(elements).fill(0)
      .map((_, i: number) => i + skip + 1)
      .map(i => `
        <item>
          <title>Post #${i}${titleSuffix}</title>
          <link>https://www.example.com/posts/${i}</link>
          <description>A short description for post #${i}</description>
        </item>
      `)
      .join('');
    const description = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0"
      xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">
        <channel>
          <title>Search results for: ${phrase}</title>
          <link>${baseUrl}</link>
          <description>Search results for phrase: "${phrase}", skip: ${skip}, size: ${size}</description>
          <opensearch:totalResults>${totalElements}</opensearch:totalResults>
          <opensearch:startIndex>${skip}</opensearch:startIndex>
          <opensearch:itemsPerPage>${size}</opensearch:itemsPerPage>
          ${items}
        </channel>
      </rss>
    `.trim()
    res
      .status(200)
      .contentType('application/rss+xml')
      .send(description);
  }
};
