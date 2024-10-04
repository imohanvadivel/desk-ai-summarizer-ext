<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { Button } from "deskblocks";
    import { initApp } from "../lib/util";

    let App;
    setContext("App", App);

    onMount(async() => {
        App = await initApp();
    });
</script>

<main>
    <Button>New Project</Button>
</main>
