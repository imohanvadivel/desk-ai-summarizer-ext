<script lang="ts">
    import 'deskblocks/globalStyles';
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
    <h1>UserPreference</h1>
    <Button>Save</Button>
    <Button variant="secondary">Cancel</Button>
</main>
