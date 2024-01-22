import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import SettingsPanel from "../panels/settings-panel"
import { Toolbar } from "../header-toolbar"
import LoadingScreen  from "../loading"
import "./index.sass"
const {VITE_PROXY_SERVER_BASE_URL:PROXY_SERVER_BASE_URL} = import.meta.env

interface Props {
	isExpand: boolean
	handleToggleBrowserView: () => void
	isSettingPanelDisplay: boolean
	handleToggleSettingPanel: (toggle: boolean) => void
	handleLayout: () => void
	iframeLoading: boolean
	setIframeLoading: React.Dispatch<React.SetStateAction<boolean>>
	setIsShopifyCreditialsAdded: React.Dispatch<React.SetStateAction<boolean>>
	showAccessTokenPopUp:boolean
	setShowAccessTokenPopUp:React.Dispatch<React.SetStateAction<boolean>>
}

export interface Viewport {
	_id: string
	value: string
	data?: object
}

const VIEWPORTS: Viewport[] = [
	{ _id: "desktop", value: "Desktop" },
	{ _id: "tablet", value: "Tablet" },
	{ _id: "mobile", value: "Mobile" },
]

const AppBrowserView: React.FC<Props> = ({
	isExpand,
	handleToggleBrowserView,
	isSettingPanelDisplay,
	handleToggleSettingPanel,
	handleLayout,
	iframeLoading,
	setIframeLoading,
	setIsShopifyCreditialsAdded,
	showAccessTokenPopUp,
	setShowAccessTokenPopUp
}) => {
	const [selectedViewport, setSelectedViewport] = useState<Viewport>(VIEWPORTS[0])

	const { domainName, accountId, containerId } = useAppSelector((state) => state.customerConfigs)

	let navigate = useNavigate()

	const params = new URLSearchParams(window.location.search)
	const domainNameFromQuery: string | null = params.has("url") ? params.get("url") : null

	if (!domainNameFromQuery && !domainName) navigate("/")

	const url = domainName || domainNameFromQuery

	const handleSelectViewport = (item: Viewport) => {
		setSelectedViewport(item)
	}

	return (
		<main className="container-main">
			<div className="app-browser" id="app-browser">
				<Toolbar
					isExpand={isExpand}
					onClick={handleToggleBrowserView}
					selectedViewport={selectedViewport}
					VIEWPORTS={VIEWPORTS}
					handleSelectViewport={handleSelectViewport}
					setIsShopifyCreditialsAdded={setIsShopifyCreditialsAdded}
					showAccessTokenPopUp={showAccessTokenPopUp}
					setShowAccessTokenPopUp={setShowAccessTokenPopUp}
				/>

				<div className="app-browser-viewport">
					<div className="frame-container">
						{iframeLoading && (
							<LoadingScreen />
						)}
						{accountId && containerId && (
							<iframe
								src={`${PROXY_SERVER_BASE_URL}/?url=${url}&accountId=${accountId}&containerId=${containerId}`}
								id="app-browser-frame"
								sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"
								onLoad={() => setIframeLoading(false)}
								style={iframeLoading ? { opacity: 0, flex: 0, display:"none" } : { opacity: 1,display:"block" }}
								className={`iframe ${selectedViewport._id}`}
							></iframe>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}

export default AppBrowserView
