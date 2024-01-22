// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface Feature {
	_id: string
	name: string
	meta: {
		[key: string]: any
	}
	rules: [
		{
			given: []
			when: string
			then: [
				{
					[key: string]: any
				}
			]
		}
	]
	containerId: string
	accountId: string
	isEnabled: boolean
	selected?: boolean
	useCaseType?:string
}

const initialState: { features: Feature[] } = {
	features: [],
}

const featuresSlice = createSlice({
	name: "features",
	initialState,
	reducers: {
		setFeaturesInStore(state, action: PayloadAction<Feature[]>) {
			state.features = action.payload
		},
		toggleFeature(state, action: PayloadAction<{_id:string}>) {
			const newFeaturesArr = state.features.map((feature) => {
				if(feature._id === action.payload._id){
					feature.isEnabled = !feature.isEnabled
				}
				return feature
			})
			state.features = newFeaturesArr
		},
		toggleFeatureSelected(state, action: PayloadAction<string>) {
			const tempFeatures = [...state.features].map((feature, idx) => {
				if (feature._id === action.payload) feature.selected = true
				else feature.selected = false
				return feature
			})

			state.features = tempFeatures
		},
	},
})

export const getSelectedFeature = (state: RootState): Feature | null => {
	const selectedFeature = state.features.features.filter((feature, idx) => feature.selected)
	if (!selectedFeature.length) return null
	
	return selectedFeature[0]
}

export const { setFeaturesInStore, toggleFeature, toggleFeatureSelected } = featuresSlice.actions
export default featuresSlice.reducer