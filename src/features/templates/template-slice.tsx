// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface TemplateConfigs {
    template:any,
    selectedPagesObject:any,
    variantObject:any,
    allPages:any,
    completedStep : {
        step : number , route: string
    },

    variantName:string,
    position:any,
    placementDataStore:{},
    scheduleStartDate:string , 
    scheduleEndTime:string,
    scheduleStartTime:string , 
    scheduleEndDate:string,
    frequencyCount:number,
    frequencySession:number,
    frequencyObjectType:string,
    selectedPagesforFlow:string[],
    isDraftstillThere:boolean,
    variantDescription: string,
    isVariantLoading:boolean,
    templateChange:boolean,
    delay: number,
    displayType: boolean,
    overlapType: string ,
    coolingperiod: number,
    maxImpressionsType: any,
    impressionsType: any,
    validateButtons:any,
    couponObject: boolean ,
    couponCode: string ,
    discountPercentage: number ,
    discountTime: number
}

const initialState: TemplateConfigs = {

	template:{},position:"",placementDataStore:{},selectedPagesObject:{},variantObject:{},isDraftstillThere:true,variantDescription:"",
     allPages:[] , completedStep:{ step : 0 , route: ''},  variantName:""  , scheduleStartDate:'' , scheduleStartTime:'' ,scheduleEndDate:'' ,scheduleEndTime:'', frequencyCount:1 , frequencySession: 1 , frequencyObjectType:"none", selectedPagesforFlow:[] 
     ,isVariantLoading:false, templateChange: false,delay: 1000, overlapType: "FORCE_OVERLAP" , coolingperiod: 1 , displayType: false ,maxImpressionsType: { _id: 2, value: "Not Limited"},
     impressionsType: { _id: 2, value: "Not Limited"}, validateButtons: false , couponObject: true , couponCode: '' , discountPercentage: 0 , discountTime: 0
 }

const templateConfigs = createSlice({
	name: "template",
	initialState,
	reducers: {
		setTemplate:(state,action)=>{
                state.template=action.payload
        },
        setImpressionsType:(state,action)=>{
            state.impressionsType=action.payload
        },
        setMaxImpressionsType:(state,action)=>{
            state.maxImpressionsType=action.payload
        },
        setSelectedPages:(state,action)=>{
            state.selectedPagesObject=action.payload
        },
        setVariantObject:(state,action)=>{
            state.variantObject=action.payload
        },
        setAllPages:(state,action)=>{
            state.allPages=action.payload
        },

        setCompletedStep:(state , action)=>{
            state.completedStep = { step:action.payload[0] , route: action.payload[1] }
        },
        setVariantName:(state,action) => {
            state.variantName = action.payload
        },
        setSelectedPostion:(state,action)=>{
            state.position=action.payload
        },
        setPlacementDataStore:(state,action)=>{
            state.placementDataStore=action.payload
        },
        setScheduleStartDate(state,action){
            state.scheduleStartDate=action.payload
        },
        setScheduleEndDate(state,action){
            state.scheduleEndDate=action.payload
        },
        setScheduleStartTime(state,action){
            state.scheduleStartTime=action.payload
        },
        setScheduleEndTime(state,action){
            state.scheduleEndTime=action.payload
        },
        setFrequencyCount(state,action){
            state.frequencyCount=action.payload
        },
        setFrequencySession(state,action){
            state.frequencySession=action.payload
        },
        setFrequencyObjectType(state,action){
            state.frequencyObjectType=action.payload
        },
        setPagesForTheFlow:(state,action)=>{
            state.selectedPagesforFlow=action.payload
        },
        setReduxTemplateSliceEmpty:(state)=>{
            Object.assign(state,initialState)

        },
        setIsDraftFalse:(state)=>{
            state.isDraftstillThere=false
        },
        setVariantDescription:(state,action)=>{
            state.variantDescription= action.payload
        },
        setLoaderActive:(state,action)=>{
            state.isVariantLoading=action.payload
        },
        setTemplateChange:(state,action) => {
            state.templateChange=action.payload
        },
        setDelay:(state,action)=>{
            state.delay= action.payload
        },
        setOverlapType:(state,action)=>{
            state.overlapType= action.payload
        },
        setCoolingPeriod:(state,action)=>{
            state.coolingperiod= action.payload
        },
        setDisplayType:(state,action)=>{
            state.displayType= action.payload
        },
        setValidateButtons:(state,action)=>{
            state.validateButtons= action.payload
        },
        setCouponObject:(state,action)=>{
            state.couponObject= action.payload
        },
        setCouponCode:(state,action)=>{
            state.couponCode= action.payload
        },
        setDiscountPercentage:(state,action)=>{
            state.discountPercentage= action.payload
        },
        setDiscountTime:(state,action)=>{
            state.discountTime= action.payload
        }
	},
})


export const { setDiscountTime, setCouponCode, setCouponObject, setDiscountPercentage ,setImpressionsType, setMaxImpressionsType, setDisplayType,setDelay,setOverlapType,setCoolingPeriod,setTemplate,setPlacementDataStore,setLoaderActive,setTemplateChange, setVariantDescription,setSelectedPostion,setReduxTemplateSliceEmpty,setFrequencySession, setFrequencyCount ,setSelectedPages,setVariantObject,setAllPages,setCompletedStep,setVariantName, setScheduleStartDate , setScheduleStartTime ,setScheduleEndDate ,setScheduleEndTime,setIsDraftFalse, setFrequencyObjectType, setPagesForTheFlow, setValidateButtons } = templateConfigs.actions



export default templateConfigs.reducer