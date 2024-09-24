import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteInspector } from "@sveltejs/vite-plugin-svelte-inspector";

export default {
    // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    plugins: [svelte(), svelteInspector({})],
};
