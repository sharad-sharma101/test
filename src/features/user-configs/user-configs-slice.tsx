// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface userConfigFeatures {
    containerObjectInRedux:any,
    

   
}

const initialState: userConfigFeatures = {
    containerObjectInRedux:{}
}

const userConfigFeatures = createSlice({
	name: "core-config-featues",
	initialState,
	reducers: {
       setContainerObjectInRedux:(state,{payload})=>{
        state.containerObjectInRedux=payload
       }
    

	},
})

export const {setContainerObjectInRedux } = userConfigFeatures.actions
export default userConfigFeatures.reducer