import { httpClient, errorService } from "../libs";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

async function getVariantConfigurations(variantId:any) {
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/variants/${variantId}`,
			{}
		);
        const data = response?.data?.data
		if(data.length)
			return data[0]

        return {}

	} catch (error) {
		errorService.reportError(error);
		return {}
	}
}


async function postConfiguration(body:any) {
	try {
		const response: any = await httpClient.post(
			`${SERVER_BASE_URL}/variants`,{},
			body
		);
		return response.data.data
	} catch (error) {
		errorService.reportError(error);
	}
}

async function updateConfiguration(id:any,body:any) {
	try {
		const response: any = await httpClient.put(
			`${SERVER_BASE_URL}/variants/${id}`,{},
			body
		);
	} catch (error) {
		errorService.reportError(error);
	}
}

export default {
	getVariantConfigurations,
	postConfiguration,
	updateConfiguration
}