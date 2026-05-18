import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)(?:[\\/]|$)/,
                            priority: 30,
                        },
                        {
                            name: "query-vendor",
                            test: /node_modules[\\/]@tanstack[\\/](react-query|query-core|react-table)/,
                            priority: 25,
                        },
                        {
                            name: "ui-vendor",
                            test: /node_modules[\\/](bootstrap|react-bootstrap|@restart|react-transition-group|react-select)(?:[\\/]|$)/,
                            priority: 20,
                        },
                        {
                            name: "network-vendor",
                            test: /node_modules[\\/](axios|axios-auth-refresh)(?:[\\/]|$)/,
                            priority: 15,
                        },
                        {
                            name: "format-vendor",
                            test: /node_modules[\\/](react-number-format)(?:[\\/]|$)/,
                            priority: 10,
                        },
                        {
                            name: "vendor",
                            test: /node_modules/,
                            priority: 5,
                        },
                    ],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": path.join(__dirname, "./src"),
        },
        mainFields: ["browser"],
    },
})
