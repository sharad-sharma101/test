import { getErrorMessage } from "./utils"

class ErrorService {

	reportError(error:unknown) {
		const errorMessage = getErrorMessage(error)
		return errorMessage
	}

}


export default ErrorService