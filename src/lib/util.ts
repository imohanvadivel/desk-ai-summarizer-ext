export type UserPreference = {
    theme?: "blue" | "red" | "green" | "yellow" | "orange";
    appearance?: "light" | "dark" | "auto" | "pureDark";
    fontFamily?: "Puvi" | "Roboto" | "Lato";
};

export function setUserPref(userPref: UserPreference) {
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
