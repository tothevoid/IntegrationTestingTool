export const TRANSLATION_EN = {
    button: {
        add: "Add",
        update: "Update",
        back: "Back",
        save: "Save"
    },
    nav:{
        endpoints: "Endpoints",
        auths: "Auths",
        logs: "Logs"
    },
    headers: {
        configure: "Configure headers",
        list: "List",
        name: "Name",
        value: "Value"
    },
    endpoints: {
        search: "Search",
        active: "Only active",
        deleteWarningTitle: "Are you sure?",
        deleteWarningText: "Do you really want to delete that endpoint?",
        descriptionMain: "Returns status code: {{code}}. Data size: {{dataSize}}",
        descriptionAdditional: "Then calls [{{method}}] {{url}} ({{dataSize}})",
    },
    endpoint: {
        httpMethod: "HTTP method",
        statusCode: "Status code",
        interaction: "Interaction",
        interactionType: {
            sync: "Synchronous",
            async: "Asynchronous"
        },
        active: "Active",
        configureHeaders: "Configure headers ({{quantity}})",
        callback: "Callback",
        auth: "Auth",
        url: "URL",
        data: "Data",
        attachByFile: "Attach by file",
        validation: {
            endpointUrl: "Endpoint url has incorrect format",
            callbackUrl: "Callback url has incorrect format"
        },
        error: {
            save: "An error occurred while processing request"
        }
    },
    auths: {
        deleteWarningTitle: "Are you sure?",
        deleteWarningText: "Do you really want to delete that auth?",
        deletion:{
            success: "Auth successfully deleted",
            error: "An error occurred while deleting auth"
        }
    },
    auth: {
        default: "None",
        name: "Name",
        httpMethod: "HTTP method",
        url: "URL",
        data: "Data",
        requestHeaders: "Request headers ({{quantity}})",
        copiedHeaders: "Headers copied into next request:",
        addHeader: "Add header",
        action:{
            add: "Add auth",
            update: "Update auth"
        },
        validation: {
            url: "Auth url has incorrect format",
            name: "Name can't be empty",
            headers: "At least one parameter must me included to the next request"
        },
    },
    logs: {
        date: "Date",
        newRequests: "New requests: {{quantity}}",
        received: "Received",
        returned: "Returned",
        code: "Status code",
        new: "New",
        dataSize: "Data size",
        error: "An error during request process: {{message}}"
    }
}
