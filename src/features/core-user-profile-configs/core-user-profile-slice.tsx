// DUCKS pattern
import { createSlice } from "@reduxjs/toolkit"

interface coreUserProfile {
    summeryResponse:{
        page: number,
        domainData: [],
        productsData: [],
        locationDataOfUser: [],
        kpiData: []
    },
    eventActivityResponse:{
        page: number,
        totalEvent: number,
        sessionsData: []
    },
    metaDataResponse:{
        page: number,
        data: []
    },
    landingPagesResponse:{
        page: number,
        data: [],
        kpiData: []
    },
    productsResponse:{
        page: number,
        data: [],
        kpiData: []
    },
    eventList:any
}

const initialState: coreUserProfile = {
    summeryResponse:{
        page: 1,
        domainData: [],
        productsData: [],
        locationDataOfUser: [],
        kpiData: []
    },
    eventActivityResponse:{
        page: 1,
        totalEvent:0,
        sessionsData: []
    },
    metaDataResponse:{
        page: 1,
        data: []
    },
    landingPagesResponse:{
        page: 1, //For pagination(implemented)
        data: [],
        kpiData: []
    },
    productsResponse:{
        page: 1,
        data: [],
        kpiData: []
    },
    eventList:[]
}

const coreUserProfile = createSlice({
	name: "core-user-profile",
	initialState,
	reducers: {
        setSummeryResponseInRedux:(state,{payload})=>{
            state.summeryResponse={...state.summeryResponse, ...payload}
        },
        setEventActivityResponseInRedux:(state,{payload})=>{
            state.eventActivityResponse={...state.eventActivityResponse, ...payload}
        },
        setMetaDataResponseInRedux:(state,{payload})=>{
            state.metaDataResponse={...state.metaDataResponse, ...payload}
        },
        setLandingPagesResponseInRedux:(state,{payload})=>{
            state.landingPagesResponse={...state.landingPagesResponse, ...payload}
        },
        setProductsResponseInRedux:(state,{payload})=>{
            state.productsResponse={...state.productsResponse, ...payload}
        },
        setReduxUserProfileSliceEmpty:(state)=>{
            Object.assign(state,initialState)
        },
        setEventList:(state,{payload})=>{
            state.eventList = [...payload]
        },
	},
})

export const { setSummeryResponseInRedux, setEventList,setEventActivityResponseInRedux, setMetaDataResponseInRedux, setLandingPagesResponseInRedux, setProductsResponseInRedux, setReduxUserProfileSliceEmpty } = coreUserProfile.actions
export default coreUserProfile.reducer