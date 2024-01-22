import React, { ReactElement, useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
	Feature,
	getSelectedFeature,
	toggleFeatureSelected,
} from "../../../features/features-configurations/features-slice"
import "./index.sass"
import Button from "../../Button"
import {
	FeatureSetting,
	getFeatureSettings,
	resetFeatureSettings,
	updateFeatureContent,
	updateFeatureMetaSettings,
} from "../../../features/customer-configs/feature-settings-slice"
import { updateFeatureCssSettings, updateFeatureMeta } from "../../../services/settings"
import {
	disableElementSelector,
	enableElementSelector,
	formatFeatureContent,
	formatFeatureName,
	getContentOfHtml,
	getStyle,
	messageEventHanlder,
	objectKeys,
	postCssChangesInRealTime,
	reloadAppBrowser,
	revertFeature,
	updateContentOfFeature,
} from "../../../utils/helpers"
import Accordion from "../../Accordion"
import InputWithLabel from "./Input-with-label"
import CloseIcon from "../../../assets/images/x-black.svg"
import BackIcon from "../../../assets/images/chevron-right--black.svg"
import { errorService } from "../../../libs"
import { updateFeatureSettings } from "../../../features/customer-configs/feature-settings-slice"
import featureServices from "../../../services/features"
import {
	FEATURE_NAMES,
	PRODUCT_PAGE_USE_CASES,
	UNIVERSAL_USE_CASES,
	USE_CASE_DATA_VARIABLES,
} from "../../../utils/constants"
import DialogBox from "../../dialog-box"
import { TextArea } from "../../textarea"
import { InputBox } from "./input-box/input-box"

import {
	AlertPopup,
	AlertPopupHeader,
	AlertPopupBody,
	AlertPopupFooter,
	Button as ButtonComponent,
	useModal,
	List,
	ListItem,
} from "@attrybtech/attryb-ui"
import { FontFamily } from "../../../pages/WebEditor/WebEditor"
import {
	createVersion,
	getFirstVersion,
	getLatestVersion,
	getPreviousVersion,
	resetVersion,
} from "../../../features/feature-versions/feature-version-slice"
import { PlaceElementButton } from "./place-element"

