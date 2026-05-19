/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URI: string
    readonly VITE_SERVICE_LIST_TOKEN?: string
    readonly VITE_DEV_AUTH_TOKEN?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
