import { httpClient, errorService } from "../libs";

// importing the auth context
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";

const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

export async function getContainers(query:string):Promise<[] | Container[]> {
	try {

		const containers: any = await httpClient.get(
			// using the authUserId in API request
			`${SERVER_BASE_URL}/containers?${query}`,
			{}
		);
		const containersLength = containers?.data?.data?.length;
		if(containersLength)
			return containers?.data?.data;
		throw new Error("Container does not exist with the given userId");

	} catch (error) {
		errorService.reportError(error);
		return []
	}
}

// #TODO don't bind this method to just enabled/disabled state of contianer, we should be able to patch containers feilds with the help of this method
export async function patchContainerEnabledState(containerId:string, isEnabled:boolean , domainName:string , settings:any){
	try {
		await httpClient.patch(
			`${SERVER_BASE_URL}/containers/${containerId}`,
			{},{isEnabled }
		);
	} catch (error) {
		errorService.reportError(error);
		return {}
	}
}
// #TODO don't bind this method to just enabled/disabled state of contianer, we should be able to patch containers feilds with the help of this method
export async function patchContainerSelectedState(containerId:string,body:any){
	try {
	let data=await httpClient.patch(
			`${SERVER_BASE_URL}/containers/${containerId}`,
			{},body
		);
		return data
	} catch (error) {
		errorService.reportError(error);
		return {}
	}
}

export async function verifyAppInstalled(query:string){
	try {
	let data=await httpClient.get(
			`${SERVER_BASE_URL}/verifications?${query}`,
			{},
		);
		return data
	} catch (error) {
		errorService.reportError(error);
		return {}
	}
}

export async function postContainer(body: object) {
	try {
		await httpClient.post(
			`${SERVER_BASE_URL}/containers` ,
			{},
			body
		)
	} catch (error) {
		errorService.reportError(error);
		return []
	}
}

export async function getContainer(query:any):Promise<[] | Container[]> {
	try {
		const containers: any = await httpClient.get(
			`${SERVER_BASE_URL}/containers?${query}`,
			{}
		);
		const containersLength = containers?.data?.data?.length;
		if(containersLength)
			return containers?.data?.data;
		throw new Error("Container does not exist with the given userId");
	} catch (error) {
		errorService.reportError(error);
		return []
	}
}

export async function getEnableStatus(query:any):Promise<EnableStatusResponse> {
	try {
		const enableStatus: any = await httpClient.get(
			`${SERVER_BASE_URL}/containers/enable-status?${query}`,
			{}
		);
		if(enableStatus)
		  return enableStatus;
		throw new Error("somthing wrong with your query");
	} catch (error) {
		errorService.reportError(error);
		return {
			status: 0,
			success: false,
			data: {
			  success: false,
			  message: "Error retrieving enable status",
			  status: false,
			},
		  };
	}
}