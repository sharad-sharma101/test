import { Feature } from "../features/features-configurations/features-slice"
import { errorService, httpClient } from "../libs"
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

const getFeatures = async (accountId: string | null, containerId: string | null) => {
	try {
		if (accountId && containerId) {
			const features: any = await httpClient.get(
				`${SERVER_BASE_URL}/features?accountId=${accountId}&containerId=${containerId}`,
				{}
			)
			return features.data?.data || []
		}
	} catch (error) {
		errorService.reportError(error)
	}
}

const toggleFeature = async (
	featureId: string,
	status: boolean,
	accountId: string,
	containerId: string
) => {
	try {
		await httpClient.patch(
			`${SERVER_BASE_URL}/features/${featureId}`,
			{},{isEnabled:status}
		)
	} catch (error) {
		errorService.reportError(error)
	}
}

const resetFeature = async (feature:Feature) => {
	try {
		const featureName = feature.name
		const referencesResp:any = await httpClient.get(`${SERVER_BASE_URL}/references/features?name=${feature.name}`,{})
		const newFeature = referencesResp.data.data[0]
		await httpClient.put(`${SERVER_BASE_URL}/features/${feature._id}`,{},newFeature)

	} catch (error) {
		errorService.reportError(error)
	}
}

const getFeaturesMaster = async () => {
	try {

			const features: any = await httpClient.get(
				`${SERVER_BASE_URL}/references/features?isActive=true`,
				{}
			)
			return features.data?.data || []

	} catch (error) {
		errorService.reportError(error)
	}
}

const getUseCases = async (query:string) => {
	try {
			const features: any = await httpClient.get(
				`${SERVER_BASE_URL}/features?${query}`,
				{}
			)
			return features.data?.data || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}

const getUseCase = async (usecaseId: string) => {
	try {
	  if (usecaseId) {
		const response = await httpClient.get(
		  `${SERVER_BASE_URL}/features/${usecaseId}`,
		  {}
		);
		return response || []
	  }
	} catch (error) {
	  errorService.reportError(error);
	}
  };
  
  interface UseCaseResponseDataSuccess {
    success: boolean;
    data: any;
  }
  
  interface UseCaseResponseDataError {
    success: boolean;
    error: any;
  }
  
  type UseCaseResponseData =
    | UseCaseResponseDataSuccess
    | UseCaseResponseDataError
    | { message: string };
  
  async function putUseCases(usecaseId: string, status: boolean) {
    try {
      const response: UseCaseResponseData = await httpClient.put(
        `${SERVER_BASE_URL}/features/${usecaseId}`,
        {},
        { status: status }
      );
  
      if ('data' in response && response.success && response.data) {
        return response.data;
      } else if ('error' in response) {
        console.error('Failed to update usecase status:', response.error);
        return null;
      } else {
        console.error('Invalid response format:', response);
        return null;
      }
    } catch (error) {
      console.error('Failed to update usecase status:', error);
      return null;
    }
  }

  
  

const featureServices = { getFeatures, toggleFeature, resetFeature, getFeaturesMaster, getUseCases, getUseCase, putUseCases }
export default featureServices