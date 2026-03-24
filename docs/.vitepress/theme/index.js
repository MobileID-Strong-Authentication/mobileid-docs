import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'
import { theme as openApiTheme, useOpenapi } from 'vitepress-openapi/client'
import 'vitepress-openapi/dist/style.css'
import specYaml from '../../public/openapi-mobileid.yaml?raw'
import DocFeedback from './DocFeedback.vue'
import BlogLayout from './BlogLayout.vue'
import BlogPostLayout from './BlogPostLayout.vue'
import './custom.css'
import './blog.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h({
      setup() {
        const { frontmatter } = useData()
        return () => {
          const layout = frontmatter.value.layout
          if (layout === 'blog-index') return h(BlogLayout)
          if (layout === 'blog-post') return h(BlogPostLayout)
          return h(DefaultTheme.Layout, null, {
            'doc-after': () => h(DocFeedback),
          })
        }
      }
    })
  },
  async enhanceApp({ app }) {
    useOpenapi({
      spec: specYaml,
      config: {
        operation: {
          hiddenSlots: ['playground'],
        },
      },
    })
    openApiTheme.enhanceApp({ app })
  },
  setup() {
    const route = useRoute()

    const initZoom = () => {
      mediumZoom('.vp-doc img:not(.no-zoom)', {
        background: 'rgba(255, 255, 255, 0.95)'
      })
    }

    onMounted(() => {
      initZoom()
    })

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}
