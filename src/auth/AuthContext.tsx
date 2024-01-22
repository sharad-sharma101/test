// @ts-nocheck
import React, { useState, createContext, useEffect } from "react"
import { Auth } from 'aws-amplify'
import {errorService, httpClient} from "../libs"
import { PLATFORMS, PROFILE_STATUS } from "../utils/constants";
import { getCustomers } from "../services/payments";
import { getAccount } from "../services/accounts";
import { getContainers , getEnableStatus, patchContainerEnabledState, patchContainerSelectedState, verifyAppInstalled } from "../services/containers";
import { useAppDispatch } from "../app/hooks";
import { setCurrentDomainHeader } from "../features/globalConfigs/global-slice";
import { redirectToAuth } from "./utils";
import AppLoader from "../components/app-Loader";
import { setContainerObjectInRedux } from "../features/user-configs/user-configs-slice";
import { extractCompanyNameFromDomain } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
const {
    VITE_SERVER_BASE_URL:SERVER_BASE_URL
} = import.meta.env
const AuthContext: any = createContext();

const Authenticator = (props) => {
	const [user, setUser] = useState(null)
	const [userId, setUserId] = useState('')
	// profileStatus = loading | signIn | signOut
	const [profileStatus, setProfileState] = useState<ProfileStatus>(PROFILE_STATUS.loading)
	const [isCustomerSubscribed, setIsCustomerSubscribed] = useState(false);
	const [containerId, setContainerId] = useState('');
	const [accountId, setAccountId] = useState('');
	const [containerData,setContainerData]=useState({})
	const [loadingState, setloadingState] = useState(true)
	const [allContainers,setAllContainers]=useState([])
	const [isOnboardingCompleted,setIsOnBoardingCompleted]=useState(false)
	const dispatch=useAppDispatch()
	const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
	const platform = params.get("platfrom");
	const installed = params.get("installed");
	const navigate=useNavigate()

	const [userProfile,setUserProfile]=useState({})

    const fetchCustomerData = async () => {
	
			try {
				const customer = await getCustomers();
				setUserProfile(customer)
				return customer
	
			} catch (error) {
				console.log(error);
			}
		
	};
	
	useEffect(() => {
		setCurrentUser()
		
	}, [])

	useEffect(() => {
		if(userId)
			fetchAccount();
	}, [userId , user])

	useEffect(() => {
	if(user)
		fetchCustomer();
	  }, [user, profileStatus,userProfile]);

	useEffect(()=>{
	if(accountId)
		fetchContainerId()
	}, [accountId]);

	const fetchCustomer = async () => {
		if( profileStatus === PROFILE_STATUS.signIn ){
			try {
				const customer =userProfile.customer;
				if (customer && Object.keys(customer).length > 0) {
				setIsCustomerSubscribed(true);
	
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const fetchAccount = async () => {
		try{
			const accountObject = await getAccount(`userId=${userId}`);
			
			if(accountObject.length === 0) {
				const {email} = user.idToken.payload;
				const account: any = await httpClient.post(
					`${SERVER_BASE_URL}/accounts`,
					{},
					{
						// extract compnay name from domains
						companyName: extractCompanyNameFromDomain(shop || ""),
						email,
						userId,
					}
				);
			    setAccountId(account.data.data._id);	
			} else {
				setAccountId(accountObject[0]?._id || '');
			}
		}catch(e){
			console.log('Error fetching the accountId', e);
		}
	};

	

	const setCurrentUser = async () => {
		try {
			setloadingState(true)
			const cognitoUser = await Auth.currentAuthenticatedUser();
			if(cognitoUser){
				setUser(cognitoUser.signInUserSession)
				setUserId(cognitoUser.signInUserSession.idToken?.payload["cognito:username"])
				if (cognitoUser.signInUserSession){ 
					setProfileState(PROFILE_STATUS.signIn) 
				}
			}
			else {
				setProfileState(PROFILE_STATUS.signOut) 
			}
			setloadingState(false)
		} catch (error) {
			redirectToAuth(window.location.href)
			setProfileState(PROFILE_STATUS.signOut) 
		}
	}
	
	const logout = async (callback) => {
		try {
			await Auth.signOut();
			callback()
		} catch (error) {
			errorService.reportError(error)
     }
    }

	async function fetchContainerId() {
		if(userId&&accountId){
			let [containerObject, customerObject] = await Promise.all([
				getContainers(`accountId=${accountId}&userId=${userId}`),
				fetchCustomerData(),
			  ]);

			let updatedContainer;
			const getOutputStatus=(containerObject)=>{
				if(containerObject?.length==0&&containerObject[0]?.domainName=="")return true
				if(containerObject?.length==0)return true

			}

			
			if(shop){
				let found=true
				for(let el of containerObject){

					if(el.isSelected&&el.domainName==""){
					let container=	await patchContainerSelectedState(el._id,{domainName:shop,isSelected:true,accountId:el.accountId})
				
					updatedContainer=container.data.data
	
					containerObject=[updatedContainer]


					}
					else if(el.domainName!==shop&&el.domainName!==""){
						
						found=false
					}
				}
				if(!found||containerObject.length==0){
					const {email} = user.idToken.payload;
					let bodyObj={
						
							domainName: shop ? (shop?.charAt(shop.length - 1) === "/" ? shop?.slice(0, -1) : shop) :"",
							email,
							accountId,
							userId,
							settings: [{
								"platform" : platform ? platform : "",
								"scriptEnable" : false,
								"scriptInjected" : installed ? installed : false,
							}],
							isEnabled:true,
							
						
					}
					if(getOutputStatus()!==undefined){
						bodyObj.isSelected=getOutputStatus()
					}
					const container: any = await httpClient.post(
						`${SERVER_BASE_URL}/containers`,
							{},bodyObj
							
						);

						updatedContainer=container.data.data
						
							containerObject=[...containerObject,updatedContainer]
						
						
					
			
				}
			}else{
				if(containerObject.length==0){
					const {email} = user.idToken.payload;
				try{
					let bodyObj={
						
						domainName: shop ? (shop?.charAt(shop.length - 1) === "/" ? shop?.slice(0, -1) : shop) :"",
						email,
						accountId,
						userId,
						settings: [{
							"platform" : platform ? platform : "",
							"scriptEnable" : false,
							"scriptInjected" : installed ? installed : false,
						}],
						isEnabled:true,
						
					
				}
				if(getOutputStatus()!==undefined){
					bodyObj.isSelected=getOutputStatus()
				}
				const container: any = await httpClient.post(
					`${SERVER_BASE_URL}/containers`,
						{},
						bodyObj
					);
					
					updatedContainer = container?.data?.data;
					
					containerObject=[...containerObject,updatedContainer]
					}catch (error) {
						errorService.reportError(error)
					}
				}
			}

			
			let checksDone=false
			for(let el of containerObject){
				if(el.isSelected){
					setContainerId(el._id)
					setContainerData(el)

					dispatch(setContainerObjectInRedux([el]))
					const domainName = el?.domainName === "" ? 'https://personalizationappstore.myshopify.com/' : el?.domainName
					if(domainName.startsWith("https://")==false){
						dispatch(setCurrentDomainHeader(`https://${domainName}`))

					}else{
						dispatch(setCurrentDomainHeader(domainName))
					}
					let statusOfTheAppInstall:any=await verifyAppInstalled(`shop=${el?.domainName}`)
					if(statusOfTheAppInstall?.data?.data?.isConnected&&el?.settings[0]?.scriptEnable&&el?.settings[0]?.scriptInjected&&containerObject?.length!==0&&Object.keys(customerObject?.customer)?.length!==0&&!customerObject?.subscription?.cancel_at){

					   checksDone=true
					   break;
				   }
					
				}
			}

			setAllContainers(containerObject)
			if(!checksDone){
				if(window.location.pathname==("/")){			   
					navigate("/getting-started")
	  
				}
			}else{
				if(window.location.pathname==("/")){			   
					navigate("/use-cases")
	  
				}
			}
		}

	}

	return (
		<AuthContext.Provider value={{isOnboardingCompleted,userProfile,allContainers,user, logout, profileStatus, userId, accountId, containerId, setContainerId, isCustomerSubscribed,containerData, fetchContainerId }}>{loadingState ? <AppLoader/> : props.children}</AuthContext.Provider>
	)
}

export { Authenticator, AuthContext }

