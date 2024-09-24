<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { Button } from "deskblocks";
    import { setUserPref, type UserPreference } from "./lib/util";

    let App;
    setContext("App", App);

    onMount(() => {
        ZOHODESK.extension.onload().then((app) => {
            App = app;
            setUserPref(App.meta.userPreferences);
            App.instance.on("user_preference.changed", (pref: UserPreference) => setUserPref(pref));
        });
    });
</script>

<main>
    <Button>Hey there</Button>
</main>
