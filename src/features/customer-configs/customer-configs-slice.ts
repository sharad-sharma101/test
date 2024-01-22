// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CustomerConfigs {
	domainName?: string
	containerId: string
	accountId: string
	email?: string
	shopName?: string
	accessToken?: string
}

const initialState: CustomerConfigs = {
	domainName: "",
	containerId: "",
	accountId: "",
	email: "",
	shopName: "",
	accessToken: "",
}

const customerConfigs = createSlice({
	name: "customerConfigs",
	initialState,
	reducers: {
		updateConfigs(state, action: PayloadAction<CustomerConfigs>) {
			state.accountId = action.payload.accountId
			state.containerId = action.payload.containerId
			if (action.payload.email) state.email = action.payload.email
			if (action.payload?.domainName) state.domainName = action.payload.domainName
		},
		updateCredentials(
			state,
			action: PayloadAction<{ shopName?: string, accessToken?: string }>
		) {
			const { shopName, accessToken } = action.payload
			state.shopName = shopName
			state.accessToken = accessToken
		},
	},
})

export const { updateConfigs, updateCredentials } = customerConfigs.actions
export default customerConfigs.reducer