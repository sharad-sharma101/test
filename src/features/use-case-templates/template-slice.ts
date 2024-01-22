// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    editTemplate:{
        _id:"",
        html:"",
        style:"",
        name:""
    },
    useCase:{
        _id:""
    }
}

const templateState = createSlice({
	name: "template-state",
	initialState,
	reducers: {
        updateEditTemplate(state, action){
			state.editTemplate = action.payload.editTemplate
        },
        updateUseCase(state, action){
			state.useCase = action.payload.useCase
        },
	},
})

export const { updateEditTemplate, updateUseCase } = templateState.actions
export default templateState.reducer