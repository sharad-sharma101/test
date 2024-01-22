import { errorService, httpClient } from "../libs"
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL ,
	VITE_VELOCITY_BASE_URL: VELOCITY_BASE_URL
} = import.meta.env

const getMasterSegments = async () => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/references/segments`,
				{}
			)

			return response.data?.data || []
	} catch (error) {
		errorService.reportError(error)
	}
}

const getSegments = async (query:string) => {
	try {
			const segments: any = await httpClient.get(
				`${SERVER_BASE_URL}/segments?${query}`,
				{}
			)
			return segments.data?.data || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}

async function createSegment(body:any) {
	try {
		const response: any = await httpClient.post(
			`${SERVER_BASE_URL}/segments`,{},
			body
		);
		return response.data.data
	} catch (error) {
		errorService.reportError(error);
	}
}

const getSegment = async (segmentId: string) => {
	try {
	  if (segmentId) {
		const response = await httpClient.get(
		  `${SERVER_BASE_URL}/segments/all/${segmentId}`,
		  {}
		);
		return response || []
	  }
	} catch (error) {
	  errorService.reportError(error);
	}
  };

  interface SegmentResponseDataSuccess {
    success: boolean;
    data: any;
  }
  
  interface SegmentResponseDataError {
    success: boolean;
    error: any;
  }
  
  type SegmentResponseData =
    | SegmentResponseDataSuccess
    | SegmentResponseDataError
    | { message: string };
  
  async function putSegments(segmentId: string, body: any) {
    try {
      const response: SegmentResponseData = await httpClient.put(
        `${SERVER_BASE_URL}/segments/${segmentId}`,
        {},
        body
      ); 
	  return response;
    } catch (error) {
      console.error('Failed to update segment status:', error);
      return null;
    }
  }

  const getSegmentMeta = async (containerId: string) => {
	try {
	  if (containerId) {
		const response: any = await httpClient.get(
		  `${VELOCITY_BASE_URL}/api/containers/${containerId}/segments/summary`,
		  {}
		);
		return response?.data || []
	  }
	} catch (error) {
	  errorService.reportError(error);
	}
  };
  const getSegmentTraffic: any = async (containerId: string) => {
	try {
	  if (containerId) {
		const response: any = await httpClient.get(
		  `${VELOCITY_BASE_URL}/api/containers/${containerId}/segments/traffic`,
		  {}
		);
		return response.data || []
	  }
	} catch (error) {
	  errorService.reportError(error);
	}
  };


//   async function deleteSegment(segmentId: string){
// 	try {
// 		const response: SegmentResponseData = await httpClient.deleteRequest(
// 		  `${SERVER_BASE_URL}/segments/${segmentId}`,{}
// 		); 
// 		return response;
// 	  } catch (error) {
// 		console.error('Failed to update segment status:', error);
// 		return null;
// 	  }
//   }

export {getSegmentMeta , getSegmentTraffic ,getMasterSegments, createSegment, getSegments, getSegment , putSegments}