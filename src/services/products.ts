import { httpClient, errorService } from "../libs"
const {
    VITE_PROXY_SERVER_BASE_URL:PROXY_SERVER_BASE_URL
} = import.meta.env

const getProductPageHtml = async (url:string) => {
    try {
        const response =  await httpClient.get(`${PROXY_SERVER_BASE_URL}?url=${url}`, {
            withCredentials: true,
        })
        return response
    } catch (error) {
        errorService.reportError(error)
    }
}
const productService = { getProductPageHtml }
export default productService