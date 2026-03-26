import { createContentLoader } from 'vitepress'

export interface ReleaseNotesPost {
  url: string
  title: string
  date: string
  description: string
  thumbnail: string
  readingTime: number
  author: string
}

export default createContentLoader('release-notes/posts/*.md', {
  transform(raw): ReleaseNotesPost[] {
    return raw
      .filter(({ url }) => !/\.\w{2}\.html$/.test(url))
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
