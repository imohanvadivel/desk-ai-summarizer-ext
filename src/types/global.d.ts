type locale =
    | "en"
    | "ja"
    | "zh"
    | "tw"
    | "es"
    | "de"
    | "fr"
    | "tr"
    | "ru"
    | "pt"
    | "it"
    | "nl"
    | "da"
    | "pl"
    | "sv"
    | "id"
    | "hi"
    | "ro"
    | "ta"
    | "te"
    | "he"
    | "ar";

type WidgetLocation =
    | "desk.ticket.detail.rightpanel"
    | "desk.ticket.detail.subtab"
    | "desk.ticket.detail.lefttab"
    | "desk.ticket.detail.moreaction"
    | "desk.ticket.thread.moreaction"
    | "desk.ticket.form.rightpanel"
    | "desk.contact.detail.rightpanel"
    | "desk.contact.detail.subtab"
    | "desk.contact.detail.lefttab"
    | "desk.contact.form.rightpanel"
    | "desk.account.detail.rightpanel"
    | "desk.account.detail.subtab"
    | "desk.account.detail.lefttab"
    | "desk.account.form.rightpanel"
    | "desk.ticket.blueprint.transition"
    | "desk.topband"
    | "desk.bottomband"
    | "desk.extension.telephony"
    | "desk.background"
    | "desk.extension.preference";

