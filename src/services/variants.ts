import { httpClient, errorService } from "../libs";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env

const getVariants = async(query:string) => {
	try {
        const variants: any = await httpClient.get(
            `${SERVER_BASE_URL}/variants?${query}`,
            {}
        )
        const updatedData = variants.data.data;
        variants.data.data.map((ele:any , index:number) => {
          let segmentObj = {};
          if(typeof(ele?.customSegmentId) === "object") segmentObj = ele?.customSegmentId
          else if(typeof(ele?.segmentId) === "object") segmentObj = ele?.segmentId
          updatedData[index].segmentId = segmentObj
        })
        variants.data.data = updatedData
        return variants.data?.data || []
  } catch (error) {
      errorService.reportError(error)
  }
}

interface VariantResponseDataSuccess {
    success: boolean;
    data: any;
  }
  
  interface VariantResponseDataError {
    success: boolean;
    error: any;
  }
  
  type VariantResponseData =
    | VariantResponseDataSuccess
    | VariantResponseDataError
    | { message: string };
    async function putVariants(variantId: string, fieldsToUpdate: Record<string, any>) {
      try {
        const response: VariantResponseData = await httpClient.put(
          `${SERVER_BASE_URL}/variants/${variantId}`,
          {},
          fieldsToUpdate
        );
    
        if ('data' in response && response.success && response.data) {
          return response.data;
        } else if ('error' in response) {
          console.error('Failed to update variant status:', response.error);
          return null;
        } else {
          console.error('Invalid response format:', response);
          return null;
        }
      } catch (error) {
        console.error('Failed to update variant status:', error);
        return null;
      }
    }
    
export {getVariants, putVariants}