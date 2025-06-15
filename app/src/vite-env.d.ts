interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}