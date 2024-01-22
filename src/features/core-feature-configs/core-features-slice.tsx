// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface coreFeatures {
    reduxCampaigns:any,
    reduxUseCases:any,
    reduxVariants:any,
    reduxSegments:any,
    reduxLoadClicks:[],
    reduxImpressions:[],
    variantViewStatus:string,
    isDataPresent:boolean,
    campaignViewStatus:string,
    callApiData:boolean,
    coreFeaturesLoading:boolean,
    statusTabTitle: string

   
}

const initialState: coreFeatures = {
    reduxCampaigns:[],
    reduxUseCases:[],
    reduxVariants:[],
    reduxSegments:[],
    reduxLoadClicks:[],
    reduxImpressions:[],
    isDataPresent:false,
    campaignViewStatus:"",
    variantViewStatus:'',
    callApiData:false,
    coreFeaturesLoading:true,
    statusTabTitle: "active"

	
}

const coreFeatures = createSlice({
	name: "core-features",
	initialState,
	reducers: {
        setIsDataPresent:(state,action)=>{
            state.isDataPresent=action.payload
        },
        setStatusTabTitle:(state,action)=>{
            state.statusTabTitle=action.payload
        },
        setCampaginsInRedux:(state,action)=>{
            state.reduxCampaigns=action.payload
        },
        setVaraintsInRedux:(state,action)=>{
            state.reduxVariants=action.payload
        },
        setSegmentsInRedux:(state,action)=>{
            state.reduxSegments=action.payload
        },
        setUseCasesInRedux:(state,action)=>{
            state.reduxUseCases=action.payload
        },
        setLoadCLicksInRedux:(state,action)=>{
            state.reduxLoadClicks=action.payload
        },
        setImpressionsInRedux:(state,action)=>{
            state.reduxImpressions=action.payload
        },
        setCampaignViewStatus:(state,action)=>{
            state.campaignViewStatus=action.payload
        },
        addNewVariantInRedux:(state,action)=>{
            state.reduxVariants=[...state.reduxVariants,action.payload]
        },
        updateVaraintStatusInRedux:(state,{payload})=>{


            let updatedVariants=state.reduxVariants.map((el:any)=>{
               
                if(el?._id==payload.variant?._id){
                    el.status=payload.status
                }
                if(payload?.status=="active"&&el?._id!==payload?.variant?._id&&payload?.variant?.campaignId?._id===el?.campaignId?._id){
                    el.status='inactive'
                }
                return el
            })
            let activeSegments=[]
			let activeUseCases=[]

	

            for(let variantItem of updatedVariants){
                if(variantItem.status=="active"){
                    activeUseCases.push({...variantItem.useCaseId})
                    activeSegments.push({...variantItem.segmentId})
                }
            }
                   
            let updatedCampaigns=state.reduxCampaigns
            .map((el:any)=>{
                let foundActive=false
                for(let variantItem of updatedVariants){
                    if(variantItem?.campaignId?._id===el?._id&&variantItem?.isDraft==false&&variantItem?.status=="active"){
                        el.status="active"
                        foundActive=true
                        break;
                    }
                }
                if(foundActive===false){
                    el.status="inactive"
                }
                return el
            })
           
            let updatedSegments=[];
            for(let el of state.reduxSegments){
                updatedSegments.push({...el})
            }
            let objCheck:any={}
            for(let s of updatedSegments){

                for(let el of activeSegments){
                    if(el?._id===s?._id){
                        
                       s.status="active"
                       if(objCheck[s?._id]==undefined){
                        objCheck[s?._id]=true
                       }
                    }else{
                       if(!objCheck[s?._id]){
                        s.status="inactive"
                       }
                    }
                }
            }
           
            let updatedUseCases=[]
            for(let el of state.reduxUseCases){
                updatedUseCases.push({...el})
            }
 
           let objUseCheck:any={}
            for(let u of updatedUseCases){
                for(let el of activeUseCases){
                    if(el?._id===u?._id){
                        
                        u.status="active"
                        if(objUseCheck[u?._id]==undefined){
                            objUseCheck[u?._id]=true
                           }
                    }else{
                       
                        if(!objUseCheck[u?._id]){
                            u.status="inactive"
                           }
                    }
                }
            }
            if(activeUseCases.length==0){
                for(let u of updatedUseCases){                     
                    u.status="inactive"  
                }
                for(let s of updatedSegments){                     
                    s.status="inactive"  
                }
            }

    
            
            state.reduxCampaigns=updatedCampaigns
            state.reduxVariants=updatedVariants
            state.reduxSegments=updatedSegments
            state.reduxUseCases=updatedUseCases

        },
        handleDeleteVariantInRedux:(state,{payload})=>{
            let updatedVaraints=state.reduxVariants.map((el:any)=>{
                if(el?._id===payload?.variant?._id){
                    el.isDeleted=true
                    el.status="inactive"
                }
                return el
            })
            let updatedCampaign=payload?.variant?.campaignId?._id

            let count=0;
            for(let item of updatedVaraints){
                if(item?.campaignId?._id===updatedCampaign&&item?.isDeleted===false&&item?.status=='active'){
                    count++
                }
            }
            if(count==0){
                let updatedCampaigns=[]
                for(let el of [...state.reduxCampaigns]){
                    updatedCampaigns.push(el)
                }
                for(let el of updatedCampaigns){
                    if(el?._id===updatedCampaign){
                        el.status="inactive"
                        break;
                    }
                }

                state.reduxCampaigns=updatedCampaigns
            }
    
            state.reduxVariants=updatedVaraints
        },
        setVariantViewStatus:(state,{payload})=>{
            state.variantViewStatus=payload
        },
        callCoreFeaturesApiData:(state,{payload})=>{
            state.callApiData=payload
        },
        setCoreFeaturesLoading:(state,{payload})=>{
            state.coreFeaturesLoading=payload
        },
        handleUpdateCampaignInRedux:(state,{payload})=>{
                let updatedCampaigns=state.reduxCampaigns.map((el:any)=>{
                    if(el?._id==payload?.campaign?._id){
        
                       return {...el,...payload}
                    }
                    return el
                })
                state.reduxCampaigns=updatedCampaigns


        }
    

	},
})

export const {handleUpdateCampaignInRedux,setCampaignViewStatus, setStatusTabTitle, setCoreFeaturesLoading,updateVaraintStatusInRedux,setVariantViewStatus,callCoreFeaturesApiData, handleDeleteVariantInRedux,addNewVariantInRedux,setIsDataPresent,setImpressionsInRedux,setLoadCLicksInRedux,setCampaginsInRedux,setUseCasesInRedux,setSegmentsInRedux,setVaraintsInRedux } = coreFeatures.actions
export default coreFeatures.reducer