import { httpClient, errorService } from "../libs";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

async function getDemoAccount(){
    try {
		const demoAccount: any = await httpClient.get(
			`${SERVER_BASE_URL}/accounts`,
			{}
		);
		const isDemoAccount = demoAccount?.data?.data?._id;
		if(isDemoAccount)
			return demoAccount?.data?.data;
		throw new Error("Demo account is not fetched");

	} catch (error) {
		errorService.reportError(error);
		return []
	}
}


export async function getAccount(query:string) {
	try {
		const accounts: any = await httpClient.get(
			`${SERVER_BASE_URL}/accounts?${query}`,
			{}
		);
		const accountsLength = accounts?.data?.data?.length;
		if(accountsLength)
			return accounts?.data?.data;
		throw new Error("Account doesn't exists!");
	} catch (error) {
		errorService.reportError(error);
		return []
	}
}

export {
    getDemoAccount
}