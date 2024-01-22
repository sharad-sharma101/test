import { errorService, httpClient } from "../libs"
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env


async function createCampaign(body:any) {
	try {
		const response: any = await httpClient.post(
			`${SERVER_BASE_URL}/campaigns`,{},
			body
		);
		return response.data.data
	} catch (error) {
		errorService.reportError(error);
	}
}

const getCampaigns = async (query:string) => {
	try {
			const campaigns: any = await httpClient.get(
				`${SERVER_BASE_URL}/campaigns?${query}`,
				{}
			)
			
			let dataArr = [...campaigns.data?.data]
			campaigns.data?.data.map((ele:any , index:number) => {
				let segment = {}
				if (ele?.customSegmentIds[0]?._id) segment = ele?.customSegmentIds[0];
                else if (ele?.segmentIds[0]?._id) segment = ele?.segmentIds[0];
				dataArr[index].segmentIds = [segment]
			})
			
			campaigns.data.data = [...dataArr]
			return campaigns.data?.data || []
		
	} catch (error) {
		console.log(error)
		errorService.reportError(error)
		
	}
}


async function getCampaign(campaignId:any) {
	try {
		const campaign: any = await httpClient.get(
			`${SERVER_BASE_URL}/campaigns/${campaignId}`,
			{}
		);
		return campaign.data?.data || []

	} catch (error) {
		errorService.reportError(error);
		return {}
	}
}

interface CampaignResponseDataSuccess {
	success: boolean;
	data: any;
  }
  
  interface CampaignResponseDataError {
	success: boolean;
	error: any;
  }
  
  type CampaignResponseData =
	| CampaignResponseDataSuccess
	| CampaignResponseDataError
	| { message: string };


	type DeleteCampaignBodyType={
		isDeleted:boolean,
		status:string,

	}
  
  async function putCampaign(campaignId: string, fieldsToUpdate: Record<string, any>) {
	try {
	  const response: CampaignResponseData = await httpClient.put(
		`${SERVER_BASE_URL}/campaigns/${campaignId}`,
		{},
		fieldsToUpdate
	  );
  
	  if ('data' in response && response.success && response.data) {
		return response.data;
	  } else if ('error' in response) {
		console.error('Failed to update campaign status:', response.error);
		return null;
	  } else {
		console.error('Invalid response format:', response);
		return null;
	  }
	} catch (error) {
	  console.error('Failed to update campaign status:', error);
	  return null;
	}
  }

  async function deleteCampaign(campaignId:string){
	try {
		const response: CampaignResponseData = await httpClient.deleteRequest(
		  `${SERVER_BASE_URL}/campaigns/${campaignId}`,
		  {},
		);
	
		if ('data' in response && response.success && response.data) {
		  return response.data;
		} else if ('error' in response) {
		  console.error('Failed to update campaign status:', response.error);
		  return null;
		} else {
		  console.error('Invalid response format:', response);
		  return null;
		}
	  } catch (error) {
		console.error('Failed to update campaign status:', error);
		return null;
	  }
  }
  

export { createCampaign,deleteCampaign, getCampaigns, getCampaign, putCampaign }