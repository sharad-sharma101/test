// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./index.sass";

import { List, ListItem, Button, Switch } from "@attrybtech/attryb-ui";
import WebEditor from "../WebEditor/WebEditor";
import WebsiteViewer from "./WebsiteViewer";
import TemplatePreview from "../../components/template-preview";
import DomainHeader from "../../components/DomainHeader";
import phoneIcon from "../../assets/images/placement/phone.svg";
import monitorIcon from "../../assets/images/placement/monitor.svg";
import tabletIcon from "../../assets/images/placement/tablet.svg";
import cursorPointer from "../../assets/placements-images/cursor-pointer.svg"
import WebPageViewer from "../../components/web-page-viewer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setLoaderActive, setSelectedPostion } from "../../features/templates/template-slice";
import featuredAlertIcon from "../../assets/placements-images/featured-icon-outline.svg"
import ScreenViews from "../../components/ScreenViews";
import Skeleton from "react-loading-skeleton";
import TextInput from "../../components/text-input";


const { VITE_PROXY_SERVER_BASE_URL: PROXY_SERVER_BASE_URL } = import.meta.env;

let transitionDummyData = [
	{ _id: 1, value: "Place Below the selection", data: "afterend" },
	{ _id: 2, value: "Place Above the selection", data: "beforebegin" },
];

