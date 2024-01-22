import React, { useEffect, useState } from 'react'
import PlacementsPage from '../Placements'
import WebPageViewer from '../../components/web-page-viewer'
import phoneIcon from '../../assets/images/placement/phone.svg'
import monitorIcon from '../../assets/images/placement/monitor.svg'
import tabletIcon from "../../assets/images/placement/tablet.svg"
import { useSearchParams } from 'react-router-dom'
import ScreenViews from '../../components/ScreenViews'
import DomainHeader from '../../components/DomainHeader'
import { useAppSelector } from '../../app/hooks'

const WebPreview = ({}:any) => {
    const [placementLoading,setPlacementPageLoading]=useState(true)
    const [currentView,setCurrrentView]=useState("expand")
    const [screenSize,setScreenSize]=useState("desktop")
    const {reloadIframe}=useAppSelector((store)=>store.globalConfig)

    
  return (
    <div className={currentView=="expand"?"wrapper-second-block-placements-expand":"wrapper-second-block-placements"}>
       <ScreenViews preview={true}  currentView={"normal"} screenSize={screenSize}
        sendScreenSize={(e:string) => setScreenSize(e)} /> 
        <div className='preview-website-wrapper-parent-'>
          
        {reloadIframe&&<WebPageViewer 
              preview={"false"}
              sendIframeLoading={(e) => setPlacementPageLoading(e)}
              placementPageLoading={placementLoading} 
              device={screenSize} />}
        </div>
              
 
    </div>
  )
}

export default WebPreview
