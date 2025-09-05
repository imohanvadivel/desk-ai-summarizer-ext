<script lang="ts">
    import { onMount } from "svelte";
    import { cleanseConvData, getAllThreadDetails, initApp, promptStreaming } from "../lib/util";
    import Markdown from "svelte-markdown";
    import { Spinner } from "deskblocks";

    let displaySpinner = true;
    let summary = "";

    onMount(async () => {
        await initApp();

        const ticketData = await ZOHODESK.get("ticket");
        const { id: ticketId, subject, createdTime, contactName, email: contactEmail, channel } = ticketData.ticket;

        let threadDetails = await getAllThreadDetails(ticketId);
        let conversation = cleanseConvData(threadDetails);
        let data = {
            subject,
            createdTime,
            contactName,
            contactEmail,
            channel,
            conversation,
        };

        let systemPrompt = `You are an helpful summarizer assistant and your task is to summarize the conversation between a customer and a support agents`;
        let result = await promptStreaming(systemPrompt, JSON.stringify(data));
        summary = result as string;
        displaySpinner = false;
    });
</script>

{#if displaySpinner}
    <div class="spinner-container">
        <Spinner size="large" />
    </div>
{:else}
    <article>
        <Markdown source={summary} />
    </article>
{/if}

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }

    .spinner-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10rem;
    }
    article {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1rem;
        gap: 0.5rem;
        font-size: 14px;
    }

    article :global(p) {
        line-height: 1.3;
    }

    article :global(ul) {
        list-style-type: disc;
        padding: 0 1rem;
    }

    article :global(li) {
        line-height: 1.3;
        padding-bottom: 0.5rem;
    }

    article :global(li:last-child) {
        padding-bottom: 0;
    }

    article :global(ol) {
        list-style-type: decimal;
        padding: 0 1rem;
    }

    article :global(strong) {
        font-weight: 600;
    }

    article :global(h2) {
        font-size: 16px;
        font-weight: 600;
    }

    article :global(h3) {
        font-size: 14px;
        font-weight: 600;
    }


</style>