declare global {
    var ZOHODESK: ZOHODESK;

    interface Window {
        ZOHODESK: ZOHODESK;
    }

    interface ZOHODESK {
        extension: { onload(): Promise<APP> };
        /**
         * Sends an HTTP request to the specified third-party API.
         * @param options The options to configure the request, including URL, method, headers, etc.
         * @returns A Promise resolving with the response from the request.
         *
         * Example usage:
         * ```js
         * var requestObj = {
         *     url: "https://api.example.com/data",
         *     type: 'GET',
         *     headers: { 'Content-Type': 'application/json' },
         *     data: { latitude: "28.65", longitude: "77.23" }
         * };
         * ZOHODESK.request(requestObj).then(response => {
         *     console.log(response);
         * }).catch(error => {
         *     console.error(error);
         * });
         * ```
         */
        request(options: RequestOptions): Promise<any>;

        /**
         * Retrieves data based on the requested property. The method supports multiple
         * types of data retrieval including user, portal, department, tickets, contacts, forms, and database entries.
         *
         * @param {string} property - The property to retrieve. Can be any string like 'ticket', 'contact',
         *                            'ticket.email', 'contact.lastName', etc.
         * @param {any} [options] - Additional options for querying the data, such as filtering or pagination.
         * @returns {Promise<GenericResponse | DatabaseResponse>}
         *          A promise that resolves with the appropriate response object based on the property requested.
         *
         * @example
         * // Retrieve ticket information
         * ZOHODESK.get('ticket').then(response => {
         *     console.log(response.ticket);
         * }).catch(err => {
         *     console.error(err);
         * });
         *
         * @example
         * // Retrieve a specific property from a ticket
         * ZOHODESK.get('ticket.email').then(response => {
         *     console.log(response['ticket.email']);
         * }).catch(err => {
         *     console.error(err);
         * });
         *
         * @example
         * // Retrieve data from the extension's connected database
         * ZOHODESK.get('database', { queriableValue: 'Production_Department' })
         *   .then(response => {
         *       console.log(response.database.get.data);
         *   })
         *   .catch(err => {
         *       console.error(err);
         *   });
         */
        get(property: string, options?: any): Promise<GenericResponse | DatabaseResponse>;

        /**
         * Sets or updates data for a given property in Zoho Desk. This method allows setting values for various properties such as
         * tickets, contacts, forms, and database entries.
         *
         * @param {string} property - The property to set. This can be fields like 'ticket.phone', 'ticketForm.phone', 'contactForm.phone', 'database', etc.
         * @param {any} value - The value or set of values to populate the specified field or property.
         * @returns {Promise<GenericResponse>} - A promise that resolves with the appropriate response object.
         *
         * @example
         * // Set value for the phone field in ticket
         * ZOHODESK.set('ticket.phone', { phone: '123456789' }).then(response => {
         *     console.log(response);
         * }).catch(err => {
         *     console.error(err);
         * });
         *
         * @example
         * // Set single data in the database
         * ZOHODESK.set('database', { key: '001', value: { name: 'zylker' }, queriableValue: 'Production_Department' }).then(response => {
         *     console.log(response);
         * }).catch(err => {
         *     console.error(err);
         * });
         *
         * @example
         * // Set bulk data in the database
         * ZOHODESK.set('database', [
         *   { queriableValue: 'bugid:94208395746', value: { name: 'portal' }, key: 'id:674883524897539' },
         *   { queriableValue: 'bugid:94208395746', value: { name: 'support' }, key: 'id:674883524897537' },
         *   { queriableValue: 'bugid:94208395746', value: { name: 'helpdesk' }, key: 'id:674883524897540' }
         * ]).then(response => {
         *     console.log(response);
         * }).catch(err => {
         *     console.error(err);
         * });
         */
        set(property: string, value: any): Promise<GenericResponse>;

        /**
         * Deletes data from the connected database or other resources based on the specified property.
         *
         * @param {string} property - The property or resource to delete. Example: 'database'.
         * @param {any} value - The value specifying what to delete (e.g., by `queriableValue`).
         * @returns {Promise<GenericResponse>} - A promise that resolves with the appropriate response object.
         *
         * @example
         * // Delete data from the connected database
         * ZOHODESK.delete('database', { queriableValue: 'test' }).then(response => {
         *     console.log(response);
         * }).catch(err => {
         *     console.error(err);
         * });
         */
        delete(property: string, value: any): Promise<GenericResponse>;

        /**
         * Invokes a specific UI action within Zoho Desk, such as routing, showing, hiding, resizing a widget or closing a modal.
         * Depending on the action, it may accept additional parameters.
         *
         * @param {string} action - The UI action to invoke. Supported actions:
         *  - `"ROUTE_TO"`: Navigates to a particular form, subtab, or widget.
         *  - `"SHOW"`: Opens the widget programmatically.
         *  - `"HIDE"`: Closes the widget programmatically.
         *  - `"MINIMIZE"`: Minimizes the widget (only works in specific locations).
         *  - `"MAXIMIZE"`: Maximizes the widget (only works in specific locations).
         *  - `"RESIZE"`: Resizes the widget dimensions (works for specific widget types).
         *  - `"MODAL_CLOSE"`: Closes a modal widget programmatically.
         *
         * @param {Object | string} [options] - Optional parameters based on the action.
         *  - **ROUTE_TO**: Supports either a string (e.g., `"ticket.addForm"`) or an object with the following structure:
         *    - `{ entity: string, page?: string, id?: string, target?: string }`
         *      - `entity`: The entity type like "ticket", "contact", "account", etc.
         *      - `page`: The page type, such as "add", "edit", or "dv" (detail view).
         *      - `id`: The record ID for navigation (optional for add actions).
         *      - `target`: Specifies if the route opens in the same tab or a new tab (e.g., "_blank").
         *  - **RESIZE**: Can be used without parameters for default resizing or with an object:
         *    - `{ width?: string, height?: string }` (width and height can be in px, %, vh, vw)
         *
         * @returns {Promise<any>} A promise that resolves with the response or error information.
         *
         * @example
         * // Route to ticket add form
         * ZOHODESK.invoke("ROUTE_TO", "ticket.addForm");
         *
         * @example
         * // Route to edit ticket page with a record ID
         * ZOHODESK.invoke("ROUTE_TO", { entity: "ticket", id: "31138000012704001", page: "edit" });
         *
         * @example
         * // Resize the widget
         * ZOHODESK.invoke("RESIZE", { width: "40%", height: "50%" });
         *
         * @example
         * // Show the widget
         * ZOHODESK.invoke("SHOW");
         *
         * @example
         * // Close the modal
         * ZOHODESK.invoke("MODAL_CLOSE");
         */
        invoke(action: InvokeAction, options?: RouteToOptions | ResizeOptions | string): Promise<any>;

        log(value: any): Promise<any>;

        /**
         * Displays a custom notification within the Zoho Desk environment.
         *
         * This method allows you to trigger a notification with customizable content,
         * such as a title, message, and icon type, to inform users of important updates
         * or alerts within the Desk UI. It returns a Promise that resolves when the notification
         * has been successfully displayed.
         *
         * @param {NotifyOptions} options - An object containing the configuration for the notification.
         * @param {string} [options.title] - The title of the notification. Defaults to the widget name if not provided.
         *                                    Maximum length: 255 characters.
         * @param {string} options.content - The content or message displayed inside the notification.
         * @param {boolean} [options.autoClose] - (Deprecated) Whether the notification should auto-close. To configure this,
         *                                        follow the accessibility preferences in Desk.
         * @param {'success' | 'failure'} [options.icon] - The icon type displayed with the notification. Default is "failure".
         *
         * @returns {Promise<any>} A Promise that resolves when the notification has been displayed,
         *                         or rejects if an error occurs.
         *
         * @example
         * ZOHODESK.notify({
         *   title: "Important Update",
         *   content: "This is a notification message",
         *   icon: "success"
         * }).then(() => {
         *   console.log("Notification displayed successfully");
         * }).catch((err) => {
         *   console.error("Error displaying notification", err);
         * });
         */
        notify(options: NotifyOptions): Promise<any>;

        /**
         * Displays a custom pop-up window within the Zoho Desk environment.
         *
         * This method allows you to create and show a pop-up window with configurable content,
         * title, and other properties. The pop-up can be used for alerts, confirmations,
         * or displaying information within the Desk UI. It returns a Promise that resolves when the pop-up
         * is displayed or rejects if an error occurs.
         *
         * @param {PopupOptions} options - An object containing the configuration for the pop-up window.
         * @param {string} options.title - The title displayed at the top of the pop-up window.
         * @param {string} options.content - The main text or content displayed inside the pop-up window.
         * @param {'alert' | 'confirmation'} options.type - The type of pop-up window. Can be "alert" or "confirmation".
         * @param {string} [options.contentType] - Specifies the type of content (e.g., 'text' or 'html') inside the pop-up.
         * @param {'red' | 'blue'} [options.color] - The color theme of the pop-up. The default value is "red".
         *
         * @returns {Promise<any>} A Promise that resolves when the pop-up has been displayed,
         *                         or rejects if an error occurs.
         *
         * @example
         * ZOHODESK.showpopup({
         *   title: "Confirmation Required",
         *   content: "Are you sure you want to proceed?",
         *   type: "confirmation",
         *   color: "blue"
         * }).then(() => {
         *   console.log("Pop-up displayed successfully");
         * }).catch((err) => {
         *   console.error("Error displaying pop-up", err);
         * });
         */
        showpopup(options: PopupOptions): Promise<any>;
    }

    interface APP {
        /** An object which contains an instance of a widget including a set of methods to facilitate inter-widget communication. */
        instance: {
            /**
             * Fetches the details of the current widget instance using the unique ID.
             * @param widgetId The unique ID of the widget to fetch the instance for.
             * @returns The APP instance of the widget.
             */
            getWidgetInstance(widgetId: string): APP;

            /**
             * Gets all the widgets of the current extension.
             * @returns A Promise that resolves with an array of all the widgets.
             */
            getWidgets(): Promise<any[]>;

            /**
             * Emits an event when any UI action is triggered in the widget.
             * @param eventName The name of the event to emit.
             * @param data The data to pass with the event.
             */
            emit(eventName: string, data: any): void;

            /**
             * Listens for an event from another widget.
             * @param eventName The name of the event to listen to.
             * @param callback The function to call when the event occurs.
             */
            on(eventName: string, callback: Function): void;

            /**
             * Opens a modal box with the specified options.
             * @param options An object containing the URL and title for the modal.
             * @returns A promise that resolves with information about the modal, including the widget ID.
             *
             * Example usage:
             * App.instance.modal({
             *   url: '/app/modal.html',
             *   title: "Modal box"
             * }).then(function(modalInfo) {
             *   var modalInstance = App.instance.getWidgetInstance(modalInfo.widgetID);
             *   modalInstance.on('modal.opened', function(data) {
             *     console.log('Modal opened');
             *   });
             * }).catch(function(err) {
             *   console.log(err, "Modal error");
             * });
             */
            modal(options: ModalOptions): Promise<ModalResponse>;
        };

        /**
         * The unique ID of the widget.
         * Example: "a9944763-55a5-49ca-96cb-30ade1422523"
         */
        uniqueID: string;

        /**
         * Shows the location of the current widget.
         * Example: "desk.ticket.detail.subtab"
         */
        location: WidgetLocation;

        /**
         * The unique ID of the extension.
         * Example: "271104000010291161"
         */
        extensionID: string;

        /** Provides the locale code with respect to the chosen language by the user. */
        locale: locale;

        /** Provides the JSON resource based on the language selection from the extension translation files. */
        localeResources: { [key: string]: string };

        /**
         * Provides some extra information to be used in the extension, such as type of DC, platform, userPreferences, etc.
         */
        meta: {
            /**
             * Provides the type of current user data controller.
             * Possible values: "US", "AU", "CN", "JP", "EU", and "IN".
             */
            dcType: "US" | "AU" | "CN" | "JP" | "EU" | "IN";

            /**
             * Provides details of the device, like browser, OS installed, and resolution size.
             * Example:
             * {
             *   os: { name: "Mac OS", version: "10.15.7" },
             *   browser: { name: "Chrome", version: "102.0.5005.61", major: "102" },
             *   resolution: "1512X982"
             * }
             */
            platform: {
                os: {
                    name: string;
                    version: string;
                };
                browser: {
                    name: string;
                    version: string;
                    major: string;
                };
                resolution: string;
            };

            /** The default service will be "zohodesk". */
            service: "zohodesk";

            /**
             * Used to invoke a call to the sigma function from a widget using the request helper.
             */
            sigmaExecutionDomain: string;

            /**
             * Provides user preferences such as appearance, theme, and font family used by the user.
             */
            userPreferences: {
                appearance: "light" | "dark" | "pureDark" | "auto";
                theme: "red" | "green" | "blue" | "yellow" | "orange";
                fontFamily: "Puvi" | "Lato" | "Roboto";
                [key: string]: any; // To accommodate additional preferences
            };

            /**
             * The current desk URL of the user's organization.
             * Example:
             * US: "https://desk.zoho.com"
             * IN: "https://desk.zoho.in"
             */
            deskDomainUrls: {
                US: string;
                IN: string;
                [key: string]: string; // For other regions if applicable
            };

            /**
             * ID of the thread.
             * Note: Currently, you can fetch the threadId from the "desk.ticket.thread.moreaction" location only.
             */
            threadId: string;

            [key: string]: any; // To accommodate additional metadata
        };

        /**
         * Fetches the details of the current widget instance using the unique ID.
         * @param widgetId The unique ID of the widget to fetch the instance for.
         * @returns The APP instance of the widget.
         */
        getWidgetInstance(widgetId: string): APP;

        /**
         * Gets all the widgets of the current extension.
         * @returns A Promise that resolves with an array of all the widgets.
         */
        getWidgets(): Promise<any>;

        /**
         * Emits an event when any UI action is triggered in the widget.
         * @param eventName The name of the event to emit.
         * @param data The data to pass with the event.
         */
        emit(eventName: string, data: any): void;

        /**
         * Listens for an event from another widget.
         * @param eventName The name of the event to listen to.
         * @param callback The function to call when the event occurs.
         */
        on(eventName: string, callback: Function): void;

        /**
         * Used to convey the basic usage of a key/UI element in the form of a modal.
         * @param options The options to configure the modal.
         * @returns A Promise that resolves when the modal action is completed.
         */
        modal(options: any): Promise<any>;
    }

    interface ModalOptions {
        /**
         * The URL to load within the modal box.
         * Example: '/app/modal.html'.
         */
        url: string;

        /**
         * The title of the modal box.
         */
        title: string;
    }

    interface ModalResponse {
        /**
         * The unique widget ID of the modal instance.
         */
        widgetID: string;
    }

    interface RequestOptions {
        /**
         * The URL of the third-party API.
         * The domain of the requestURL must be mentioned under the whiteListedDomain key in the plugin-manifest.
         * Example: "https://www.example.com"
         */
        url: string;

        /**
         * The HTTP method type. Supported methods are: "GET", "POST", "DELETE", "PUT", "PATCH".
         * If the request involves a PATCH method, the value of `type` must be POST and the value of headers must include
         * `{ "header-override": "PATCH" }`.
         */
        type: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

        /**
         * HTTP headers to be passed with the request.
         * Example: { 'Content-Type': 'application/json' }
         */
        headers: Record<string, string>;

        /**
         * Represents the entity body.
         * This parameter, which must be passed as an object, is required for PATCH, POST, and PUT requests.
         * For GET requests, this can be set to an empty object.
         */
        postBody?: Record<string, any>;

        /**
         * The data to be appended as query parameters to the URL.
         * Example: { latitude: "28.65", longitude: "77.23", hourly: "precipitation,rain", timezone: "auto" }
         */
        data?: Record<string, any>;

        /**
         * The key for authenticating the third-party domain.
         * This must be the same as the one passed in the connectionLinkName value in the plugin manifest.
         */
        connectionLinkName?: string;

        /**
         * Specifies the type of data the response must contain.
         * Allowed values: "arraybuffer", "blob", "document", "json", "text", "ms-stream", "empty string".
         * If `responseType` is mentioned in the payload, `postBody` and `fileObj` will not be considered.
         */
        responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "ms-stream" | "";

        /**
         * An array that helps upload file objects to the third-party domain.
         * The array should contain objects with file details and their associated keys.
         * Example:
         * fileObj: [
         *  { file: File, key: 'fileKey1' },
         *  { file: File, key: 'fileKey2' }
         * ]
         */
        fileObj?: Array<{
            file: File;
            key: string;
        }>;
    }

    interface NotifyOptions {
        /**
         * Key that describes the title of the notification.
         * By default, the name format is <widget name> widget. Supports up to 255 characters.
         */
        title?: string;

        /**
         * Key that describes the text content inside the notification.
         * This is a required field.
         */
        content: string;

        /**
         * This key is deprecated.
         * To set this auto-close functionality in desk, follow the path:
         * Desk > My Information icon > Preferences > Accessibility Controls > Learning > Toast Notification > Configure.
         */
        autoClose?: boolean;

        /**
         * Key that defines the type of notification.
         * By default, the value is "failure". Possible values are "success" or "failure".
         */
        icon?: "success" | "failure";
    }

    interface PopupOptions {
        /**
         * Represents the title of the pop-up window.
         */
        title: string;

        /**
         * Describes the text/content inside the pop-up window.
         */
        content: string;

        /**
         * Determines the type of the pop-up window.
         * Possible values: "alert" or "confirmation".
         */
        type: "alert" | "confirmation";

        /**
         * Represents the content type inside the pop-up.
         * Example: 'text' or 'html'.
         */
        contentType?: string;

        /**
         * Represents the color of the pop-up window.
         * Possible values: "red" or "blue".
         * Default is "red".
         */
        color?: "red" | "blue";
    }

    interface InvokeOptions {
        height?: number;
        width?: number;
        [key: string]: any;
    }

    // Generalized Response Type for all responses
    interface GenericResponse {
        [key: string]: any;
        status: "success" | "failure";
    }

    // General Database Response Structure
    interface DatabaseResponse extends GenericResponse {
        database: {
            get: {
                data: Array<{
                    queriableValue: string;
                    value: Record<string, any>;
                    key: string;
                }>;
            };
        };
    }

    interface RouteToOptions {
        entity: "ticket" | "contact" | "account" | "extension";
        page?: "add" | "edit" | "dv";
        id?: string;
        target?: "_blank";
        location?: WidgetLocation;
        name?: string;
    }

    interface ResizeOptions {
        width?: string; // e.g., "40%", "400px", "50vw"
        height?: string; // e.g., "50%", "300px", "40vh"
    }

    type InvokeAction = "ROUTE_TO" | "SHOW" | "HIDE" | "MINIMIZE" | "MAXIMIZE" | "RESIZE" | "MODAL_CLOSE";
}

export {};
