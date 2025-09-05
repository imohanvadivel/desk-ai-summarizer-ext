import { get, writable } from "svelte/store";

type UserPreference = {
    theme?: "blue" | "red" | "green" | "yellow" | "orange";
    appearance?: "light" | "dark" | "auto" | "pureDark";
    fontFamily?: "Puvi" | "Roboto" | "Lato";
};

export let APP = writable<APP | null>(null);

// sets the user preference to the widget
function setUserPref(userPref: UserPreference) {
    console.log(`Setting user pref: ${JSON.stringify(userPref)}`);

    const root = document.documentElement;

    if (userPref.theme) {
        const themeClass = Array.from(root.classList).find((c) => c.startsWith("theme-"));
        if (themeClass) root.classList.remove(themeClass);

        root.classList.add(`theme-${userPref.theme.toLowerCase()}`);
    }
    if (userPref.appearance) {
        const appearanceClass = Array.from(root.classList).find((c) => c.startsWith("appearance-"));
        if (appearanceClass) root.classList.remove(appearanceClass);

        let appearance = userPref.appearance.toLowerCase();

        console.log(`Setting appearance: ${appearance}`);

        // Pure dark case
        if (appearance === "puredark") {
            appearance = "dark";
            root.classList.add("pure-dark");
        } else {
            root.classList.remove("pure-dark");
        }

        // Appearance Auto case
        if (appearance === "auto") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                appearance = "dark";
            } else {
                appearance = "light";
            }
        }

        root.classList.add(`appearance-${appearance}`);
    }
    if (userPref.fontFamily) {
        const fontFamilyClass = Array.from(root.classList).find((c) => c.startsWith("font-"));
        if (fontFamilyClass) root.classList.remove(fontFamilyClass);

        root.classList.add(`font-${userPref.fontFamily.toLowerCase()}`);
    }
}

// initialize the app
let appPromise: Promise<APP> | null = null;

export async function initApp(): Promise<APP> {
    if (APP) {
        const appValue = get(APP);
        if (appValue) return Promise.resolve(appValue);
    }

    if (!appPromise) {
        appPromise = new Promise<APP>((resolve) => {
            ZOHODESK.extension.onload().then((app) => {
                setUserPref(app.meta.userPreferences);
                app.instance.on("user_preference.changed", setUserPref);
                APP.set(app);
                resolve(app);
            });
        });
    }

    return appPromise;
}

// validate the key for db storage
function validateKey(key: string) {
    return /^[a-zA-Z0-9_,:]{1,50}$/g.test(key);
}

// utility class for extension db operations
export class DB {
    static async set({ key, value, queriableValue = "" }: { key?: string; value: any; queriableValue?: string }) {
        if ((key && !validateKey(key)) || (queriableValue && !validateKey(queriableValue))) {
            throw new Error("Invalid key or queriableValue");
        }

        return await ZOHODESK.set("database", { key, value, queriableValue });
    }

    static async get({
        key,
        queriableValue,
        from,
        limit,
    }: {
        key?: string;
        queriableValue?: string;
        from?: number;
        limit?: number;
    }) {
        if ((key && !validateKey(key)) || (queriableValue && !validateKey(queriableValue))) {
            throw new Error("Invalid key or queriableValue");
        }

        const payload: any = { key, queriableValue, from, limit };
        if (!queriableValue) delete payload.queriableValue;
        if (!from) delete payload.from;
        if (!limit) delete payload.limit;
        if (!key) delete payload.key;

        if (Object.keys(payload).length === 0) {
            throw new Error("At least one of key or queriableValue is required");
        }

        return await ZOHODESK.get("database", payload);
    }

    static async delete({ key, queriableValue }: { key?: string; queriableValue?: string }) {
        if ((key && !validateKey(key)) || (queriableValue && !validateKey(queriableValue))) {
            throw new Error("Invalid key or queriableValue");
        }

        const payload: any = { key, queriableValue };
        if (!key) delete payload.key;
        if (!queriableValue) delete payload.queriableValue;

        if (Object.keys(payload).length === 0) {
            throw new Error("At least one of key or queriableValue is required");
        }

        return await ZOHODESK.delete("database", payload);
    }
}

