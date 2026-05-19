const config = {
    SERVER_URI: import.meta.env.VITE_SERVER_URI ?? 'https://api.eurekaclusters.eu',
    SERVICE_LIST_TOKEN: import.meta.env.VITE_SERVICE_LIST_TOKEN ?? null,
    DEV_AUTH_TOKEN: import.meta.env.DEV ? import.meta.env.VITE_DEV_AUTH_TOKEN ?? null : null,
}

export default config;