const PlacementsPage = ({ currentTemplate }: PlacementPageProps) => {


	const [screenSize, setScreenSize] = useState<string>("desktop");
	const [clickedInspector,setClickedInpector]=useState(false)



	const [placementPageLoading, setPlacementPageLoading] = useState(true);
	const [currentView, setCurrentView] = useState("normal");
	const dispatch = useAppDispatch();
	const {
		selectedPagesforFlow,
		template,
		selectedPagesObject,
		placementDataStore,
		position,
		variantObject,
	} = useAppSelector((store) => store.templateConfigs);
	const [postMessageTriggered, setPostMessageTriggered] = useState(false);
	const [currentObject,setCurrentObject]=useState(position)
	const [activeObject, setActiveObject] = useState(position?.value?.position==="beforebegin"?transitionDummyData[1]:transitionDummyData[0])

	useEffect(() => {
		return () => {
			const iframe = document.getElementById("usecase-preview") as HTMLIFrameElement;
			if (iframe?.contentWindow){
				iframe.contentWindow.postMessage(
					{
						messageType: "reset-client-stroage"
					},
					PROXY_SERVER_BASE_URL
				);
			}
		};
	  }, []);

	const handleInsPectorClick = () => {
		setClickedInpector(true)
    const iframe = document.getElementById("usecase-preview") as HTMLIFrameElement;
		if (iframe?.contentWindow)
			iframe.contentWindow.postMessage(
				{
					messageType: "enable-inspector",
          data: activeObject?.data
				},
				PROXY_SERVER_BASE_URL
			);
	};






	const styleSelected = {
		border: "1px solid var(--color--grey-off)",
		background: "var(--color-white-faint)",
		boxShadow: "0px 0px 0px 4px #F2F4F7, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
		width: "11.25rem",
	};
	useEffect(() => {
		if (
			Object.keys(template).length &&
			Object.keys(variantObject).length &&
			!postMessageTriggered
		) {
			setPostMessageTriggered(true);
			listenToScriptLoad();
		}

		return () => {
			unsubscribeToScript();
		};
	}, []);

	useEffect(() => {
		if(getCurrentViewStructure()==="dynamic-layout"){
			dispatch(
				setSelectedPostion({
					type: "dynamic",
					value: {
						xPath: currentObject?.value?.xPath||"",
						position: activeObject?.data,
						fullXpath: currentObject?.value?.fullXpath||"",
					},
				})
			);
		}
	}, [activeObject,currentObject]);


	const sendPlacementMessage = (styles) => {
		const isDynamicPlacement = getCurrentViewStructure() === "dynamic-layout";
		const iframe = document.getElementById("usecase-preview") as HTMLIFrameElement;
		if (iframe?.contentWindow)
			iframe.contentWindow.postMessage(
				{
					data: {
						template: template,
						styles,
						isDynamicPlacement,
					},
					messageType: "placments",
				},
				PROXY_SERVER_BASE_URL
			);
	};
	function handleCallBackFunction(item: any) {
		setActiveObject(item);
		sendPlacementMessage(item?.data);
	
	}



	const handleCurrentView = () => {
		if (currentView === "normal") {
			setCurrentView("expand");
		} else {
			setCurrentView("normal");
		}
	};

	const renderTemplate = (event) => {
		const { messageType } = event?.data;
		const isDynamicPlacement = getCurrentViewStructure() === "dynamic-layout";

		if (messageType && messageType === "script-loaded") {
			const iframe = document.getElementById("usecase-preview") as HTMLIFrameElement;
			if (iframe?.contentWindow)
				iframe.contentWindow.postMessage(
					{
						data: {
							template: template,
							placement: position || variantObject?.configuration?.placement,
							pages: selectedPagesforFlow?.length
								? selectedPagesforFlow
								: [
										"HOME_PAGE",
										"COLLECTION_PAGE",
										"PRODUCT_PAGE",
										"CART_PAGE",
										"CHECKOUT_PAGE",
										"BLOG_PAGE",
								  ], // !!! send the PAGES array here
							isDynamicPlacement: isDynamicPlacement,
						},
						messageType: "render-use-case",
					},
					PROXY_SERVER_BASE_URL
				);
		}
		if(messageType && messageType === "element-xpath"){
			setClickedInpector(false)
			const elementXpath = event?.data?.data?.xpath || event?.data?.data?.fullXpath
			setCurrentObject({type:"dynamic",value:{...currentObject?.value,xPath:elementXpath,fullXpath: event?.data?.data?.fullXpath}})

			
		}
	};

	const listenToScriptLoad = () => {
		window.addEventListener("message", renderTemplate);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Escape") {
			setScreenSize("desktop");
			setCurrentView("normal");
		}
		if (event.ctrlKey && event.key === "f") {
			setScreenSize("full-screen");
			setCurrentView("normal");
			setCurrentView("expand");
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const unsubscribeToScript = () => {
		window.removeEventListener("message", renderTemplate);
	};
	useEffect(() => {
		let values = Object.keys(position || {});
		if (values.length === 0) {

			dispatch(setSelectedPostion(variantObject?.configuration?.placement));
		}
	}, [variantObject]);

	const getCurrentViewStructure = () => {
		let isUseCaseDynamicPlacement = variantObject?.useCaseId?.isDynamicPlacement;
		if (isUseCaseDynamicPlacement) return "dynamic-layout";
		let currentViewStructure = variantObject?.useCaseId?.viewStructure;
		if (currentViewStructure === "popup" || currentViewStructure == "toaster")
			return "grid-layout";
		if (currentViewStructure === "banner") return "banner-layout";
	};

	return (
		<div className="placements-page-wrapper">
			<div className="parent-placements-main-wrapper">
				{/* switch button placements */}
				<div className="placements-page-sidebar">
	
					<div className="position-parent-wrapper">
	
						<div className="static-placement-box-wrapper">
							{!placementDataStore[0]?.data ? (
								<Skeleton width={"50%"} height={"1rem"} />
							) : (
								<div className="placement-header-wrapper">
									<p className="text-sm--md static-placement-text">
									{" "}
									{variantObject?.useCaseId?.viewStructure == "section"
										? "Dynamic Placement"
										: "Static Placement"}
								</p>
								{variantObject?.useCaseId?.viewStructure == "section"&&<p className="text-xs sub-heading-placement-header">Click the button to select a website section, It will be Highlighted on Hover</p>}
								{variantObject?.useCaseId?.viewStructure == "section"&&<div  onClick={() => handleInsPectorClick()} className={`inspector-on-off-button ${clickedInspector&&"clicked-inspector-state"}`}>
									<p className="text-sm--sb">Select Section</p>
									<div className="cursor-pointer-img-wrapper"
                                            >
                                                <img
                                                    src={cursorPointer}
                                                    alt=""
                                                />
                                            </div>
									</div>}
								</div>
							)}
							{!placementDataStore[0]?.data && (
								<Skeleton width={"100%"} height={"10rem"} />
							)}
							{getCurrentViewStructure() == "grid-layout" &&
								placementDataStore[0]?.data && (
									<div className="static-placement-positions-box">
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[0]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[0].value}top:0%;left:0;transform:translateX(0%) translateY(0%);bottom:unset;right:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[0]?._id
													? "-selected"
													: ""
											} round-corner-left`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[1]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[1].value}top:0;left:50%;transform:translateX(-50%);right:unset;bottom:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[1]?._id
													? "-selected"
													: ""
											}`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[2]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[2].value}top:0;right:0;left:unset;transform:translateX(0%) translateY(0%);bottom:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[2]?._id
													? "-selected"
													: ""
											} round-corner-top-right`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[3]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[3].value}top:50%;left:0;transform:translateX(0%) translateY(-50%);right:unset;bottom:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[3]?._id
													? "-selected"
													: ""
											}`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[4]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[4].value}top:50%;left:50%;transform:translateX(-50%) translateY(-50%);bottom:unset;right:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[4]?._id
													? "-selected"
													: ""
											}`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[5]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[5].value}top:50%;right:0;transform:translateX(0%) translateY(-50%);left:unset;bottom:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[5]?._id
													? "-selected"
													: ""
											}`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[6]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[6].value}bottom:0;left:0;transform:none;top:unset;right:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[6]?._id
													? "-selected"
													: ""
											} round-corner-bottom-left`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[7]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[7].value}bottom:0;left:50%;transform:translateX(-50%);top:unset;right:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[7]?._id
													? "-selected"
													: ""
											}`}
										></div>
										<div
											onClick={() => {
												dispatch(
													setSelectedPostion(
														placementDataStore[0]?.data[8]
													)
												);
												sendPlacementMessage(
													`${placementDataStore[0]?.data[8].value}bottom:0;right:0;transform:none;top: unset;left:unset`
												);
											}}
											className={`placement-position-box${
												position?._id == placementDataStore[0]?.data[8]?._id
													? "-selected"
													: ""
											} round-corner-bottom-right`}
										></div>
									</div>
								)}
							{getCurrentViewStructure() == "banner-layout" &&
								placementDataStore[0]?.data && (
									<div className="postion-buttons-wrapper-top-bottom">
										{placementDataStore &&
											placementDataStore[0]?.data?.map((el) => (
												<Button
													style={
														position?._id == el?._id
															? styleSelected
															: { width: "11.25rem" }
													}
													variant="solid"
													colorScheme="secondary"
													key={el._id}
													onClick={() => {
														dispatch(setSelectedPostion(el));
														sendPlacementMessage(
															`${el.value}left:0;bottom:0;width:100vw;`
														);
													}}
												>
													{el?.name}
												</Button>
											))}
									</div>
								)}
							{getCurrentViewStructure() == "dynamic-layout" &&
								placementDataStore[0]?.data && (
									<div className="transition-item-list-wrapper">
									<List
									variant="grey"
										list={transitionDummyData}
										activeItem={activeObject}
										buttonPlaceholder="None"
										selectCallback={(e) => handleCallBackFunction(e)}
									>
										{transitionDummyData&&transitionDummyData.map((item) => {
										return (
									<ListItem key={item._id} data={item}>
									{item.value}
									</ListItem>
									);
								})}
									</List>
									</div>
								)}
						</div>
					</div>
					{/* position  */}
					<div className="position-parent-wrapper">
						 {/* <div className='position-setting-button'>

</div> */}

						<div className="transition-options-dropdown"></div>
					</div>

				</div>
				{/* third div */}
				{getCurrentViewStructure() == "dynamic-layout"&&<div className="dynamic-placement-alert-message">
				<div className="dynamic-alert-wraper-child">
					<div className="featured-alert-icon-placement">
						<img src={featuredAlertIcon} alt="" />
					</div>
				<p className="alert-heading-placement text-xs--sb">Effective Selection</p>
					<p className="alert-sub-heading-placement text-xs--md">Please remember that a website consists of multiple nested Sections called 'Divisions' or 'Divs'. So, instead of choosing smaller parts or inner sections within these divisions (they appear when you hover over them), aim to select the whole division. This ensures effective placement</p>
				</div>
				</div>}
			</div>
		

			<div className={currentView=="expand"?"wrapper-second-block-placements-expand":"wrapper-second-block-placements"}>
				{/* responsive icons wrapper parent */}
				<ScreenViews
					preview={true}
					expandOption={true}
					invokeHandleView={() => handleCurrentView()}
					currentView={"normal"}
					screenSize={screenSize}
					sendScreenSize={(e) => setScreenSize(e)}
				/>

				<div
					className={`preview-website-wrapper-parent-`}
				>
					{
						<WebPageViewer
							contentEditable={true}
							preview={true}
							currentView={currentView}
							sendIframeLoading={(e) => setPlacementPageLoading(e)}
							placementPageLoading={placementPageLoading}
							device={screenSize}
						/>
					}
				</div>
			</div>
		</div>
	);
};

export default PlacementsPage;
