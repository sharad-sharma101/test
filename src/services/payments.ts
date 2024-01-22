import { errorService, httpClient } from "../libs"
const {
    VITE_PAYMENT_BASE_URL:PAYMENT_BASE_URL
} = import.meta.env


async function getCustomers() {
	try {
		const response: any = await httpClient.get(
			`${PAYMENT_BASE_URL}/api/v2/customers`,{});
		return response.data.data
	} catch (error) {
		errorService.reportError(error);
	}
}

async function createCheckoutSession(customerEmail:string, priceId:string, quantity:string, productId:string){
    const response:any = await httpClient.post(`${PAYMENT_BASE_URL}/api/v1/customers`,{}, {
        customerEmail,
        priceId,
        quantity, 
        productId
    });
    const sessionUrl = response.data.data
    return sessionUrl
}

async function getProductPlans(productId:string){
    try {
        const response:any = await httpClient.get(`${PAYMENT_BASE_URL}/api/v1/list/plans?productId=${productId}`,{});
        const data = response?.data?.data
        if(!data.length) return []
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}

async function getCustomerPortal(query:string){
    try {
        const response:any = await httpClient.get(`${PAYMENT_BASE_URL}/api/v2/create-portal-session?${query}`,{});
        const data = response?.data
        if(!data)return {}
        return data
    } catch (error) {
        console.log(error)
        return {}
    }
}

export {
	getCustomers, 
	createCheckoutSession,
	getProductPlans,getCustomerPortal
}