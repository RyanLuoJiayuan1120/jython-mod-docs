/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 */
import { defineNavbarConfig } from 'vuepress-theme-plume'

/** 中文导航 */
export const navbar = defineNavbarConfig([
  { text: '首页', link: '/', },
  { text: '文档', link: '/docs/', activeMatch: '^/docs/' },
])

/** 英文导航 */
export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/', },
  { text: 'Docs', link: '/en/docs/', activeMatch: '^/en/docs/' },
])
