import { httpClient } from "../../libs";
import { referencesApi, templatesApi } from "./apiConfig";

// GET : template based on id
async function getTemplate(id: string) {
	try {
		const response:any = await httpClient.get(`${templatesApi}/${id}`,{});
		return response?.data?.data[0] || {};
	} catch (error) {
		console.log(error);
	}
}

// GET : all the templates for the use case
async function getMasterTemplates(query:string) {
	try {
		const response:any = await httpClient.get(`${referencesApi}?${query}`,{});
		return response?.data?.data;
	} catch (error) {
		console.log(error);
	}
}

async function getTemplates( accountId:any, containerId:any,query:string) {
	try {
		const response:any = await httpClient.get(`${templatesApi}?accountId=${accountId}&containerId=${containerId}&${query}`,{});
		return response?.data?.data;
	} catch (error) {
		console.log(error);
	}
}

// PATCH : update a template 
async function updateTemplate(id: string, data: any) {
	try {
		await httpClient.put(`${templatesApi}/${id}`, {}, data);
		// TODO : handle errors if saving is failed in the database
	} catch (error) {
		// TODO : log error through some library or retry 
		console.log(error);
	}
}

// POST : create a template 
async function createTemplate(data:any) {
	try {
		const response:any = await httpClient.post(`${templatesApi}`, {}, data);
		return response.data?.data
		// TODO : handle errors if saving is failed in the database
	} catch (error) {
		console.log(error);
	}
}

export { getTemplate, updateTemplate, createTemplate, getMasterTemplates, getTemplates };
