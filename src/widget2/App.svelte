<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { Button } from "deskblocks";
  import { APP, initApp } from "../lib/util";

  onMount(async () => {
      await initApp();
      console.log($APP);
  });
</script>

<main>
  <Button>New Project</Button>
</main>