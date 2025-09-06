# Desk AI Summarizer Extension

This is a summarization extension for Zoho Desk that leverages your browser's local machine learning model. It currently works on Chrome version 138 or later.

This extension is built with the help of [Deskblocks library](https://deskblocks.mohanvadivel.com/).


Demo: https://youtu.be/qOdXtg4ITmI?si=Izq8nocbqVxxz93P


## Important Note:
Zoho Desk loads extensions inside an iframe, which by default does not grant access to local ML models. To enable the extension to function properly, you need to manually override the iframe permissions by adding the following attributes to the allow parameter:

```html
<iframe allow="language-model;">
    ...
</iframe>
```

or 

Open the developer tool and select the extension iframe, now paste the following command in the console and refresh the extension widget, you are good to go.

```js
$0.setAttribute("allow", "language-model;");
```
