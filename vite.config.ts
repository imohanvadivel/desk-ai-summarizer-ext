import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import mkcert from "vite-plugin-mkcert";
import svgLoader from "vite-svg-loader";

export default defineConfig({
    base: "./",
    plugins: [svelte(), svgLoader({ defaultImport: "raw" }), mkcert()],
    build: {
        modulePreload: false,
        outDir: "output",
        assetsDir: "chunks",
        cssCodeSplit: false,
        cssMinify: true,
        minify: true,
        rollupOptions: {
            output: {},
            input: {
                main: "widget1.html",
                widget2: "widget2.html",
            },
        },
    },
    resolve: {
        alias: {
            $lib: "./src/lib",
        },
    },
    server: {
        host: "127.0.0.1",
        port: 5000,
    },
});
