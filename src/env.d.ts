/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URI: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}