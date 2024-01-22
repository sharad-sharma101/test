import { httpClient, errorService } from "../libs";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

async function verifyPlatform(id:any) {
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/verifications/${id}`,
			{}
		);
        const data = response?.data?.data
        return data

	} catch (error) {
		errorService.reportError(error);
        return {}
	}
}
async function updateVerifyPlatform(id:any , fieldsToUpdate: any) {
	try {
		const response: any = await httpClient.patch(
			`${SERVER_BASE_URL}/verifications/${id}`,
			{},
			fieldsToUpdate
		);
        const data = response?.data?.data
        return data

	} catch (error) {
		errorService.reportError(error);
        return {}
	}
}

export default {
    verifyPlatform,updateVerifyPlatform
}