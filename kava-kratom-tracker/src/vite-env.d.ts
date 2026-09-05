/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEGISCAN_API_KEY: string
  readonly VITE_USE_EDGE_PROXY?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_ROOKREADER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
