import { Auth } from "aws-amplify";
import { errorService } from "../libs";
import Errors from "../data/errors.json"
import { PRODUCT_NAME } from "../utils/constants";
const { VITE_AUTH_URL: AUTH_URL } = import.meta.env;

export async function getAccessToken() {
	try {
		const currentSession = await Auth.currentSession();
		return currentSession?.getAccessToken()?.getJwtToken();
	} catch (error) {
		const errorMessage = errorService.reportError(error);
		if (errorMessage !== `"${Errors?.noUserFound}"`) {
			window.location.href = `${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`;
		}
	}
}

export async function getCurrentUser() {
	try {
		const currentUser = await Auth.currentUserInfo();
		return currentUser;
	} catch (error) {
		return {}
	}
}

export async function redirectToAuth(returnUrl: string) {
	const encodedUrl = encodeURIComponent(returnUrl);
	window.location.href = `${AUTH_URL}?returnUrl=${encodedUrl}`
}