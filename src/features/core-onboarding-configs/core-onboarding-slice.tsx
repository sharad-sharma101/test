// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface coreOnboardingFeatures {
    coreOnboardingFeaturesLoading:boolean,
    

   
}

const initialState: coreOnboardingFeatures = {
    coreOnboardingFeaturesLoading:false
}

const coreOnboardingFeatures = createSlice({
	name: "core-onboarding-featues",
	initialState,
	reducers: {
       setCoreOnboardingFeaturesLoading:(state,{payload})=>{
        state.coreOnboardingFeaturesLoading=payload
       }
    

	},
})

export const {setCoreOnboardingFeaturesLoading } = coreOnboardingFeatures.actions
export default coreOnboardingFeatures.reducer