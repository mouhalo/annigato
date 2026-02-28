/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_POLLINATIONS_API_URL: string
  readonly VITE_WHATSAPP_API_KEY: string
  // plus de variables d'environnement...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