interface Props {
	handleClosePanelClick: () => void
	handleLayout: () => void
	fonts?: FontFamily[]
	iframeLoading: boolean
	setIframeLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface UnitObject {
	value: string
	name: string
}

const SettingsPanel: React.FC<Props> = ({
	handleClosePanelClick,
	handleLayout,
	fonts = [],
	iframeLoading,
	setIframeLoading,
}) => {
	const [feature, setFeature] = useState<Feature | null>(null)
	const [featureSettings, setFeatureSettings] = useState<FeatureSetting | null>(null)
	const [featureContent, setFeatureContent] = useState<string>("")
	const [font, setFont] = useState<FontFamily>({ _id: "", value: "", data: {} })
	const [xPath, setXpath] = useState<string>("")
	const selectedFeature = useAppSelector(getSelectedFeature)
	const activeFeatureSettings = useAppSelector(getFeatureSettings)

	const [dialogType, setDialogType] = useState<
		string | "revert-action" | "save-changes" | "factory-reset"
	>("revert-action")
	const [isDialogBoxOpen, setIsDialogBoxOpen] = useState<boolean>(false)
	const [message, setMessage] = useState("")
	const [modalTitle, setModalTitle] = useState("")
	const [isConfigChanged, setIsConfigChanged] = useState<{ [key: string]: boolean }>({})
	const [textareaError, setTextareaError] = useState<{ message: string }>({ message: "" })
	const [featureMetaData, setFeatureMetaData] = useState<{ [key: string]: string }>({})
	const [featureVariableArr, setFeatureVarArr] = useState<{ name: string; label: string }[]>([])
	const dispatch = useAppDispatch()
	const { modalState, modalRef, exitModal, showModal } = useModal()
	const [productData, setProductData]=useState<ProductInfo>({totalProductsSold:"",location:"",productsLeftInStock:""})

	const productInfo = useAppSelector((state) => state.productInfo)
	const [selectedFontFamily, setSelectedFontFamily] = useState<string>(getStyle(
		selectedFeature?.rules[0].then[0]?.params?.webComponent || "",
		"font-family"
	))
	
	useEffect(()=> {
		setSelectedFontFamily(getStyle(
			selectedFeature?.rules[0].then[0]?.params?.webComponent || "",
			"font-family"
		))
	},[selectedFeature])

	useEffect(()=>{
		if(fonts.length && selectedFontFamily){
			const enabledFont = fonts.filter((f)=> f.value === selectedFontFamily)[0]
			if(enabledFont?.value)
				setFont(enabledFont)
		}
	},[fonts, selectedFontFamily])

	useEffect(()=>{
		setProductData(productInfo)
	},[productInfo])

	useEffect(() => {
		if (feature && selectedFeature) {
			switch (feature.name) {
				case FEATURE_NAMES.firstTimeVsRepeatUser:
					setFeatureVarArr([{ name: "variable", label: "variable" }])
					break

				case FEATURE_NAMES.freeShipping:
					setFeatureVarArr([
						{ name: "freeShippingThresholdAmount", label: "Shipping Threshold" },
					])
					break

				default:
					setFeatureVarArr([])
					break
			}
		}
	}, [feature, selectedFeature])

	useEffect(() => {
		switch (feature?.name) {
			case "Scarcity_Signals":
				setMessage("enable-element-placement-selector")
				break

			case "Location_Based_Widget":
				setMessage("enable-element-move")
				break
		}
	}, [feature, selectedFeature])

	useEffect(() => {
		updatemodalTitle()
	}, [dialogType])

	useEffect(() => {
		if (feature) {
			getXpathOfElementFromMessage()
			getXandYofElement()
		}
	}, [feature])

	useEffect(() => {
		if (activeFeatureSettings !== null) {
			setFeatureSettings(activeFeatureSettings)
			if (activeFeatureSettings.css["font-family"] && fonts.length) {
				const selectedFont = activeFeatureSettings.css["font-family"]
				setFont(fonts.filter((item, idx) => item.value === selectedFont)[0])
				setSelectedFontFamily(selectedFont)
			}
			if (activeFeatureSettings.content) setFeatureContent(activeFeatureSettings.content)
		} 
	}, [activeFeatureSettings, selectedFeature, feature])

	useEffect(() => {
		setFeature(selectedFeature)
		if (selectedFeature && !(activeFeatureSettings && activeFeatureSettings.meta)) {
			setFeatureMetaData(selectedFeature.meta)
		}
	}, [selectedFeature])

	useEffect(() => {
		if (feature) {
			const content = getContentOfHtml(feature.rules[0].then[0]?.params?.webComponent).trim()
			dispatch(
				updateFeatureContent({
					_id: feature?._id,
					content,
				})
				
			)
			setFeatureContent(content)
		}
	}, [feature])

	const modalCancelHandler: () => void = () => {
		exitModal()
	}

	const updatemodalTitle = () => {
		switch (dialogType) {
			case "revert-action":
				setModalTitle("Revert Changes")
				return

			case "save-changes":
				setModalTitle("Review Changes")
				return

			case "factory-reset":
				setModalTitle("Reset Usecase Configuration")
				return
			default:
				setModalTitle("")
				break
		}
	}

	const getXpathOfElementFromMessage = () => {
		messageEventHanlder((event: MessageEvent<any>) => {
			if (
				event.data?.messageType === "xPath-of-element" &&
				feature &&
				feature.name === FEATURE_NAMES.scarcitySignals
			) {
				const css = event.data.data.css
				dispatch(
					updateFeatureSettings({
						_id: feature?._id,
						key: "top",
						value: css.top,
					})
				)
				dispatch(
					updateFeatureSettings({
						_id: feature?._id,
						key: "right",
						value: css.right,
					})
				)
				dispatch(
					updateFeatureSettings({
						_id: feature?._id,
						key: "position",
						value: css.position,
					})
				)

				setXpath(event.data.data.xPath.xPath)
				setFeatureMetaData({ ...featureMetaData, xPath:event.data.data.xPath.xPath, fullXpath:event.data.data.xPath.fullXPath })
				setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })
			}
		})
	}

	const getXandYofElement = () => {
		messageEventHanlder(async (event: MessageEvent<any>) => {
			if (
				event.data?.messageType === "coordinates-of-the-element" &&
				feature &&
				feature.name === FEATURE_NAMES.locationBasedWidget
			) {
				const messageCss = event.data.data.css
				dispatch(
					updateFeatureSettings({
						_id: feature._id,
						key: "top",
						value: messageCss.top,
					})
				)
				if(messageCss.left){
					dispatch(
						updateFeatureSettings({
							_id: feature._id,
							key: "left",
							value: messageCss.left,
						})
					)
					dispatch(
						updateFeatureSettings({
							_id: feature._id,
							key: "right",
							value: "unset",
						})
					)
				}
				else if(messageCss.right){
					dispatch(
						updateFeatureSettings({
							_id: feature._id,
							key: "right",
							value: messageCss.right,
						})
					)
					dispatch(
						updateFeatureSettings({
							_id: feature._id,
							key: "left",
							value: "unset",
						})
					)
				}

				setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })
			}
		})
	}

	const handleFeatureSettingSave = async () => {
		try {
			if (objectKeys(featureMetaData).length && feature) {
				const featureMetaDataCopy = { ...featureMetaData }
				if (xPath) {
					featureMetaDataCopy.xPath = xPath
				}
				await updateFeatureMeta(feature._id, {
					...featureMetaDataCopy,
				})
			}
			if (feature && feature?._id) {
				dispatch(
					updateFeatureContent({
						_id: feature?._id,
						content: featureContent,
					})
				)
				setIsConfigChanged({ ...isConfigChanged, [feature.name]: false })
			}
			if (featureSettings !== null && feature) {
				await updateFeatureCssSettings({ ...featureSettings, content: featureContent })
				dispatch(resetVersion({ _id: feature?._id, version: { ...featureSettings.css } }))
				handleLayout()
			}

			reloadAppBrowser()
		} catch (error) {
			errorService.reportError(error)
		}
	}

	const handleFeatureReset = async () => {
		try {
			if (feature !== null) {
				await featureServices.resetFeature(feature)
				setIsConfigChanged({ ...isConfigChanged, [feature.name]: false })
				reloadAppBrowser()
				if (featureSettings) setFeatureContent(featureSettings?.content || "")
			}
		} catch (error) {
			errorService.reportError(error)
		}
	}

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (feature?._id) {
			const value = e.target.value
			/**
			 * USE_CASE_DATA_VARIABLES is segeration of data variables by their use cases
			 * we are usign data variables to display the dyanmic data in the content of the use case
			 */
			const useCaseVars = USE_CASE_DATA_VARIABLES[feature.name]
			for (const varOfUseCase of useCaseVars) {
				/**
				 * in our use cases we have stored the data variables as :- ${variable_name}
				 * here we are matching the textarea value on every onChange event and checking if the our data variables are present in the current value
				 */
				let regex = new RegExp("\\${(" + varOfUseCase.slice(2).slice(0, -1) + ")}", "g")
				const isVariableExists = regex.test(value)
				/**
				 * if data variable are not present in current value of textarea then we will not allow user to edit content of the area
				 */
				if (!isVariableExists) {
					setTextareaError({ message: `${varOfUseCase} is an immutable variable` })
					e.preventDefault()
					return
				}
			}
			updateContentOfFeature({ _id: feature._id, content: value, meta: featureMetaData,productData })
			setTextareaError({ message: "" })
			setFeatureContent(value)
			setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })
		}
	}

	const handleFeatureFontChange = (item: FontFamily) => {
		const value = item.value
		setFont(item)
		setSelectedFontFamily(item.value)
		if (feature !== null) {
			postCssChangesInRealTime(feature, "font-family", value)
			dispatch(
				updateFeatureSettings({
					_id: feature?._id,
					key: "font-family",
					value,
				})
			)
			dispatch(
				createVersion({
					_id: feature._id,
					version: {
						"font-family": value,
					},
				})
			)
			setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })
		}
	}

	const revertFeatureSetting = () => {
		if (feature && feature?._id) {
			if (feature.name === FEATURE_NAMES.scarcitySignals) {
				reloadAppBrowser()
				return
			}
			const previousVersion = getFirstVersion({ _id: feature._id })
			dispatch(resetFeatureSettings({ _id: feature?._id }))
			dispatch(toggleFeatureSelected(feature._id))
			if (featureSettings && featureSettings.content)
				setFeatureContent(featureSettings?.content)
			setIsConfigChanged({ ...isConfigChanged, [feature.name]: false })

			revertFeature({
				feature: feature,
				meta: {},
				css: previousVersion,
			})
			reloadAppBrowser()
		}
	}

	const handleCloseDialogBox = () => {
		setIsDialogBoxOpen(false)
		exitModal()
	}

	const handleDialogBoxOpen = (dialogType: string) => {
		setDialogType(dialogType)
		// setIsDialogBoxOpen(true)
		showModal()
	}

	const handleFeaureVariableChange = (
		e: React.ChangeEvent<HTMLInputElement> | null,
		unitObject: UnitObject | undefined = {
			value: "",
			name: "",
		}
	) => {
		const { value, name: key } = e ? e.target : unitObject
		setFeatureMetaData({ ...featureMetaData, [key]: value })
		if (feature && feature._id) {
			dispatch(
				updateFeatureMetaSettings({
					_id: feature._id,
					meta: { ...featureMetaData, [key]: value },
				})
			)
			setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })

			updateContentOfFeature({
				_id: feature._id,
				content: featureContent,
				meta: { ...featureMetaData, [key]: value },
				productData
			})
		}
	}

	const renderModalFooter: React.FC = () => {
		const dialogFooter = () => {
			switch (dialogType) {
				case "revert-action":
					return (
						<>
							<AlertPopupFooter>
								<ButtonComponent onClick={modalCancelHandler} variant="link">
									Cancel
								</ButtonComponent>
								<ButtonComponent
									onClick={() => {
										revertFeatureSetting()
										handleCloseDialogBox()
									}}
								>
									Okay
								</ButtonComponent>
							</AlertPopupFooter>
						</>
					)

				case "save-changes":
					return (
						<>
							<AlertPopupFooter>
								<ButtonComponent onClick={modalCancelHandler} variant="link">
									Cancel
								</ButtonComponent>
								<ButtonComponent
									onClick={() => {
										handleFeatureSettingSave()
										handleCloseDialogBox()
									}}
								>
									Okay
								</ButtonComponent>
							</AlertPopupFooter>
						</>
					)

				case "factory-reset":
					return (
						<>
							<AlertPopupFooter>
								<ButtonComponent onClick={modalCancelHandler} variant="link">
									Cancel
								</ButtonComponent>
								<ButtonComponent
									onClick={() => {
										handleFeatureReset()
										handleCloseDialogBox()
										if (feature) {
											dispatch(resetFeatureSettings({ _id: feature._id }))
											dispatch(toggleFeatureSelected(feature._id))
										}
									}}
								>
									Okay
								</ButtonComponent>
							</AlertPopupFooter>
						</>
					)
				default:
					;<>
						<Button
							onClick={() => handleCloseDialogBox()}
							label="Cancel"
							type="btn outline"
						/>
						<Button
							onClick={() => {
								handleCloseDialogBox()
							}}
							label="Save"
							type="primary-button"
						/>
					</>
					break
			}
		}

		return <>{dialogFooter()}</>
	}

	const renderModalBody = () => {
		switch (dialogType) {
			case "revert-action":
				return (
					<>
						<AlertPopupHeader>Revert Changes</AlertPopupHeader>
						<AlertPopupBody>Revert back to your last saved changes</AlertPopupBody>
					</>
				)

			case "save-changes":
				const variable = featureMetaData[featureVariableArr[0]?.name]
				return (
					<>
						<AlertPopupHeader>Review Changes</AlertPopupHeader>
						<AlertPopupBody>
							<div className="review-changes-container">
								{!!Object.keys(featureSettings?.css || {}).length && (
									<div className="latest-changes-view-container">
										<div className="changes-container-subheading">CSS</div>
										<div className="changes-view">
											{JSON.stringify(featureSettings?.css)}
										</div>
									</div>
								)}
								{featureContent && (
									<div className="latest-changes-view-container">
										<div className="changes-container-subheading">Content</div>
										<div className="changes-view">
											{formatFeatureContent(
												featureContent,
												variable,
												featureMetaData?.unit
											)}
										</div>
									</div>
								)}
							</div>
						</AlertPopupBody>
					</>
				)

			case "factory-reset":
				return (
					<>
						<AlertPopupHeader>Reset Usecase</AlertPopupHeader>
						<AlertPopupBody>{`Reset '${formatFeatureName(
							feature?.name || ""
						)}' use case to its default configurations`}</AlertPopupBody>
					</>
				)

			default:
				;<></>
				break
		}
	}

	const handleCssChange = () => {
		if (feature && feature?.name) {
			setIsConfigChanged({ ...isConfigChanged, [feature.name]: true })
		}
	}

	const Layout = () => {
		return (
			<>
				<div className="layout-body-accordion">
					<div className="layout-body-heading">Margin</div>
					<div className="options-container">
						<div className="property-container">
							<InputWithLabel
								onChange={handleCssChange}
								label="top"
								type="number"
								name="margin-top"
							/>
							<InputWithLabel
								onChange={handleCssChange}
								label="bottom"
								type="number"
								name="margin-bottom"
							/>
						</div>
						<div className="property-container">
							<InputWithLabel
								onChange={handleCssChange}
								label="left"
								type="number"
								name="margin-left"
							/>
							<InputWithLabel
								onChange={handleCssChange}
								label="right"
								type="number"
								name="margin-right"
							/>
						</div>
					</div>
				</div>
				<div className="layout-body-accordion">
					<div className="layout-body-heading">Padding</div>
					<div className="options-container">
						<div className="property-container">
							<InputWithLabel
								onChange={handleCssChange}
								label="top"
								type="number"
								name="padding-top"
							/>
							<InputWithLabel
								onChange={handleCssChange}
								label="bottom"
								type="number"
								name="padding-bottom"
							/>
						</div>
						<div className="property-container">
							<InputWithLabel
								onChange={handleCssChange}
								label="left"
								type="number"
								name="padding-left"
							/>
							<InputWithLabel
								onChange={handleCssChange}
								label="right"
								type="number"
								name="padding-right"
							/>
						</div>
					</div>
				</div>
			</>
		)
	}

	const Colors = () => {
		return (
			<div className="layout-body-accordion">
				<div className="options-container">
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="color"
							type="color"
							name="color"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="background"
							type="color"
							name="background-color"
						/>
					</div>
				</div>
			</div>
		)
	}

	const Size = () => {
		return (
			<div className="layout-body-accordion">
				<div className="options-container">
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="width"
							type="number"
							name="width"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="max width"
							type="number"
							name="max-width"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="height"
							type="number"
							name="height"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="max height"
							type="number"
							name="max-height"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="overflow"
							type="text"
							name="overflow"
						/>
					</div>
				</div>
			</div>
		)
	}

	const Borders = () => {
		return (
			<div className="layout-body-accordion">
				<div className="options-container">
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="border style"
							type="text"
							name="border-style"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="border color"
							type="color"
							name="border-color"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="border width"
							type="number"
							name="border-width"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="border radius"
							type="number"
							name="border-radius"
						/>
					</div>
				</div>
			</div>
		)
	}

	const Typography = () => {
		return (
			<div className="layout-body-accordion">
				<div className="options-container">
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="font size"
							type="number"
							name="font-size"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="font weight"
							type="text"
							name="font-weight"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="line height"
							type="number"
							name="line-height"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="text align"
							type="text"
							name="text-align"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="text decoration"
							type="text"
							name="text-decoration"
						/>
					</div>

					<div className={`input-label-container`}>
						<label className="input-label">Font family</label>
						<div className={`input-contianer -with-type-text`}>
							<List
								list={[...fonts]}
								activeItem={font}
								buttonPlaceholder="Select"
								// searchProps={["value"]}
								selectCallback={handleFeatureFontChange}
							>
								{[...fonts].map((item) => {
									return (
										<ListItem key={item._id} data={item}>
											{item.value}
										</ListItem>
									)
								})}
							</List>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const Position = () => {
		return (
			<div className="layout-body-accordion">
				<div className="options-container">
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="position"
							type="text"
							name="position"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="Top"
							type="number"
							name="top"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="Bottom"
							type="number"
							name="bottom"
						/>
					</div>
					<div className="property-container">
						<InputWithLabel
							onChange={handleCssChange}
							label="Left"
							type="number"
							name="left"
						/>
						<InputWithLabel
							onChange={handleCssChange}
							label="Right"
							type="number"
							name="right"
						/>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			<AlertPopup
				wrapperRef={modalRef}
				name={modalTitle}
				visibility={modalState}
				onBackdropClick={modalCancelHandler}
			>
				{renderModalBody()}
				{renderModalFooter({})}
			</AlertPopup>

			<div className="configuration-panel-container --template">
				<div className="tempate-panel-header">
				<div className="close-template-icon" onClick={handleClosePanelClick}>
						<img src={BackIcon} alt="" />
					</div>
					<div className="feature-name">
						<p>{formatFeatureName(feature?.name || "")}</p>
						{/* CODE FOR SELECTING PLACEMENT */}
						{/* {PRODUCT_PAGE_USE_CASES.includes(feature?.name || "") && (
							<>
								<span
									onClick={() => {
										if (feature) {
											enableElementSelector({
												data: { feature: feature },
												messageType: message,
											})
										}
									}}
								>
									Select placement
								</span>
							</>
						)} */}
					</div>
					
				</div>
				<div className="configuration-panel -settings-panel-container">
					{PRODUCT_PAGE_USE_CASES.includes(feature?.name || "") && (
							<>
								{/* <span
									onClick={() => {
										if (feature) {
											enableElementSelector({
												data: { feature: feature },
												messageType: message,
											})
										}
									}}
								>
									Select placement
								</span> */}
									<PlaceElementButton onClick={(status) => {
										if (feature) {
											enableElementSelector({
												data: { feature: feature, status },
												messageType: message,
											})
										}
									}} key={feature ? feature._id : ""} />
							</>
						)}
					<div className="variables-input-container">
						{feature &&
							featureVariableArr.map((variable, idx) => (
								<InputBox
									label={variable.label}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement> | null,
										unitObject?: UnitObject | undefined
									) => handleFeaureVariableChange(e, unitObject)}
									placeholder="Enter vaiable value"
									name={variable.name}
									value={featureMetaData[variable.name]}
									unit={featureMetaData.unit}
									key={feature._id}
									type="number"
								/>
							))}
					</div>
					<div className="content-text-area">
						<TextArea
							value={featureContent}
							name="content-feild"
							id="feature-content-edit"
							onChange={handleContentChange}
							onBlur={() => {
								if (textareaError.message) {
									setTextareaError({ message: "" })
								}
							}}
						/>
						{textareaError.message && (
							<div className="text-area-error-container">
								<span className="error_text d-caption">
									{textareaError.message}
								</span>
							</div>
						)}
					</div>
					<div className="accordions-wrapper">
						{/* Position */}
						<div className="setting-accordions">
							<Accordion heading="Position" children={Position()} defaultOpen={true} />
						</div>
						{/* Layout */}
						<div className="setting-accordions">
							<Accordion heading="Layout" children={Layout()} />
						</div>
						{/* colors */}
						<div className="setting-accordions">
							<Accordion heading="Colors" children={Colors()} />
						</div>

						{/* Size */}
						<div className="setting-accordions">
							<Accordion heading="Size" children={Size()} />
						</div>

						{/* borders */}
						<div className="setting-accordions">
							<Accordion heading="Borders" children={Borders()} />
						</div>

						{/* Typography */}
						<div className="setting-accordions">
							<Accordion heading="Typography" children={Typography()} />
						</div>
					</div>
					<div className="apply-fearure-setting-btn">
						<Button
							type="primary-button"
							label="Save"
							onClick={() => handleDialogBoxOpen("save-changes")}
							disabled={feature?.name ? !isConfigChanged[feature.name] : true}
						/>
						<Button
							type="primary-outline"
							label="Revert"
							onClick={() => handleDialogBoxOpen("revert-action")}
							disabled={feature?.name ? !isConfigChanged[feature.name] : true}
						/>
						<Button
							type="primary-outline"
							label="Reset"
							onClick={() => handleDialogBoxOpen("factory-reset")}
							disabled={false}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default SettingsPanel
