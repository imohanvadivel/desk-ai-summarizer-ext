# Desk Extension Template

This template helps you quickly start building Zoho Desk extensions using the [Deskblocks](https://deskblocks.mohanvadivel.com) library.

- **Deskblocks** is a Svelte library that provides ready-to-use components and styles for Zoho Desk extensions.
- **Recommended tools**: Use [VS Code](https://code.visualstudio.com/) with the [Svelte extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Getting Started

1. Clone the git repository and install the necessary packages:

    ```bash
    git clone https://github.com/imohanvadivel/desk-ext-template.git
    cd desk-ext-template
    npm i
    ```

    The template includes Deskblocks, TypeScript definitions, and other utilities, which are automatically installed.

2. **Enable developer mode in Zoho Desk** to test the extension directly in Desk.

3. Start the development server:

    ```bash
    # Runs the server on port 5000
    npm run dev

    # Bundles the files and creates a zip in the dist folder
    npm run build
    ```

    > Note: On first run, you may need to grant sudo permission to generate a TSL certificate since the development server uses `https` protocol.

4. After running the build command, the bundled zip file (`ext.zip`) will be located in the `dist` folder. You can upload it directly to [Sigma](https://sigma.zoho.com/).

## Miscellaneous

- The `plugin-manifest`, `resources.json`, and localization files are in the `public` directory. You may need to modify them based on your needs.
- Static files (e.g., images) go in the `assets` folder inside `public`. Use them in your code like this:

    ```html
    <img src="assets/img.png" />
    ```

- This template uses [Vite](https://vitejs.dev/) under the hood, so you can enjoy all of its benefits like hot module replacement, fast compilation, lazy loading and so on.

## Additional Resources
- [Extension Guide](https://www.zoho.com/desk/extensions/guide/introduction.html)
- [Developer Forum](https://help.zoho.com/portal/en/community/zoho-desk/zoho-desk-extension-developers)