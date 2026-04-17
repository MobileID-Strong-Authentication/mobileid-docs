import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve('docs/.vitepress/dist')

const redirects = new Map()

function addRedirect(from, to) {
  redirects.set(from, to)
}

function addSectionRedirects(fromBase, toBase, entries) {
  for (const entry of entries) {
    const [fromSlug, toSlug = fromSlug] = Array.isArray(entry) ? entry : [entry, entry]
    addRedirect(`${fromBase}/${fromSlug}`, `${toBase}/${toSlug}`)
  }
}

addSectionRedirects('/reference-guide', '/rest-api-guide', [
  'app-provider-client-integration',
  'auto-activation',
  'best-practices',
  'create-client-certs',
  'health-status',
  'imprint',
  'introduction',
  'mobile-id-api',
  'root-ca-certs',
  'status-fault-codes',
])

addSectionRedirects('/oidc', '/oidc-integration-guide', [
  'best-practices',
  'cloud-integration-guide',
  'getting-started',
  'imprint',
  'introduction',
  'message-formats',
  'oidc-use-cases',
])

addSectionRedirects('/rig-radius', '/radius-interface-gateway-guide', [
  'annexes',
  'introduction',
  'radius-protocol',
  ['rig-deployment', 'deployment'],
])

addSectionRedirects('/entraid', '/oidc-integration-guide', [
  ['external-auth-methods', 'cloud-integration-guide#microsoft-entra-id'],
  ['getting-started', 'cloud-integration-guide#microsoft-entra-id'],
  ['imprint', 'cloud-integration-guide#microsoft-entra-id'],
  ['troubleshooting', 'cloud-integration-guide#troubleshooting'],
])

addSectionRedirects('/entraid-guide', '/oidc-integration-guide', [
  ['external-auth-methods', 'cloud-integration-guide#microsoft-entra-id'],
  ['getting-started', 'cloud-integration-guide#microsoft-entra-id'],
  ['imprint', 'cloud-integration-guide#microsoft-entra-id'],
  ['troubleshooting', 'cloud-integration-guide#troubleshooting'],
])

addRedirect('/api-reference/api', '/rest-api-guide/api-specification')
addRedirect('/api-reference/openapi-explorer', '/rest-api-guide/api-specification')
addRedirect('/api-reference/mermaid-demo', '/')
addRedirect('/api/', '/rest-api-guide/api-specification')
addRedirect('/api/api', '/rest-api-guide/api-specification')
addRedirect('/rest-api-guide/', '/rest-api-guide/introduction')
addRedirect('/oidc-integration-guide/', '/oidc-integration-guide/introduction')
addRedirect('/radius-interface-gateway-guide/', '/radius-interface-gateway-guide/introduction')
addRedirect('/reference-guide/application-integration', '/rest-api-guide/app-provider-client-integration')
addRedirect('/reference-guide/release-notes', '/release-notes/')
addRedirect('/oidc/coud-integration-guide', '/oidc-integration-guide/cloud-integration-guide')
addRedirect('/radius-interface-gateway-guide/rig-deployment', '/radius-interface-gateway-guide/deployment')
addRedirect('/release-notes/release-notes', '/release-notes/')
addRedirect('/blog/', '/release-notes/')
addRedirect('/blog/posts/2026-03-23-mobile-id-passkeys', '/release-notes/posts/2026-03-30-mobile-id-passkeys')

for (const langSuffix of ['', '.de', '.fr', '.it']) {
  addRedirect(
    `/release-notes/posts/2026-03-23-mobile-id-passkeys${langSuffix}`,
    `/release-notes/posts/2026-03-30-mobile-id-passkeys${langSuffix}`,
  )
  addRedirect(
    `/release-notes/posts/2026-03-28-mobile-id-entra-external-mfa${langSuffix}`,
    `/release-notes/posts/2026-03-27-mobile-id-entra-external-mfa${langSuffix}`,
  )
  addRedirect(
    `/release-notes/videos/2026-03-30-mobile-id-passkeys-explainer${langSuffix}`,
    `/release-notes/posts/2026-03-30-mobile-id-passkeys${langSuffix}`,
  )
  addRedirect(
    `/release-notes/videos/2026-03-27-mobile-id-entra-external-mfa-explainer${langSuffix}`,
    `/release-notes/posts/2026-03-27-mobile-id-entra-external-mfa${langSuffix}`,
  )
}

function renderRedirectHtml(targetPath) {
  const escapedTarget = targetPath
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

  const scriptSafeTarget = JSON.stringify(targetPath).replace(/</g, '\\u003c')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting…</title>
    <meta http-equiv="refresh" content="0; url=${escapedTarget}">
    <meta name="robots" content="noindex,follow">
    <link rel="canonical" href="${escapedTarget}">
    <script>
      window.location.replace(${scriptSafeTarget});
    </script>
  </head>
  <body>
    <p>This page has moved to <a href="${escapedTarget}">${escapedTarget}</a>.</p>
  </body>
</html>
`
}

function writeRedirectFile(relativeFilePath, targetPath) {
  const fullPath = path.join(DIST_DIR, relativeFilePath)
  mkdirSync(path.dirname(fullPath), { recursive: true })
  writeFileSync(fullPath, renderRedirectHtml(targetPath))
}

for (const [fromPath, toPath] of redirects) {
  const normalizedFrom = fromPath === '/' ? '/' : fromPath.replace(/\/+$/, '')

  if (fromPath.endsWith('/')) {
    writeRedirectFile(path.posix.join(normalizedFrom.slice(1), 'index.html'), toPath)
    continue
  }

  if (normalizedFrom.endsWith('.html')) {
    writeRedirectFile(normalizedFrom.slice(1), toPath)
    continue
  }

  writeRedirectFile(`${normalizedFrom.slice(1)}.html`, toPath)
  writeRedirectFile(path.posix.join(normalizedFrom.slice(1), 'index.html'), toPath)
}

console.log(`Generated ${redirects.size} legacy redirect mappings in ${DIST_DIR}`)
