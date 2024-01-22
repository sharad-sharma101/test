import { httpClient, errorService } from "../libs";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

async function getConfigurations() {
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/references/configurations`,
			{}
		);
        const data = response?.data?.data?.data
		if(data.length)
			return data

        return []

	} catch (error) {
		errorService.reportError(error);
		return []
	}
}


export default {
    getConfigurations
}