// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface coreAudience {
    dataObject:{},
    dataCount:{},
    currentPageObject:{},
    dataOrderBy:{}
}

const initialState: coreAudience = {
    dataObject:{
        allaudience:[],
        visitors:[],
        customers:[],
        users:[]
    },
    dataCount:{
        allaudience:0,
        visitors:0,
        customers:0,
        users:0
    },
    currentPageObject:{
        allaudience : 1,
        visitors : 1,
        customers : 1,
        users : 1
    },
    dataOrderBy:{
        allaudience : 'DESC',
        visitors : 'DESC',
        customers : 'DESC',
        users : 'DESC'
    },
}

const coreAudience = createSlice({
	name: "core-Audience",
	initialState,
	reducers: {
        setCurrentPageInRedux:(state,{payload})=>{
            state.currentPageObject={...state.currentPageObject, ...payload}
        },
        setDataCountInRedux:(state,{payload})=>{
            state.dataCount={...state.dataCount, ...payload}
        },
        setDataObjectInRedux:(state,{payload})=>{
            state.dataObject={...state.dataObject, ...payload}
        },
        setDataOrderByInRedux:(state,{payload})=>{
            state.dataObject={...state.dataObject, ...payload}
        },
        setReduxCoreAudienceEmpty:(state)=>{
            Object.assign(state,initialState)
        }
	},
})

export const { setCurrentPageInRedux, setDataCountInRedux, setDataObjectInRedux, setReduxCoreAudienceEmpty, setDataOrderByInRedux } = coreAudience.actions
export default coreAudience.reducer