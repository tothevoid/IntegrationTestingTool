export const addEndpoint = async (baseUrl, formData) =>
    await generateFormRequest(getUrl(baseUrl, "Add"), formData);

export const updateEndpoint = async (baseUrl, formData) =>
    await generateFormRequest(getUrl(baseUrl, "Update"), formData);

export const getEndpointById = async (baseUrl, id) =>
    await fetch(`${getUrl(baseUrl, "Get")}?id=${id}`);

export const deleteEndpoint = async (baseUrl, id) =>
    await fetch(`${getUrl(baseUrl, "Delete")}?id=${id}`);

export const getAllEndpoints = async (baseUrl, data) => {
    const encodedParameters =  Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
    return await fetch(`${getUrl(baseUrl, "GetAll")}?${encodedParameters}`);
}

export const fetchStatusCodes = async (baseUrl) =>
    await fetch(`${getUrl(baseUrl, "GetStatusCodes")}`);

const getUrl = (baseUrl, method) =>
    `${baseUrl}/endpoint/${method}`

const generateFormRequest = async (url, formData) =>
    await fetch(url, {
        method: 'POST',
        body: formData
    })
