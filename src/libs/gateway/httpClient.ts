import apiClient from "./apiClientConfig"
const {
    VITE_AUTH_ACCESS_TOKEN:AUTH_ACCESS_TOKEN
} = import.meta.env

const get = async (url: string, headers: any) => {
	if (!url) return { message: "url missing!" }

	//additional header for get request and other in process
	if (!headers) headers = {}

	return await apiClient
		.get(url, {
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		})
		.then((res: any) => ({
			status: res.status,
			success: true,
			data: res.data,
			message: res.message,
			error: res?.errors,
		}))
		.catch((error: any) => ({
			status: error.status,
			success: false,
			data: [],
			message: error.message,
			error: error,
		}))
}

const patch = async (url: string, headers: any, body?: any) => {
	if (!url) return { message: "url missing!" }

	if (!body) body = {}

	//additional header for get request and other in process
	if (!headers) headers = {}

	return apiClient
		.patch(url, body, {
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		})
		.then((res: any) => ({
			status: res.status,
			success: true,
			data: res.data,
			message: res.message,
			error: res?.errors,
		}))
		.catch((error: any) => ({
			status: error.status,
			success: false,
			data: [],
			message: error.message,
			error: error,
		}))
}

const put = async (url: string, headers: any, body: any) => {
	if (!url) return { message: "url missing!" }

	if (!body) body = {}

	//additional header for get request and other in process
	if (!headers) headers = {}

	return apiClient
		.put(url, body, {
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		})
		.then((res: any) => ({ success: true, data: res.data }))
		.catch((error: any) => ({ success: false, error: error }))
}


const post = async (url: string, headers: any, body: any) => {
	if (!url) return { message: "url missing!" }

	if (!body) body = {}

	//additional header for get request and other in process
	if (!headers) headers = {}
	return await apiClient
		.post(url, body, {
			headers: {
				"Content-Type": "application/json",
				"x-access-token":AUTH_ACCESS_TOKEN,
				...headers,
			},
		})
		.then((res: any) => ({
			status: res.status,
			success: true,
			data: res.data,
			message: res.message,
			error: res?.errors,
		}))
		.catch((error: any) => ({
			status: error.status,
			success: false,
			data: [],
			message: error.message,
			error: error,
		}))
}
const deleteRequest = async (url: string, headers: any) => {
	if (!url) return { message: "url missing!" }

	// if (!body) body = {}

	//additional header for get request and other in process

	if (!headers) headers = {}
	return await apiClient
		.delete(url, {
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
		})
		.then((res: any) => ({
			status: res.status,
			success: true,
			data: res.data,
			message: res.message,
			error: res?.errors,
		}))
		.catch((error: any) => ({
			status: error.status,
			success: false,
			data: [],
			message: error.message,
			error: error,
		}))
}

export default { get, patch, post, put,deleteRequest }