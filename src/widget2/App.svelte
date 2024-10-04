<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { Button } from "deskblocks";
    import { initApp } from "../lib/util";

    let App;
    setContext("App", App);

    onMount(async () => {
        App = await initApp();
    });
</script>

<main>
    <h1>UserPreference</h1>
    <Button>Save</Button>
    <Button variant="secondary">Cancel</Button>
</main>
