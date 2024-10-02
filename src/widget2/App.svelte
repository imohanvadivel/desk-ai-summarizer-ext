<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { Button } from "deskblocks";
    import { initApp } from "../lib/util";

    let App;
    setContext("App", App);

    onMount(() => {
        initApp().then((app) => (App = app));
    });
</script>

<main>
    <h1>UserPreference</h1>
    <Button>Save</Button>
    <Button variant="secondary">Cancel</Button>
</main>
