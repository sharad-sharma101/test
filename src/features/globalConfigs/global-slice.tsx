// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TRIGGER_DEFINATION } from "../../utils/constants"
import { v4 as uuidv4 } from 'uuid';

interface globalConfig {
    isAppLoading:boolean
    globalAlert: {},
    isChanged:boolean, 
     currentDomainHeader:string,
    paymentModalVisible:boolean,
    reloadIframe:boolean
}

const initialState: globalConfig = {
	isAppLoading:false,
    globalAlert:{
        visible:false,
        content:"",
        theme:""
    },
    isChanged:true,  currentDomainHeader:"",
    paymentModalVisible:false,
    reloadIframe:true
}

const globalConfigs = createSlice({
	name: "globalStates",
	initialState,
	reducers: {
      
        setReduxTriggersSliceEmpty:(state)=>{
            Object.assign(state,initialState)
        },
        setAlertVisible:(state,action)=>{
            state.globalAlert=action.payload
        },
        setIsChanges:(state,action)=>{
            state.isChanged=action.payload
        },
        setCurrentDomainHeader:(state,action)=>{
            state.currentDomainHeader=action.payload
        },
        setPaymentModalVisible:(state,action)=>{
            state.paymentModalVisible=action.payload
        },
        setReloadIframe:(state,action)=>{
            state.reloadIframe=action.payload
        }

	},
})

export const { setAlertVisible,setIsChanges,setCurrentDomainHeader,setPaymentModalVisible,setReloadIframe } = globalConfigs.actions
export default globalConfigs.reducer