import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const SITE_ORIGIN = 'https://docs.mobileid.ch'
const DIST_DIR = path.resolve('docs/.vitepress/dist')
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml')
const ROBOTS_PATH = path.resolve('docs/public/robots.txt')
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'cache'])
const LLMS_FILES = [
  path.resolve('docs/public/llms.txt'),
  path.resolve('docs/public/llms-full.txt'),
]
const SOURCE_FILES = [
  ...walk(path.resolve('docs')).filter((filePath) => filePath.endsWith('.md')),
  ...walk(path.resolve('docs/.vitepress')).filter((filePath) => /\.(?:mts|js|vue)$/.test(filePath)),
]
const REQUIRED_PATHS = [
  '/',
  '/release-notes/',
  '/rest-api-guide/',
  '/oidc-integration-guide/',
  '/radius-interface-gateway-guide/',
]

if (!existsSync(DIST_DIR)) {
  fail(`Missing build output at ${DIST_DIR}. Run "npm run docs:build" first.`)
}

if (!existsSync(SITEMAP_PATH)) {
  fail(`Missing sitemap at ${SITEMAP_PATH}.`)
}

const builtPaths = buildAccessiblePathSet(DIST_DIR)
const errors = []

checkRobots()
checkRequiredPaths()
checkSitemap()
checkLlmsFiles()
checkInternalReferences()

if (errors.length > 0) {
  console.error('SEO check failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`SEO check passed (${builtPaths.size} resolvable paths checked)`)

function walk(rootDir) {
  if (!existsSync(rootDir)) return []

  const results = []
  for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      results.push(...walk(fullPath))
    } else if (entry.isFile()) {
      results.push(fullPath)
    }
  }
  return results
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function toPosix(filePath) {
  return filePath.split(path.sep).join(path.posix.sep)
}

function normalizeSitePath(input) {
  if (!input) return null

  let value = input.trim()
  if (!value) return null
  if (value.startsWith(SITE_ORIGIN)) {
    value = new URL(value).pathname
  }

  if (!value.startsWith('/')) return null
  if (value.startsWith('//')) return null

  value = value.split('#')[0].split('?')[0]
  if (!value) return '/'
  return value
}

function buildAccessiblePathSet(distDir) {
  const accessiblePaths = new Set()
  const files = walk(distDir)

  for (const filePath of files) {
    const relativePath = toPosix(path.relative(distDir, filePath))
    const stat = statSync(filePath)
    if (!stat.isFile()) continue

    if (relativePath.endsWith('.html')) {
      const basename = path.posix.basename(relativePath)
      if (basename === 'index.html') {
        const dir = path.posix.dirname(relativePath)
        const webPath = dir === '.' ? '/' : `/${dir}/`
        accessiblePaths.add(webPath)
        accessiblePaths.add(`/${relativePath}`)
        if (webPath !== '/') {
          accessiblePaths.add(webPath.slice(0, -1))
        }
      } else {
        accessiblePaths.add(`/${relativePath}`)
        accessiblePaths.add(`/${relativePath.slice(0, -5)}`)
      }
      continue
    }

    accessiblePaths.add(`/${relativePath}`)
  }

  return accessiblePaths
}

function checkRobots() {
  const robotsTxt = readFileSync(ROBOTS_PATH, 'utf8')
  if (!/Sitemap:\s+https:\/\/docs\.mobileid\.ch\/sitemap\.xml/.test(robotsTxt)) {
    errors.push('docs/public/robots.txt must point to https://docs.mobileid.ch/sitemap.xml')
  }
}

function checkRequiredPaths() {
  for (const requiredPath of REQUIRED_PATHS) {
    if (!builtPaths.has(requiredPath)) {
      errors.push(`Required public path does not resolve in dist: ${requiredPath}`)
    }
  }
}

function checkSitemap() {
  const sitemapXml = readFileSync(SITEMAP_PATH, 'utf8')
  const matches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)]
  if (matches.length === 0) {
    errors.push('sitemap.xml contains no <loc> entries')
    return
  }

  for (const match of matches) {
    const url = match[1]
    const pathname = normalizeSitePath(url)
    if (!pathname) continue

    if (!builtPaths.has(pathname)) {
      errors.push(`Sitemap URL does not resolve in dist: ${url}`)
    }
  }
}

function checkLlmsFiles() {
  for (const filePath of LLMS_FILES) {
    const fileLabel = path.relative(process.cwd(), filePath)
    const text = readFileSync(filePath, 'utf8')
    const urls = new Set(
      [...text.matchAll(/https:\/\/docs\.mobileid\.ch[^\s)"'<>,]*/g)]
        .map((match) => match[0].replace(/[.]+$/, '')),
    )

    for (const url of urls) {
      const pathname = normalizeSitePath(url)
      if (!pathname) continue

      if (!builtPaths.has(pathname)) {
        errors.push(`${fileLabel} references a non-resolving docs URL: ${url}`)
      }
    }
  }
}

function checkInternalReferences() {
  const patterns = [
    /\[[^\]]*]\((\/[^)\s]+)\)/g,
    /\b(?:href|src)=["'](\/[^"']+)["']/g,
    /\blink:\s*['"](\/[^'"]+)['"]/g,
    /url\((['"]?)(\/[^)'"]+)\1\)/g,
  ]

  for (const filePath of SOURCE_FILES) {
    const fileLabel = path.relative(process.cwd(), filePath)
    const text = readFileSync(filePath, 'utf8')
    const references = new Set()

    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        references.add(match[1] ?? match[2])
      }
    }

    for (const reference of references) {
      const pathname = normalizeSitePath(reference)
      if (!pathname) continue

      if (!builtPaths.has(pathname)) {
        errors.push(`${fileLabel} references a non-resolving internal path: ${reference}`)
      }
    }
  }
}
