import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface FeatureSetting {
	_id: string
	css: {
		[key: string]: string
	}
	content?: string
	meta?:{
		[key: string]: string
	}
}

const initialState: { featureSettings: FeatureSetting[] } = { featureSettings: [] }

const featureSetting = createSlice({
	name: "featureSetting",
	initialState,
	reducers: {
		updateFeatureSettings(
			state,
			action: PayloadAction<{ _id: string, key: string, value: string }>
		) {
			const featureSettingsCopy = [...state.featureSettings]

			const isFeatureInSettings = featureSettingsCopy.filter(
				(setting, idx) => setting._id === action.payload._id
			)[0]
			if (!isFeatureInSettings)
				featureSettingsCopy.push({ _id: action.payload._id, css: {}, content: "" })

			state.featureSettings = featureSettingsCopy.map((setting, idx) => {
				const settingCopy = { ...setting }
				if (setting._id === action.payload._id) {
					settingCopy.css[action.payload.key] = action.payload.value
				}

				return settingCopy
			})
		},
		updateFeatureContent(state, action: PayloadAction<{ _id: string, content: string }>) {
			/**
			 * update feature content here
			 * update feature content based on _id of the feature
			 */
			const featureSettingsCopy = [...state.featureSettings]

			const isFeatureInSettings = featureSettingsCopy.filter(
				(setting, idx) => setting._id === action.payload._id
			)[0]
			if (!isFeatureInSettings)
				featureSettingsCopy.push({ _id: action.payload._id, css: {}, content: "" })

			state.featureSettings = featureSettingsCopy.map((setting) => {
				const settingCopy = { ...setting }
				if (setting._id === action.payload._id) {
					settingCopy.content = action.payload.content
				}

				return settingCopy
			})
		},
		resetFeatureSettings(state, action: PayloadAction<{ _id: string }>) {
			const featureSettingsCopy = [...state.featureSettings]
			state.featureSettings = featureSettingsCopy.map((feature, idx) => {
				if (feature._id == action.payload._id) {
					const featureCopy = { ...feature }
					featureCopy.css = {}
					featureCopy.content = ""
					featureCopy.meta = {}
					return featureCopy
				}
				return feature
			})
		},
		updateFeatureMetaSettings(state, action:PayloadAction<{_id:string, meta:{[key:string]:string}}>){

			 const featureSettingsCopy = [...state.featureSettings]

			 const isFeatureInSettings = featureSettingsCopy.filter(
				 (setting, idx) => setting._id === action.payload._id
			 )[0]
			 if (!isFeatureInSettings)
				 featureSettingsCopy.push({ _id: action.payload._id, css: {}, content: "" , meta:{}})
 
			 state.featureSettings = featureSettingsCopy.map((setting) => {
				 const settingCopy = { ...setting }
				 if (setting._id === action.payload._id) {
					 settingCopy.meta = action.payload.meta
				 }
 
				 return settingCopy
			 })
		}
	},
})

export const getFeatureSettings = (state: RootState) => {
	const seletedFeature = state.features.features.filter((feature, idx) => feature.selected)
	// if(!seletedFeature.length) return null

	const feature = state.featureSetting.featureSettings.filter(
		(setting, idx) => setting?._id === seletedFeature[0]?._id
	)

	if (!feature.length) return null

	return feature[0]
}

export const { updateFeatureSettings, updateFeatureContent, resetFeatureSettings, updateFeatureMetaSettings } =
	featureSetting.actions
export default featureSetting.reducer
