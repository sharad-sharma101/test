import { errorService, httpClient } from "../libs"
const {
    VITE_VELOCITY_BASE_URL:SERVER_BASE_URL
} = import.meta.env

const getAudiences = async (containerId:string, query:string,body:any) => {
	try {
			const response: any = await httpClient.post(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/all?${query}`,
				{},body
			)
			return response?.data  || {}
		
	} catch (error) {
		errorService.reportError(error)
	}
}
const getVisitors = async (containerId:string, query:string,body:any) => {
	try {
			const response: any = await httpClient.post(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/visitors?${query}`,
				{},body
			)
			return response?.data  || {}
		
	} catch (error) {
		errorService.reportError(error)
	}
}
const getCustomers = async (containerId:string, query:string,body:any) => {
	try {
			const response: any = await httpClient.post(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/customers?${query}`,
				{},body
			)
			return response?.data  || {}
	} catch (error) {
		errorService.reportError(error)
	}
}

const getUsers = async (containerId:string, query:string,body:any) => {
	try {
			const response: any = await httpClient.post(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/users?${query}`,
				{},body
			)
			return response?.data  || {}
	} catch (error) {
		errorService.reportError(error)
	}
}
const getAllAudiences = async (containerId:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/all/exports`,
				{}
			)
			return response || {}
		
	} catch (error) {
		errorService.reportError(error)
	}
}
const getAllVisitors = async (containerId:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/visitors/exports`,
				{}
			)
			return response || {}
		
	} catch (error) {
		errorService.reportError(error)
	}
}
const getAllCustomers = async (containerId:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/customers/exports`,
				{}
			)
			return response || {}
	} catch (error) {
		errorService.reportError(error)
	}
}

const getAllUsers = async (containerId:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/users/exports`,
				{}
			)
			return response || {}
	} catch (error) {
		errorService.reportError(error)
	}
}

const getSingleUserData = async (containerId:string, query:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience/profile${query}`,
				{}
			)
			return response?.data  || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}



const getAllSessionsData = async (containerId:string, query:string) => {
	try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience${query}`,
				{}
			)
			return response?.data  || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}

const getSingleEventData=async(containerId:string, query:string)=>{
		try {
			const response: any = await httpClient.get(
				`${SERVER_BASE_URL}/api/containers/${containerId}/audience${query}`,
				{}
			)
			return response?.data  || []
		
	} catch (error) {
		errorService.reportError(error)
	}
}
// for kpi card on summary page
const getVisitorSessionDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpi/session/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getCustomerSessionDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpi/session/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getCustomerOrderDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpi/order/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getVisitorCartDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpi/cart/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getCustomerCartDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpi/cart/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getVisitorDomainDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/domains/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

const getCustomerDomainDetail=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/domains/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}

// for meta page 
const getVisitorMetaPages=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/pages/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getCustomerMetaPages=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/pages/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getVisitorMetaType=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/type/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getCustomerMetaType=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/type/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getCustomerMetaOrder=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/order/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getVisitorMetaCart=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/cart/visitor/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getCustomerMetaCart=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/cart/customer/${id}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getVisitorMetaVisit=async(containerId:string, id:string, date: string , time: string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/visit/visitor/${id}?date=${date}&time=${time}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getCustomerMetaVisit=async(containerId:string, id:string, date: string , time: string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/audience/meta/visit/customer/${id}?date=${date}&time=${time}`,
			{}
		)
		return response?.data  || []
	
} catch (error) {
	errorService.reportError(error)
}
}
const getAverageOrderValue=async(containerId:string, start: string , last: string)=>{
	try {
		const response: any = await httpClient.get(
			`${SERVER_BASE_URL}/api/containers/${containerId}/kpi/average-order-value?start=${start}&last=${last}`,
			{}
		)
		return response?.data  || []
	
	} catch (error) {
		errorService.reportError(error)
	}
}
const getLandingPageData=async(containerId:string, id:string, query:string)=>{
	try {
		const response: any = await httpClient.get(`${SERVER_BASE_URL}/api/containers/${containerId}/audience/landingpages/${id}?${query}`,{})
		return response?.data  || {}
	
	} catch (error) {
		errorService.reportError(error)
	}
}

const getProducts =async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(`${SERVER_BASE_URL}/api/containers/${containerId}/audience/products/${id}`,{})
		return response?.data  || []

	} catch (error) {
		errorService.reportError(error)
	}
}
const getLandingPageKpiData=async(containerId:string, id:string)=>{
	try {
		const response: any = await httpClient.get(`${SERVER_BASE_URL}/api/containers/${containerId}/audience/kpidata/${id}`,{})
		return response?.data  || {}
	
	} catch (error) {
		errorService.reportError(error)
	}
}



const getSummaryPageLocationData=async(query:string)=>{
	try {
		const response: any = await httpClient.get(`${SERVER_BASE_URL}/api/containers${query}`,{})
		return response?.data?.data  || {}

	} catch (error) {
		errorService.reportError(error)
	}
}
const getProductsTabData=async(containerId:string, id:string, query:string)=>{
	try {
		const response: any = await httpClient.get(`${SERVER_BASE_URL}/api/containers/${containerId}/audience/products/tab/${id}?${query}`,{})
		return response?.data  || {}

	
	} catch (error) {
		errorService.reportError(error)
	}
}

export {getCustomerMetaVisit,getSummaryPageLocationData ,getProducts ,getProductsTabData , getVisitorMetaVisit ,getAverageOrderValue, getCustomerMetaCart , getVisitorMetaCart , getCustomerMetaOrder , getCustomerMetaType , getVisitorMetaType , getCustomerMetaPages , getVisitorMetaPages , getVisitorSessionDetail , getVisitorCartDetail , getCustomerSessionDetail , getCustomerOrderDetail , getCustomerDomainDetail , getVisitorDomainDetail , getCustomerCartDetail , getAudiences, getVisitors, getCustomers, getUsers, getSingleUserData,getAllSessionsData,getSingleEventData, getLandingPageData, getLandingPageKpiData, getAllAudiences, getAllVisitors, getAllCustomers, getAllUsers};


