/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare namespace NodeJS {
  export interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}
