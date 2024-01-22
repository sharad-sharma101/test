import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, store } from "../../app/store"

export interface Version {
	[key: string]: string | number
}

const initialState: { [key: string]: { versions: Version[]; latestVersionIndex: number } } = {}

const versions = createSlice({
	name: "versions",
	initialState,
	reducers: {
		createVersion(state, action: PayloadAction<{ _id: string; version: Version }>) {
			const _id = action.payload?._id
			if (!state[_id]) {
				state[_id] = { versions: [], latestVersionIndex: -1 }
			}
			const { versions, latestVersionIndex } = state[_id]
			versions.push({ ...versions[latestVersionIndex], ...action.payload.version })

			const updatedVersionState = {
				versions,
				latestVersionIndex: latestVersionIndex + 1,
			}

			state[_id] = updatedVersionState
		},
		addVersionOnIndex(
			state,
			action: PayloadAction<{ _id: string; index: number; version: Version }>
		) {
			const _id = action.payload?._id
			const index = action.payload?.index
			if (!state[_id]) {
				state[_id] = { versions: [], latestVersionIndex: -1 }
			}
			const { versions, latestVersionIndex } = state[_id]

			const updatedVersion = [...versions]
			updatedVersion[index] = { ...updatedVersion[index], ...action.payload.version }

			const updatedVersionState = {
				versions: updatedVersion,
				latestVersionIndex: state[_id].versions.length ? latestVersionIndex : 0,
			}

			state[_id] = updatedVersionState
		},
		resetVersion(state, action: PayloadAction<{ _id: string, version: Version }>) {
			const _id = action.payload?._id
			state[_id] = { versions: [{...action.payload.version}], latestVersionIndex: -1 }
		},
	},
})

// export const getAllVersions = (state: RootState) => state
export function getLatestVersion(action: { _id: string }) {
	const state = store.getState().versions
	const _id = action?._id || ""

	if (!_id || !state[_id]) return {}
	const { versions, latestVersionIndex } = state[_id]
	if (latestVersionIndex < 0) return {}

	return versions[latestVersionIndex]
}

export function getPreviousVersion(action: { _id: string }) {
	const state = store.getState().versions
	const _id = action?._id || ""

	if (!_id || !state[_id]) return {}
	const { versions, latestVersionIndex } = state[_id]
	if (latestVersionIndex <= 0) return versions[0]

	return versions[latestVersionIndex - 1]
}

export function getFirstVersion(action: { _id: string }) {
	const state = store.getState().versions
	const _id = action?._id || ""

	if (!_id || !state[_id]) return {}
	const { versions, latestVersionIndex } = state[_id]

	return versions[0]
}

export const { createVersion, addVersionOnIndex, resetVersion } = versions.actions
export default versions.reducer
