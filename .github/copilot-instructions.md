# Mobile ID Documentation - AI Agent Instructions

## Project Overview

This is a **VitePress-based technical documentation site** for Swisscom Mobile ID authentication services. The project documents two primary authentication methods:
- **OIDC (OpenID Connect)** integration for modern web/mobile apps
- **Legacy RESTful API** for direct Mobile ID integration

Key stakeholders: Application Providers (APs) integrating Mobile ID authentication into their applications.

## Architecture

### VitePress Structure
- **Entry point**: [docs/index.md](docs/index.md) - home page with hero section and feature cards
- **Configuration**: [docs/.vitepress/config.mts](docs/.vitepress/config.mts) - navigation, sidebars, theme, search
- **Custom theme**: [docs/.vitepress/theme/](docs/.vitepress/theme/) - CSS overrides and theme customization
- **Components**: [docs/components/](docs/components/) - Vue components (e.g., `CustomAPIComponent.vue` for OpenAPI rendering)

### Documentation Sections
```
/reference-guide/     - Legacy Mobile ID API (SOAP/REST, X.509 certs, SIM/App methods)
/oidc/                - OpenID Connect integration guide (modern approach)
/entraid/             - EntraID integration (work in progress)
/rig-radius/          - RADIUS integration guide
/api-reference/       - OpenAPI spec viewer (Swagger UI)
/release-notes/       - Platform and client release notes
```

### Key Technical Concepts
- **Two authentication methods**: Mobile ID SIM (STK-based, SMS PDUs) and Mobile ID App (iOS/Android)
- **OpenAPI spec**: [docs/public/openapi-mobileid.yaml](docs/public/openapi-mobileid.yaml) rendered via Swagger UI
- **Static assets**: [docs/public/img/](docs/public/img/) for images, [docs/img/](docs/img/) for legacy paths

## Development Workflows

### Local Development
```bash
npm run docs:dev          # Start dev server (default: http://localhost:5173)
npm run docs:build        # Build static site to docs/.vitepress/dist/
npm run docs:preview      # Preview production build
```

### Build Output
- Compiled site lives in `docs/.vitepress/dist/` (excluded from version control)
- Cache at `docs/.vitepress/cache/` - can be safely deleted if build issues occur

## Content Conventions

### Markdown Patterns
- **VitePress frontmatter**: Used for layout definitions (e.g., `layout: home` in [index.md](docs/index.md))
- **Custom containers**: `::: info`, `::: warning`, `::: danger` for callouts
- **Vue components**: Import and use inline (see [api-reference/api.md](docs/api-reference/api.md) for Swagger UI example)

### Technical Terminology
Maintain consistency with Mobile ID nomenclature defined in [reference-guide/introduction.md](docs/reference-guide/introduction.md):
- **AP** (Application Provider), **MSISDN**, **DTBD** (Data-To-Be-Displayed), **MSS** (Mobile Signature Service)
- **RP** (Relying Party), **OP** (OpenID Provider) in OIDC context

### File Naming
- Use kebab-case: `getting-started.md`, `cloud-integration-guide.md`
- Avoid special characters except hyphens

## Navigation & Sidebar Management

Sidebar configuration in [config.mts](docs/.vitepress/config.mts) is section-specific:
- Keys like `/reference-guide/` match URL paths
- Items array defines order and visibility
- Missing items won't appear in navigation even if file exists

When adding new pages:
1. Create markdown file in appropriate section
2. Add entry to corresponding sidebar in `config.mts`
3. Consider adding to top-level nav if major section

## OpenAPI Integration

[CustomAPIComponent.vue](docs/components/CustomAPIComponent.vue) renders `openapi-mobileid.yaml` using Swagger UI:
- Mounted client-side only (VitePress SSG requires `onMounted`)
- Spec must be in `docs/public/` for build-time access
- Update component imports in markdown files as `<script setup>` block

## Common Patterns

### Adding a New Documentation Page
1. Create `.md` file in target section (e.g., `docs/oidc/new-topic.md`)
2. Add frontmatter if needed (usually not required for regular pages)
3. Update `docs/.vitepress/config.mts` sidebar for that section
4. Link from related pages for discoverability

### Updating Configuration
- **Theme colors/styles**: Edit `docs/.vitepress/theme/custom.css`
- **Logo/favicon**: Replace files in `docs/public/` (referenced in `config.mts`)
- **Search**: Local search is enabled by default in `config.mts`

### Handling Images
- **Preferred path**: `/public/img/` → Reference as `/img/filename.png` in markdown
- **Legacy path**: `/docs/img/` → Still works but avoid for new content
- Always use absolute paths from site root: `/img/...` not `./img/...`

## Dependencies

- **vitepress@^1.6.4**: SSG framework (peer deps: Vue 3, Vite)
- **swagger-ui**: OpenAPI spec rendering
- No test framework configured (documentation-only project)

## Notes for AI Agents

- This is **documentation**, not application code - focus on content clarity and navigation flow
- **No backend services** - purely static site generation
- When suggesting structural changes, verify impact on [config.mts](docs/.vitepress/config.mts) navigation
- OIDC section is the **current recommended approach** (reference-guide is legacy but still maintained)
- Project is marked "Work in Progress" - expect frequent content updates
