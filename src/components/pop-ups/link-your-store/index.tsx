// @ts-nocheck
import React, { useState, useMemo, useContext, useEffect } from "react";
import {
	AlertPopup,
	AlertPopupHeader,
	AlertPopupBody,
	AlertPopupFooter,
	useModal,
	Button,
	InputField,
	FieldLabel,
	FieldGroup,
} from "@attrybtech/attryb-ui";
import { httpClient } from "../../../libs";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AuthContext } from "../../../auth/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { updateCredentials } from "../../../features/customer-configs/customer-configs-slice";
import { PLATFORMS } from "../../../utils/constants";
const { VITE_SERVER_BASE_URL: SERVER_BASE_URL,VITE_USER_ACTIVITY_LIBRARY_SCRIPT:LIBRARY_SCRIPT } = import.meta.env;
import "./index.css";

export default function LinkYourStorePopUp({ closePopUp, setIsShopifyCreditialsAdded }) {
	const [isCopied, setIsCopied] = useState(false);
	const [showScript, setShowScript] = useState(false);
	const [isScriptLoading, setIsScriptLoading] = useState<boolean>(true);
	const [shopName, setShopName] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [userSession, setUserSession] = useState<unknown>();

	const { accountId, containerId } = useAppSelector((state) => state.customerConfigs);
	const dispatch = useAppDispatch();
	const { user } = useContext(AuthContext);
	const { modalState, modalRef, exitModal, showModal } = useModal();

	const script = useMemo(
		() => `${LIBRARY_SCRIPT}
			<script> startTracking("${accountId}", "${containerId}");</script>`,
		[accountId, containerId]
	);

	const copyTopClipBoard = () => {
		navigator.clipboard.writeText(script);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 500);
	};
	const handleFocus = (event: { target: { select: () => any } }) => event.target.select();
	const handleGenerateButton = async () => {
		try {
			setShowScript(true);
			//Need to update payload
			dispatch(
				updateCredentials({
					shopName,
					accessToken,
				})
			);
			if (user) {
				const payload = {
					shopName: shopName,
					shopAccessToken: accessToken,
					cmsPLATFORMS: PLATFORMS.shopify,
				};
				await httpClient.post(
					`${SERVER_BASE_URL}/containers/${containerId}/settings`,
					{},
					payload
				);

				setIsShopifyCreditialsAdded(true);
				setTimeout(() => {
					setIsScriptLoading(false);
				}, 500);
			}
		} catch (error) {
			setIsShopifyCreditialsAdded(false);
		}
	};

    const modalCancelHandler: () => void = () => {
        closePopUp(false)
		exitModal()
	} 

	return (
		<>
			<AlertPopup
				wrapperRef={modalRef}
				name={"Please Fill Store Details"}
				visibility={true}
				onBackdropClick={modalCancelHandler}
			>
				<AlertPopupHeader>Please Fill Store Details</AlertPopupHeader>
				<AlertPopupBody>
					<FieldGroup name="login-group">
						<label>Shop Name</label>
						<InputField
							name="shop-name"
							state={"default"}
							placeholder={"Enter your shop name"}
							preFilledValue={shopName}
							onChange={(event) => {
								setShopName(event.target.value);
							}}
						/>
						<label>Store Access Token</label>
						<InputField
							name="access-token"
							state={"default"}
							placeholder={"Enter your access token"}
							preFilledValue={accessToken}
							onChange={(event) => {
								setAccessToken(event.target.value);
							}}
						/>
					</FieldGroup>
					<>
						{showScript &&
							(!isScriptLoading ? (
								<div className="product_input-group">
									<div
										className="latest-changes-view-container"
										style={{ margin: 0 }}
									>
										<div className="changes-view">{script}</div>
									</div>

									<div className="input-group-button" onClick={copyTopClipBoard}>
										{isCopied ? (
											<svg
												aria-hidden="true"
												height={16}
												viewBox="0 0 16 16"
												version="1.1"
												width={16}
												data-view-component="true"
												className="octicon octicon-check js-clipboard-check-icon color-fg-success d-inline-block d-none"
											>
												<path
													fillRule="evenodd"
													d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
												/>
											</svg>
										) : (
											<svg
												aria-hidden="true"
												height={16}
												viewBox="0 0 16 16"
												version="1.1"
												width={16}
												data-view-component="true"
												className="octicon octicon-copy js-clipboard-copy-icon d-inline-block"
											>
												<path
													fillRule="evenodd"
													d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
												/>
												<path
													fillRule="evenodd"
													d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
												/>
											</svg>
										)}
									</div>
								</div>
							) : (
								<div className="loading-script-container">
									<span>Generating Script...</span>
									<Skeleton width={"100%"} height={"6.625rem"} />
								</div>
							))}
					</>
				</AlertPopupBody>
				<AlertPopupFooter>
                <Button
					onClick={() => {
						closePopUp(false);
					}}
					variant="subtle"
				>
					Cancel
				</Button>

				<Button
					onClick={handleGenerateButton}
					variant="solid"
					state={`${
						!shopName.length || !accessToken.length || showScript
							? "disabled"
							: "default"
					}`}
				>
					Generate
				</Button>
                </AlertPopupFooter>	
			</AlertPopup>
		</>
	);
}
