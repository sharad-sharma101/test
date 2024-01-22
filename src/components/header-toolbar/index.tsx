// @ts-nocheck
import React, { useMemo, useState, useContext, useEffect } from "react"
import MaximizeIcon from "../../assets/images/maximize.svg"
import MinimizeIcon from "../../assets/images/minimize.svg"
import { Viewport } from "../app-browser"
import { List, ListItem, Button, AlertPopup } from "@attrybtech/attryb-ui"

import OutSideClickWrapper from "../../product-components/common-components/outside-click-wrapper"
import { AuthContext } from "../../auth/AuthContext"
import { useAppSelector } from "../../app/hooks"
import "./index.sass"
import LinkYourStorePopUp from "../pop-ups/link-your-store"

interface Props {
	isExpand: boolean
	onClick: () => void
	selectedViewport: Viewport
	VIEWPORTS: Viewport[]
	handleSelectViewport: (item: Viewport) => void
	setIsShopifyCreditialsAdded: React.Dispatch<React.SetStateAction<boolean>>
	showAccessTokenPopUp: boolean
	setShowAccessTokenPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

export const Toolbar: React.FC<Props> = ({
	isExpand,
	onClick,
	selectedViewport,
	VIEWPORTS,
	handleSelectViewport,
	setIsShopifyCreditialsAdded,
	showAccessTokenPopUp,
	setShowAccessTokenPopUp,
}) => {
	const { user } = useContext(AuthContext)
	const { accessToken, shopName } = useAppSelector((state) => state.customerConfigs)

	const toolbarLabel = useMemo(() => (isExpand ? "Collapse" : "Expand"), [isExpand])
	const Icon = useMemo(() => (isExpand ? MinimizeIcon : MaximizeIcon), [isExpand])

	const hideAccessTokenPopUp = () => {
		setShowAccessTokenPopUp(false)
	}

	return (
		<React.Fragment>
			{showAccessTokenPopUp ? (
				<LinkYourStorePopUp
					setIsShopifyCreditialsAdded={setIsShopifyCreditialsAdded}
					closePopUp={setShowAccessTokenPopUp}
				></LinkYourStorePopUp>
			) : null}
			<div className="app-browser-toolbar">
				<div className="browser-toolbar-head left">
					<span className="AppBrowser-title">Demo</span>
					<List
						list={[...VIEWPORTS]}
						activeItem={selectedViewport}
						buttonPlaceholder="Select"
						selectCallback={handleSelectViewport}
					>
						{[...VIEWPORTS].map((item) => {
							return (
								<ListItem key={item._id} data={item}>
									{item.value}
								</ListItem>
							)
						})}
					</List>
				</div>
				<div className="browser-toolbar-head right">
					{(user && !accessToken ) && (
						<Button
							onClick={() => {
								setShowAccessTokenPopUp(true)
							}}
							variant="solid"
						>
							Link Your Store
						</Button>
					)}
					<button className="AppBrowser-expand" onClick={onClick}>
						<>
							{(!user && accessToken) && (
								<span className="AppBrowser-expandLabel AppBrowser-expandLabel--expanded">
									{toolbarLabel}
								</span>
							)}
							<span className="AppBrowser-expandIcon">
								<img src={Icon} alt="maximize icon" />
							</span>
						</>
					</button>
				</div>
			</div>
		</React.Fragment>
	)
}