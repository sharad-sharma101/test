import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../auth/AuthContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getCampaigns } from '../../services/campaigns';
import { getVariants } from '../../services/variants';
import featureServices from '../../services/features';
import { callCoreFeaturesApiData, setCampaginsInRedux, setCoreFeaturesLoading, setIsDataPresent, setSegmentsInRedux, setUseCasesInRedux, setVaraintsInRedux } from '../../features/core-feature-configs/core-features-slice';
import { getMasterSegments, getSegments } from '../../services/segments';
import { SEGMENT_ORDER, USECASE_ORDER } from '../../utils/constants';
import { sortArrayByType, sortArrayByViewOrder } from '../../utils/helpers';

const CoreFeatures = () => {

    const authContext: any = useContext(AuthContext);
    const {isDataPresent,callApiData}=useAppSelector((store)=>store.coreFeaturesSlice)
    const dispatch=useAppDispatch()
    useEffect(() => {	
		if(authContext?.accountId && authContext?.containerId)
			fetchCampaigns()
	}, [authContext?.accountId, authContext?.containerId]);

	useEffect(()=>{
		if(callApiData){
			fetchCampaigns();
		}
	},[callApiData])
    const fetchCampaigns = async () => {
		try {
        dispatch(setCoreFeaturesLoading(true))
			const campaignsPromise = getCampaigns(
				`accountId=${authContext.accountId}&containerId=${authContext.containerId}`
			);

			const variantsPromise = getVariants(
				`accountId=${authContext.accountId}&containerId=${authContext.containerId}`
			);
			const segmentPromise= getMasterSegments()
			const useCasePromise= featureServices.getFeaturesMaster()
			const customSegments = getSegments(`containerId=${authContext.containerId}&isDelete=${false}`)

			const [resp, vResp,useCaseResp,segmentResp,customSegmentResp] = await Promise.all([
 
				campaignsPromise.catch(error => {
					console.error('Error fetching campaigns:', error);
					return [];
				}),
				variantsPromise.catch(error => {
					console.error('Error fetching variants:', error);
					return [];
				}),
				useCasePromise.catch(error => {
					console.error('Error fetching useCase:', error);
					return [];
				}),
				segmentPromise.catch(error => {
					console.error('Error fetching segments:', error);
					return [];
				}),
				customSegments.catch(error => {
					console.error('Error fetching segments:', error);
					return [];
				})
				

			]);
			
			const updatedCampaigns=[]
			for(let el of resp){
				//this loop is filtering the campaigns which are not deleted and dont have isDeleted key
				if(!el?.isDeleted){
					updatedCampaigns.push(el)
				}
			}
			let activeSements=[]
			let activeUseCases=[]
			//for setting active campaings
			for(let el of updatedCampaigns){			
				let foundActive=false
				for(let variantItem of vResp){
					if(variantItem?.campaignId?._id===el?._id&&variantItem?.isDraft==false&&variantItem?.status=="active"){
						el.status="active"

						activeUseCases.push(variantItem.useCaseId)
						activeSements.push(variantItem.segmentId)
						foundActive=true
					
					}
				}
				if(foundActive===false){
					el.status="inactive"

				}
			}
			//for setting active Segments
			let objCheck:any={}
			const totalSegmentArr = [ ...segmentResp , ...customSegmentResp ]
			for(let el of activeSements){
				for(let segment of totalSegmentArr){
					if(segment?._id===el?._id){
						segment.status="active"
						if(!objCheck[segment?._id]){
							objCheck[segment?._id]=true
						}
					}else{
						if(!objCheck[segment?._id]){
							segment.status="inactive"
						}
					}
				}
			}
			//for setting active UseCases
			let objectUse:any={}
			for(let el of activeUseCases){
				for(let useCase of useCaseResp){
					if(useCase?._id===el?._id){
						useCase.status="active"
						if(objectUse[useCase?._id]==undefined){
							objectUse[useCase?._id]=true
						}
					}else{
						if(!objectUse[useCase?._id]){
							useCase.status="inactive"
						}
					}
				}
			}
			
			let usecaseData = sortArrayByViewOrder(useCaseResp)
			let segmentData = sortArrayByType(totalSegmentArr)
			dispatch(setCampaginsInRedux(updatedCampaigns))
			dispatch(setVaraintsInRedux(vResp))
			dispatch(setUseCasesInRedux(usecaseData))
			dispatch(setSegmentsInRedux(segmentData))
			dispatch(callCoreFeaturesApiData(false))
			dispatch(setCoreFeaturesLoading(false))
			

		} catch (error) {
			console.error('Error fetching data:', error);
		}

	};

  return (
    <div>
      
    </div>
  )
}

export default CoreFeatures
