import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  app: {
    cdnURL: './',
    head: {
      title: 'Nuxt Electron Starter',
    },
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ssr: false,
  nitro: {
    preset: 'static',
  },
  experimental: {
    payloadExtraction: false,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
})
