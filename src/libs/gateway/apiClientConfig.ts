import axios from "axios"
import { errorService } from "../index"
import { getAccessToken } from "../../auth/utils"
const {
    VITE_CLIENT_BASE_URL:CLIENT_BASE_URL
} = import.meta.env
const apiClient = axios.create()

// Request interceptor for API calls
apiClient.interceptors.request.use(
	async (config) => {
		const token = await getAccessToken()
		config.headers = {
			"Authorization": `Bearer ${token}`,
			"Accept": "application/json",
			"Content-Type": "application/json",
		}
		return config
	},
	(error) => {
		Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	function (response) {
		return response
	},
	function (error) {
		let res = error.response
		if (res.status == 401) {
			// ... authorization has been refused( auth can be failed from shopify or some other service... )
		}
		// if (res.status == 404) {
		// 	window.location.href = `${CLIENT_BASE_URL}/not-found`
		// }
		console.error(`Looks like there was a problem. Status Code: ${res.status}`)
		// send error logs
		errorService.reportError(error)

		return Promise.reject(error)
	}
)

export default apiClient
