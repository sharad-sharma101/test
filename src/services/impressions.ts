import { errorService, httpClient } from "../libs"
const {
    VITE_VELOCITY_BASE_URL:SERVER_BASE_URL
} = import.meta.env

const getCustomTemplateLoad = async (containerId:string, query:string) => {
	try {
			const loads: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/templates/impressions?${query}`,
				{}
			)
			return loads.data?.data  || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}


const getCustomTemplateClick = async (containerId:string, query:string) => {
	try {
			const clicks: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/templates/clicks?${query}`,
				{}
			)
			return clicks.data?.data  || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}
const createNewSegmentRule = async (containerId:string,body:any) => {
	try {
			const clicks: any = await httpClient.post(
				`${SERVER_BASE_URL}/api/segment-rules/${containerId}`,
				{},body
			)
			return clicks.data?.data  || []

	} catch (error) {
		errorService.reportError(error)
	}
}

export {getCustomTemplateLoad, getCustomTemplateClick,createNewSegmentRule};