import { RequestHandler } from 'express';

export const descriptionHandler = (baseUrl: string): RequestHandler => {
  const description = `
    <?xml version="1.0" encoding="UTF-8"?>
    <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
      <ShortName>Web Search</ShortName>
      <Description>Use Example.com to search the Web.</Description>
      <Tags>example web</Tags>
      <Contact>admin@example.com</Contact>
      <Url type="application/rss+xml"
        indexOffset="0"
        template="${baseUrl}/search?phrase={searchTerms}&amp;skip={startIndex?}&amp;size={count?}"/>
      <Url type="application/opensearchdescription+xml"
        rel="self"
        template="${baseUrl}/description" />
    </OpenSearchDescription>
    `.trim()
  return (_, res) => {
    res
      .status(200)
      .contentType('application/opensearchdescription+xml')
      .send(description);
  }
};
