import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [vue()],
        resolve: {
            extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: Number(env.VITE_PORT),
        },
    };
});
