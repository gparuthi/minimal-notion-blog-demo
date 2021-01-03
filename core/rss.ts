import { Post } from "../types/blog";

const generateRssItem = (post: Post): string => `
<item>
  <guid>https://sukh.vercel.com/${post.slug}</guid>
  <title>${post.title}</title>
  <link>https://sukh.vercel.com/${post.slug}</link>
  <description>${post.preview}</description>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>
`;

export const generateRss = (posts: Post[]): string => `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Gaurav Paruthi – Blog</title>
  <link>https://sukh.vercel.com</link>
  <description>Writing about coding, design and things I like</description>
  <language>en</language>
  <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
  <atom:link href="https://sukh.vercel.com/api/blog.xml" rel="self" type="application/rss+xml"/>
  ${posts.map(generateRssItem).join("")}
</channel>
</rss>
`;
