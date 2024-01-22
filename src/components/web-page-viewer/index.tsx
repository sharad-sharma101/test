import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.sass";
import { AuthContext } from "../../auth/AuthContext";
import DomainHeader from "../DomainHeader";
import Skeleton from "react-loading-skeleton";
import AppLoader from "../Loader-Components/AppLoader";
import { useAppSelector } from "../../app/hooks";
import { current } from "@reduxjs/toolkit";

const { VITE_PROXY_SERVER_BASE_URL: PROXY_SERVER_BASE_URL } = import.meta.env;

type Props = {
	device: string;
	placementPageLoading:boolean;
	sendIframeLoading:(e:boolean)=>void,
	preview?:any
};

const WebPageViewer: React.FC<Props> = ({ device, placementPageLoading,contentEditable, sendIframeLoading, currentView,preview, }:any) => {

	const { accountId, containerId, containerData }: any = useContext(AuthContext);
	const {currentDomainHeader,reloadIframe}=useAppSelector((store)=>store.globalConfig)
	const [selectedWidth, setselectedWidth] = useState(1920)
    const [selectedHeight, setselectedHeight] = useState(1080)

	useEffect(() => {
	  if(device === 'desktop'){
		setselectedHeight(1080)
		setselectedWidth(1920)
	  } else if(device === 'tablet'){
		setselectedHeight(1120)
		setselectedWidth(1300)
	  } else if(device === 'mobile'){
		setselectedHeight(660)
		setselectedWidth(400)
	  }
	}, [device])
	
	useEffect(() => {
		window.addEventListener('resize', calculateHeight);
		calculateHeight();
		return () => {
		window.removeEventListener('resize', calculateHeight);
		};
	}, [device , currentView]); 
	function calculateHeight () {
		const element = document.querySelector('.web-page-viewer') as HTMLElement;
		if(element){
		const currentHeight = element?.offsetHeight ;
		const currentWidth = element?.offsetWidth ;
		
		const leftShift = Math.abs(currentWidth - (selectedWidth  * (currentHeight/selectedHeight) ))
		const styles = `
		.web-page-viewer.${device} .border-iframe-website-viewer {
		height: ${selectedHeight}px;
		width: ${selectedWidth}px;
		position: absolute;
		transform: scale(${(currentHeight/selectedHeight)});
		transform-origin: top left;
		left: ${(leftShift)/2}px;
		margin-left: 0px;
		}
	`;

	const styleElement = document.createElement('style');
	styleElement.innerHTML = styles;
	document.head.insertAdjacentElement('beforeend', styleElement);
	}
	}

	calculateHeight()
	return (
		<div className={currentView === "normal" ? `web-page-viewer ${device}` : `web-page-viewer ${device}-expand`}>

			<div className="border-iframe-website-viewer">
				
				{/* {placementPageLoading&&<Skeleton height={"100%"} width={"100%"}/>} */}
				
				{placementPageLoading&&<AppLoader/>}
				<>{currentDomainHeader&&containerId &&reloadIframe&& (
				<iframe  
				onLoad={()=>sendIframeLoading(false)}
				src={`${PROXY_SERVER_BASE_URL}/?url=${currentDomainHeader}&preview=${preview}&containerId=${containerId}`}
				id="usecase-preview"
				sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"
				>
				</iframe>
			)}
			</>

				
			
			</div>	
		</div>
	);
};

export default WebPageViewer;
