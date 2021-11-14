export const TRANSLATION_EN = {
    button: {
        add: "Add",
        update: "Update"
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
        action:{
            add: "Add endpoint",
            update: "Update endpoint"
        },
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
    }
}
