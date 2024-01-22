// @ts-nocheck
import React, { useEffect, useState, lazy, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import AppBrowserView from "../../components/app-browser"
import ConfigurationPanel from "../../components/panels/useCases-panel"
import { Feature, setFeaturesInStore } from "../../features/features-configurations/features-slice"
import "./index.sass"
import featureServices from "../../services/features"
import {
	updateConfigs,
	updateCredentials,
} from "../../features/customer-configs/customer-configs-slice"
import BottomNavigation from "../../components/Bottom-Navigation"
import {
	extractFontsFromMessageEvent,
	formatFeatureName,
	getProductIdFromHtml,
	messageEventHanlder,
	objectKeys,
} from "../../utils/helpers"
import { PRODUCT_NAME, PROFILE_STATUS, UNIVERSAL_USE_CASES } from "../../utils/constants"
import SettingsPanel from "../../components/panels/settings-panel"
import { getShopifyCredentials } from "../../services/settings"
import productService from "../../services/products"
import { updateProductInfo } from "../../features/products/product"
import { errorService } from "../../libs"
import { getDemoAccount } from "../../services/accounts"
import { AuthContext } from "../../auth/AuthContext"

const { VITE_AUTH_URL: AUTH_URL } = import.meta.env

import ProductPage from "../../product-components/product-page"

export interface FontFamily {
	_id: string
	value: string
	data?: object
}

const WebEditor: React.FC = () => {
	const { features } = useAppSelector((state) => state.features)
	const { accountId, containerId, domainName } = useAppSelector((state) => state.customerConfigs)
	const [isExpand, setIsExpand] = useState<boolean>(false)
	const [isSettingPanelDisplay, setIsSettingPanelDisplay] = useState<boolean>(false)
	const [isMobileViewPort, setIsMobileViewPort] = useState<boolean>(false)
	const [fonts, setFonts] = useState<FontFamily[]>([])
	const [isProductPage, setIsProductPage] = useState<boolean>(false)
	const [currentPage, setCurrentPage] = useState<string>("")
	const [currentIframeUrl, setCurrentIframeUrl] = useState<string>("")
	const [currentPoductUrl, setCurrentProductUrl] = useState<string>("")
	const [iframeLoading, setIframeLoading] = useState<boolean>(true)
	const [useCaseByType, setUseCaseByType] = useState<{ [key: string]: Feature[] }>({})
	const [templateVisible, setTemplateVisible] = useState<boolean>(false)
	const [isContentGenerated, setIsContentGenerated] = useState<boolean>(false)
	const [isShopifyCreditialsAdded, setIsShopifyCreditialsAdded] = useState<boolean>(false)
	const [showAccessTokenPopUp, setShowAccessTokenPopUp] = useState(false)
	const [brandName, setBrandName] = useState<string>("Brand")
	const [productId, setProductId] = useState<string>("")
	const [demoAccount, setDemoAccount] = useState()
	const dispatch = useAppDispatch()
	/**
	 * Extract account and container ID from params
	 */
	const params = new URLSearchParams(window.location.search)
	const accId: string | null = params.has("accountId") ? params.get("accountId") : null
	const cId: string | null = params.has("containerId") ? params.get("containerId") : null
	const domainNameFromQuery: string = params.get("url") || ""

	const { shopName, accessToken } = useAppSelector((state) => state.customerConfigs)

	let navigate = useNavigate()

	const authContext: { user: any, profileStatus:ProfileStatus, logout: (callback: any) => Promise<void> } = useContext(AuthContext)

	useEffect(()=>{
		authoriseUser()
	},[authContext])

	/**
	 * Not the efficent approach
	 * Figure out an alternative way to collpase the use-case-panel by default on mobile
	 */
	useEffect(() => {
		expnadViewOnMobile()
		window.addEventListener("resize", expnadViewOnMobile)
		return () => {
			window.removeEventListener("resize", expnadViewOnMobile)
		}
	}, [])

	useEffect(() => {
		segregateFeatures()
	}, [features])

	useEffect(() => {
		if (!accountId && !containerId && accId && cId) {
			dispatch(updateConfigs({ accountId: accId, containerId: cId }))
		}
	})

	useEffect(() => {
		setInitialFeatures()
	}, [])

	useEffect(() => {
		extractFontsFromMessageEvent((event: MessageEvent<any>) => {
			if (event.data.messageType === "font list") {
				const fontArr = event.data.data
				if (fontArr.length) {
					setFonts(
						fontArr.map((value: FontFamily, idx: number) => {
							return {
								_id: idx.toString(),
								value,
								data: {
									_id: idx.toString(),
									value,
								},
							}
						})
					)
				}
			}
		})
	}, [])

	useEffect(() => {
		identifyProductPage()
	}, [])

	useEffect(() => {
		setShopifyInitialCredentials()
	}, [])

	useEffect(() => {
		initialProductId()
	}, [currentPoductUrl, isProductPage])

	useEffect(()=>{
		window.addEventListener(
			"message",
			(event:MessageEvent<any>) => {
				try {
					if (event?.data && event.data?.messageType === "product-data") {
						dispatch(updateProductInfo(event?.data?.data))
					}
				} catch (error) {
				}
			},
			false
		)
	},[])

	const authoriseUser = async () =>{
		const dAcc =  await getDemoAccount()
		if(accId !== dAcc?._id && authContext?.profileStatus !== PROFILE_STATUS.loading && !authContext?.user){
			window.location.href = `${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`;
		}
		setDemoAccount(dAcc)
	}

	const initialProductId = async () => {
		if (currentPoductUrl && isProductPage) {
			const response: any = await productService.getProductPageHtml(currentPoductUrl)
			if (response?.data) setProductId(getProductIdFromHtml(response.data))
		}
	}

	const setShopifyInitialCredentials = async () => {
		const credentials = await getShopifyCredentials(containerId || cId)
		if (credentials) {
			dispatch(
				updateCredentials({
					shopName: credentials.name,
					accessToken: credentials.apiKey,
				})
			)
		}
	}

	const identifyProductPage = () => {
		messageEventHanlder((event: MessageEvent<any>) => {
			if (event.data?.messageType === "product-page-identifier") {
				setIsProductPage(event.data.data.isProductPage)
				setCurrentPage(event.data.data?.page)
				setCurrentIframeUrl(event.data.data?.pathname)

				if (event.data?.data?.isProductPage) {
					const baseURL = domainName || domainNameFromQuery
					const brandFromDomain = baseURL.replace(/.+\/\/|www.|\..+/g, '')
					setBrandName(brandFromDomain)
					setCurrentProductUrl(`${baseURL}${event.data.data?.pathname}`)
				}
			}
		})
	}

	const expnadViewOnMobile = () => {
		if (window.innerWidth <= 768) {
			setIsExpand(true)
			setIsMobileViewPort(true)
		} else setIsMobileViewPort(false)
	}

	const setInitialFeatures = async () => {
		try {
			const resp: Feature[] = await featureServices.getFeatures(
				accountId || accId,
				containerId || cId
			)
			
			if(!resp.length){
				throw new Error("Invalid URL")
			}
	
			dispatch(
				setFeaturesInStore([
					...resp.sort((a, b) => {
						// check which is enabled a or b, sort that first
						if (a.isEnabled) return -1
						else if (b.isEnabled) return 1
						return 0
					})
				])
			)
		} catch (error) {
			navigate("/home")
			errorService.reportError(error)
		}
		
	}

	const handleToggleBrowserView = () => {
		setIsExpand(!isExpand)
	}

	const handleToggleSettingPanel = (toggle: boolean): void => {
		setIsSettingPanelDisplay(toggle)
	}

	const handleLayout = () => {
		if (isMobileViewPort) {
			if (!isExpand) setIsExpand(true)
			if (isSettingPanelDisplay) setIsSettingPanelDisplay(false)
		}
	}

	const segregateFeatures = () => {
		const useCaseByTypeCopy: { [key: string]: Feature[] } = {}
		if (features) {
			for (const feature of features) {
				if (feature.useCaseType) {
					if (!(feature.useCaseType in useCaseByTypeCopy)) {
						useCaseByTypeCopy[feature.useCaseType] = [feature]
					} else {
						useCaseByTypeCopy[feature.useCaseType] = [
							...useCaseByTypeCopy[feature.useCaseType],
							feature,
						]
					}
				}
			}
			setUseCaseByType(useCaseByTypeCopy)
		}
	}

	return (
		<>
			<div className="web-editor-main-wrapper">
				{!isExpand && (
					<ConfigurationPanel
						handleToggleSettingPanel={handleToggleSettingPanel}
						handleToggleBrowserView={handleToggleBrowserView}
						isProductPage={isProductPage}
						currentPage={currentPage}
						useCaseByType={useCaseByType}
						iframeLoading={iframeLoading}
						templateVisible={templateVisible}
						setTemplateVisible={setTemplateVisible}
					/>
				)}
				<div
					className={`settings-panel-container ${
						isSettingPanelDisplay && "-display-panel"
					} `}
				>
					<SettingsPanel
						handleClosePanelClick={() => handleToggleSettingPanel(false)}
						handleLayout={handleLayout}
						fonts={fonts}
						iframeLoading={iframeLoading}
						setIframeLoading={setIframeLoading}
					/>
				</div>
				<div className={`web-editor-container ${isExpand ? "--expanded" : "--collapsed"}`}>
					<AppBrowserView
						isExpand={isExpand}
						handleToggleBrowserView={handleToggleBrowserView}
						isSettingPanelDisplay={isSettingPanelDisplay}
						handleToggleSettingPanel={handleToggleSettingPanel}
						handleLayout={handleLayout}
						iframeLoading={iframeLoading}
						setIframeLoading={setIframeLoading}
						setIsShopifyCreditialsAdded={setIsShopifyCreditialsAdded}
						showAccessTokenPopUp={showAccessTokenPopUp}
						setShowAccessTokenPopUp={setShowAccessTokenPopUp}
					/>
				</div>

				<div
					className={`product-page-contaianer ${
						templateVisible && "--product-page-visible"
					}`}
				>
					{templateVisible && (

							<ProductPage
								setTemplateVisible={setTemplateVisible}
								currentIframeUrl={currentIframeUrl}
								isContentGenerated={isContentGenerated}
								setIsContentGenerated={setIsContentGenerated}
								isShopifyCreditialsAdded={isShopifyCreditialsAdded}
								showAccessTokenPopUp={showAccessTokenPopUp}
								setShowAccessTokenPopUp={setShowAccessTokenPopUp}
								initialBrandName={brandName}
								productId={productId}
							/>

					)}
				</div>

				<BottomNavigation
					handleToggleBrowserView={handleToggleBrowserView}
					handleLayoutClick={handleLayout}
				/>
			</div>
		</>
	)
}

export default WebEditor