/**
 * Collections 配置文件，在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 多语言：主题按 `locale 路径 + collection.dir` 定位文档文件——
 *   中文(默认 '/')  : dir 'docs'        -> docs/docs/ 下的文件，permalink /docs/xxx/
 *   英文('/en/')    : dir 'docs'        -> docs/en/docs/ 下的文件，permalink /en/docs/xxx/
 * dir / linkPrefix 不加语言前缀，主题自动补。
 */
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

/** 中文侧边栏 */
const zhSidebar = [
  {
    text: '使用指南',
    prefix: '/docs/usage',
    collapsed: false,
    items: [
      'config.md',
      'module.md',
      'libs.md',
      'api.md',
      'maven.md',
      'resources.md',
      'packages.md',
    ],
  },
  {
    text: '平台',
    prefix: '/docs/platforms',
    collapsed: false,
    items: ['fabric.md', 'neoforge.md', 'paper.md'],
  },
  {
    text: '其它',
    collapsed: false,
    items: ['special-syntax.md', 'TROUBLESHOOTING.md'],
  },
]

/** 英文侧边栏（文案英文化，结构同中文） */
const enSidebar = [
  {
    text: 'Usage Guide',
    prefix: '/en/docs/usage',
    collapsed: false,
    items: [
      'config.md',
      'module.md',
      'libs.md',
      'api.md',
      'maven.md',
      'resources.md',
      'packages.md',
    ],
  },
  {
    text: 'Platforms',
    prefix: '/en/docs/platforms',
    collapsed: false,
    items: ['fabric.md', 'neoforge.md', 'paper.md'],
  },
  {
    text: 'Others',
    collapsed: false,
    items: ['special-syntax.md', 'TROUBLESHOOTING.md'],
  },
]

const docsCollection = defineCollection({
  type: 'doc',
  dir: 'docs',
  linkPrefix: '/docs',
  title: 'Docs',
  sidebar: zhSidebar,
})

const enDocsCollection = defineCollection({
  type: 'doc',
  dir: 'docs',
  linkPrefix: '/docs',
  title: 'Docs',
  sidebar: enSidebar,
})

export const collections = defineCollections([docsCollection])
export const enCollections = defineCollections([enDocsCollection])
