import { createContentLoader } from 'vitepress'

export interface ReleaseNotesSidebarPost {
  url: string
  baseUrl: string
  title: string
  date: string
  lang: string
}

function getLang(url: string, frontmatterLang: unknown): string {
  if (typeof frontmatterLang === 'string' && frontmatterLang) return frontmatterLang
  return url.match(/\.(de|fr|it)\.html$/)?.[1] ?? 'en'
}

function getBaseUrl(url: string): string {
  return url.replace(/\.(de|fr|it)\.html$/, '.html')
}

export default createContentLoader('release-notes/posts/*.md', {
  transform(raw): ReleaseNotesSidebarPost[] {
    return raw
      .map(({ url, frontmatter }) => ({
        url,
        baseUrl: getBaseUrl(url),
        title: frontmatter.title ?? '',
        date: frontmatter.date ?? '',
        lang: getLang(url, frontmatter.lang),
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
