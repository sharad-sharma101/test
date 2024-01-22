// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CopyGlobalConfig {
    copyOfTriggerConfig:any
    copyOfTemplateConfig:any
}

const initialState: CopyGlobalConfig = {
    copyOfTriggerConfig:{},
    copyOfTemplateConfig:{}
}

const copyGlobal = createSlice({
	name: "triggers",
	initialState,
	reducers: {
        setCopyofStatesInRedux:(state,action)=>{
            state.copyOfTemplateConfig=action.payload.templateData
            state.copyOfTriggerConfig=action.payload.triggerData
        }
	},
})

export const {setCopyofStatesInRedux } = copyGlobal.actions
export default copyGlobal.reducer