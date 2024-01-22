import React, { useContext,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AppLoader from "../../components/app-Loader"
import { PRODUCT_NAME, PROFILE_STATUS } from "../../utils/constants"
import { AuthContext } from "../../auth/AuthContext"
const { VITE_STATIC_PAGES_URL: STATIC_PAGES_URL } = import.meta.env

const Authenticator = () => {
	let navigate = useNavigate()
	const authContext: { user: any, profileStatus: ProfileStatus } = useContext(AuthContext)

    useEffect(() => {
        if (!authContext?.user && (PROFILE_STATUS.loading !== authContext?.profileStatus)) {
            window.location.href = `${STATIC_PAGES_URL}/web-personalization`
        }
		else if((PROFILE_STATUS.loading !== authContext?.profileStatus)) {
			navigate("/use-cases")
		}
    }, [authContext])
    
	return (
		<>
			<AppLoader />
		</>
	)
}

export default Authenticator
