// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: ProductInfo = {
	totalProductsSold:"",
	location:"",
	productsLeftInStock:""
}

const productInfo = createSlice({
	name: "product-info",
	initialState,
	reducers: {
		updateProductInfo(state, action: PayloadAction<ProductInfo>) {
			const {totalProductsSold,location, productsLeftInStock} = action.payload
			state.totalProductsSold = totalProductsSold
			state.location = location
			state.productsLeftInStock = productsLeftInStock
		},
	},
})

export const { updateProductInfo } = productInfo.actions
export default productInfo.reducer