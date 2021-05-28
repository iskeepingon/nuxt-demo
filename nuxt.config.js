import path from 'path'
import fs from 'fs'

export default {
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    }
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-demo',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
     ** Customize the progress-bar color
     */
  loading: { color: '#222' },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 直接加载一个 Node.js 模块。（在这里它是一个 Sass 文件）
    // 项目里要用的 CSS 文件
    // '@/assets/css/main.css',
    // // 项目里要使用的 SCSS 文件
    '@/assets/scss/global.scss'
    // 'element-ui/lib/theme-chalk/index.css',
    // 'reset.css',
    // '@/static/css/reset.css',
    // '@/static/css/github-markdown.css',
    // '@/assets/iconfont/iconfont.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // '@/plugins/element-ui',
    // { src: '~plugins/highlight.js' },
    // { src: '~plugins/auth.js'},
    // { src: "~/plugins/axios.js" }
    // { src: "~/plugins/clipboard2.js" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    // prefix: '/api',
    https: true,
    withCredentials: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // transpile: [/^element-ui/],
    /*
     * 收起在head里面的css代码有利于seo
     */
    extractCSS: true//,
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {}
  },
  proxy: {
    '/api': {
      target: 'https://novel.contentchina.com',
      pathRewrite: {
        changeOrigin: true
      }
    }
  },
  ssr: true
}
