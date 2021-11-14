import {generatePostRequest} from "./base";

export const addAuths = async (baseUrl, auth) =>
    await generatePostRequest(getUrl(baseUrl, "Add"), auth);

export const updateAuths = async (baseUrl, auth) =>
    await generatePostRequest(getUrl(baseUrl, "Update"), auth);

export const getAuthById = async (baseUrl, id) =>
    await fetch(`${getUrl(baseUrl, "Get")}?id=${id}`);

export const deleteAuth = async (baseUrl, id) =>
    await fetch(`${getUrl(baseUrl, "Delete")}?id=${id}`);

export const getAllAuths = async (baseUrl) =>
    await fetch(getUrl(baseUrl, "GetAll"));

export const getAllAuthsAsLookup = async (baseUrl) =>
    await fetch(getUrl(baseUrl, "GetAllAsLookup"));

const getUrl = (baseUrl, method) =>
    `${baseUrl}/auth/${method}`

