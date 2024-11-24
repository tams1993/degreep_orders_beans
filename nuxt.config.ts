// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon','@pinia/nuxt',
  ],
  runtimeConfig: {
    SUPABASE_URL: process.env.SUPABASE_URL, // can be overridden by NUXT_API_SECRET environment variable
    SUPABASE_KEY: process.env.SUPABASE_KEY, // can be overridden by NUXT_API_SECRET environment variable
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL, // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      SUPABASE_KEY: process.env.SUPABASE_KEY
    }
  },
})