async function listAllConversation(ticketId: string) {
    return await ZOHODESK.request({
        url: `https://desk.zoho.com/api/v1/tickets/${ticketId}/conversations?limit=200`,
        type: "GET",
        headers: {},
        connectionLinkName: "desk",
        responseType: "json",
        data: {},
    });
}

export async function getAllComments(ticketId: string) {
    const allComments: any[] = [];
    let from = 1;
    const limit = 100;

    while (true) {
        const res = await ZOHODESK.request({
            url: `https://desk.zoho.com/api/v1/tickets/${ticketId}/comments?include=plainText&limit=${limit}&from=${from}`,
            type: "GET",
            headers: {},
            connectionLinkName: "desk",
            responseType: "json",
            data: {},
        });

        const comments = res?.data?.statusMessage?.data ?? [];
        allComments.push(...comments);

        if (comments.length < limit) break;
        from += limit;
    }

    return allComments;
}

export const threadFeatched = writable({
    totalThread: 0,
    fetchedThread: 0,
    totalComment: 0,
    fetchedComment: 0,
});

export async function getAllThreadDetails(ticketId: string) {
    const res = await listAllConversation(ticketId);
    const convDetails = res?.data?.statusMessage?.data ?? [];

    const commentsData = convDetails.filter((conv: any) => conv.type === "comment");
    const threadDetails = convDetails.filter((conv: any) => conv.type === "thread");
    const threadIds = threadDetails.map((thread: any) => thread.id);

    threadFeatched.set({
        totalThread: threadIds.length,
        totalComment: commentsData.length,
        fetchedComment: commentsData.length,
        fetchedThread: 0,
    });

    const threadData = threadIds.map((threadId: string) =>
        ZOHODESK.request({
            url: `https://desk.zoho.com/api/v1/tickets/${ticketId}/threads/${threadId}?include=plainText`,
            type: "GET",
            headers: {},
            connectionLinkName: "desk",
            responseType: "json",
            data: {},
        }).finally(() => {
            threadFeatched.update((state) => ({
                ...state,
                fetchedThread: state.fetchedThread + 1,
            }));
        })
    );

    const allData = [...threadData, ...commentsData.map((comment: any) => Promise.resolve(comment))];

    return Promise.allSettled(allData);
}

export function cleanseConvData(convData: any) {
    return convData.map((conv: any) => {
        const data = conv.value?.data?.statusMessage;
        if (data) {
            return {
                content: data.plainText || data.content || "",
                createdTime: data.createdTime,
                author: `${data.author.firstName} ${data.author.lastName}`,
                fromAddress: data.fromEmailAddress,
                toAddress: data.to,
                replyTo: data.replyTo,
                isForwarded: data.isForward,
                type: data.direction === "out" ? "outbound email" : "inbound email",
            };
        } else {
            const commentData = conv.value;
            return {
                type: commentData.isPublic ? "public comment" : "private comment",
                commentedTime: commentData.commentedTime,
                content: commentData.plainText || commentData.content || "",
                commenter: `${commentData.commenter.firstName} ${commentData.commenter.lastName}`,
            };
        }
    });
}

export async function promptStreaming(systemPrompt: string, currentPrompt: string) {
    // @ts-ignore
    const availability = await self.LanguageModel.availability();
    if (availability === "unavailable") return;

    const initialPrompts = [{ role: "system", content: systemPrompt }];

    function monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
            console.log(`Downloading Language Model ${Math.round((e.loaded / e.total) * 100)}%`);
        });
    }

    const session =
        availability === "available"
            ? // @ts-ignore
              await self.LanguageModel.create({ initialPrompts })
            : // @ts-ignore
              await self.LanguageModel.create({ initialPrompts, monitor });

    let result = "";

    try {
        const stream = session.promptStreaming(currentPrompt);
        for await (const chunk of stream) {
            result += chunk;
        }
    } catch (error) {
        console.log(error);
    }

    return result;
}
