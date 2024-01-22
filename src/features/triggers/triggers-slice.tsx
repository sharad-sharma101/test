// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TRIGGER_DEFINATION } from "../../utils/constants"
import { v4 as uuidv4 } from 'uuid';

interface TriggersConfig {
    triggerArray:any
    TriggerCheck: boolean
}

const initialState: TriggersConfig = {
	triggerArray:[[{...TRIGGER_DEFINATION,_id:uuidv4()}]] , TriggerCheck: true
}

const triggersConfigs = createSlice({
	name: "triggers",
	initialState,
	reducers: {
        handleTriggerOrCondition:(state)=>{
                state.triggerArray=[...state.triggerArray,[{...TRIGGER_DEFINATION,_id:uuidv4()}]]
        },
        handleTriggerAndCondition:(state,action)=>{
            let cloneArr=state.triggerArray
            cloneArr[action.payload]=[...cloneArr[action.payload],{...TRIGGER_DEFINATION,_id:uuidv4()}]
            state.triggerArray=cloneArr
        },
        handleParticularDeleteTrigger:(state,action)=>{
            const updatedTriggerPage = state.triggerArray
            updatedTriggerPage[action.payload[0]].splice(action.payload[1], 1)
            if(updatedTriggerPage[action.payload[0]].length === 0){
                updatedTriggerPage.splice(action.payload[0], 1)
            }
            state.TriggerCheck = !state.TriggerCheck
            state.triggerArray=updatedTriggerPage
        },
        handleUpdateTrigger:(state,action)=>{
            let updatedTriggerPage = state.triggerArray
            updatedTriggerPage[action.payload[0]]=action.payload[1]
            state.triggerArray=updatedTriggerPage
        },
        handleCloneTrigger:(state,action)=>{
            state.triggerArray = action.payload
        },
        setReduxTriggersSliceEmpty:(state)=>{
            Object.assign(state,initialState)
        }

	},
})

export const {  handleTriggerOrCondition,setReduxTriggersSliceEmpty,handleTriggerAndCondition,handleParticularDeleteTrigger,handleCloneTrigger,handleUpdateTrigger} = triggersConfigs.actions
export default triggersConfigs.reducer