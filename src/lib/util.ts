type UserPreference = {
    theme?: "blue" | "red" | "green" | "yellow" | "orange";
    appearance?: "light" | "dark" | "auto" | "pureDark";
    fontFamily?: "Puvi" | "Roboto" | "Lato";
};

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
export function initApp(): Promise<APP> {
    return new Promise((resolve) => {
        ZOHODESK.extension.onload().then((app) => {
            setUserPref(app.meta.userPreferences);
            app.instance.on("user_preference.changed", (pref: UserPreference) => setUserPref(pref));
            resolve(app);
        });
    });
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
