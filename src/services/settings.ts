import { FeatureSetting } from "../features/customer-configs/feature-settings-slice";
import { errorService, httpClient } from "../libs";
import { Feature } from "../features/features-configurations/features-slice";
import { PLATFORMS } from "../utils/constants";
import { extractCompanyNameFromDomain } from "../utils/helpers";
import { getAccount } from "./accounts";
import { getContainer, getContainers } from "./containers";

const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

const getClientConfigs = async (url: string, email: string, user: any, scriptInjected?: boolean) => {
	try {

		if (user) {
			const userId = user.idToken.payload["cognito:username"]

			const initialAccount = await getAccount(`userId=${userId}`)
			let accountId = ""
			if(initialAccount.length > 0){
				accountId = initialAccount[0]._id		
			} else {
				const account: any = await httpClient.post(
					`${SERVER_BASE_URL}/accounts`,
					{},
					{
						// extract compnay name from domains
						companyName: extractCompanyNameFromDomain(url),
						email,
						userId,
					}
				);
			    accountId = account.data.data._id;	
			}

            const initialContainer = await getContainers(`accountId=${accountId}&userId=${userId}`);
			let containerId = ""
			if(initialContainer.length > 0){
				containerId = initialContainer[0]._id
			} else {
				const container: any = await httpClient.post(
					`${SERVER_BASE_URL}/containers`,
					{},
					{
						domainName: url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url,
						email,
						accountId,
						userId,
						settings: [{
							"platform" : PLATFORMS.shopify,
							"scriptEnable" : false,
							"scriptInjected" : scriptInjected
						}],
						isEnabled:true
					}
				);

		         containerId = container?.data?.data?._id || "";
			}
			
			return {
				accountId,
				containerId
			};
		}

		const account: any = await httpClient.get(
			`${SERVER_BASE_URL}/demo/accounts`,
			{}
		);
		const accountId = account.data.data._id;
		const container: any = await httpClient.post(
			`${SERVER_BASE_URL}/demo/containers`,
			{},
			{
				domainName: url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url,
				email,
				accountId,
				containerName: "",
			}
		);

		const containerId = container.data.data._id;

		return {
			containerId,
			accountId,
		};
	} catch (error) {
		errorService.reportError(error);
	}
	return {
		containerId: "",
		accountId: "",
	};
};

const updateFeatureCssSettings = async (featureSettings: FeatureSetting) => {
	try {
		await httpClient.patch(
			`${SERVER_BASE_URL}/features/${featureSettings._id}`,
			{},
			featureSettings
		);
	} catch (error) {
		errorService.reportError(error);
	}
};

export async function updateFeatureMeta(
	featureId: string,
	data: {
		[key: string]: string;
	}
) {
	try {
		await httpClient.patch(`${SERVER_BASE_URL}/features/${featureId}`, {}, { meta: data });
	} catch (error) {
		return error;
	}
}

export async function getShopifyCredentials(accountId: string | null) {
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/containers/${accountId}/settings`,
			{}
		);
		return response.data.data[0];
	} catch (error) {
		errorService.reportError(error);
	}
}

export { getClientConfigs, updateFeatureCssSettings };
