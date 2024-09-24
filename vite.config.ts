import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import mkcert from "vite-plugin-mkcert";
import svgLoader from "vite-svg-loader";
// import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
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
        rollupOptions:{
            output:{}
        }
    },
    resolve: {
        alias: {
            $lib: "./src/lib",
        },
    },
    server: {
        host: "127.0.0.1",
        port: 5000,
    }
});
