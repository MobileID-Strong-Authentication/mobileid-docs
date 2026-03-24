import { createContentLoader } from 'vitepress'

export interface BlogPost {
  url: string
  title: string
  date: string
  description: string
  thumbnail: string
  readingTime: number
  author: string
}

export default createContentLoader('blog/posts/*.md', {
  transform(raw): BlogPost[] {
    return raw
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title ?? '',
        date: frontmatter.date ?? '',
        description: frontmatter.description ?? '',
        thumbnail: frontmatter.thumbnail ?? '',
        readingTime: frontmatter.readingTime ?? 0,
        author: frontmatter.author ?? '',
      }))
  },
})
