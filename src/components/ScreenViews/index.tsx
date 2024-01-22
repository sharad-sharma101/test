import React, { useContext } from 'react'
import phoneIcon from '../../assets/images/placement/phone.svg'
import monitorIcon from '../../assets/images/placement/monitor.svg'
import tabletIcon from "../../assets/images/placement/tablet.svg"
import "./index.sass"
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setAlertVisible, setCurrentDomainHeader } from '../../features/globalConfigs/global-slice'
import { AuthContext } from '../../auth/AuthContext'
import expandIcon from "/src/assets/domainheader/expand.svg"
import reseticon from "/src/assets/domainheader/reset-icon.svg"
import copyIcon from "/src/assets/domainheader/copy-icon.svg"
import collapseIcon from "/src/assets/domainheader/collapseIcon.svg"
import {BiCollapse} from "react-icons/bi"
import { FaExpandAlt } from "react-icons/fa"
import { preview } from 'vite'
import DomainHeader from '../DomainHeader'
import lockIconImg from "/domainheader/greenLock.svg"
import {Button} from "@attrybtech/attryb-ui"

const { VITE_PROXY_SERVER_BASE_URL: PROXY_SERVER_BASE_URL } = import.meta.env;




const ScreenViews = ({currentView="normal",screenSize,sendScreenSize,invokeHandleView,preview,expandOption=false}:any) => {

    const {currentDomainHeader}=useAppSelector((store)=>store.globalConfig)
    const {  containerData,containerObject,containerId }: any = useContext(AuthContext);
    const dispatch=useAppDispatch()

    const copyToClipBoard=()=>{
          if(navigator.clipboard){
            navigator.clipboard.writeText(`${PROXY_SERVER_BASE_URL}/?url=${currentDomainHeader}&preview=false&containerId=${containerId}`)
            dispatch(setAlertVisible({theme:"success",content:"Preview Link Copied",visible:true}))
          }
    }

    const handleResetDomain=()=>{
        if (containerData?.domainName.startsWith("https://") == false) {
            dispatch(setCurrentDomainHeader(`https://${containerData?.domainName}`))

        } else {
            dispatch(setCurrentDomainHeader(containerData?.domainName))
        }
    }

    
  return (
      <div className={`responsive-wrapper-parent ${currentView === "expand" || screenSize === "full-screen" ? `fixed-wrapper-responsive` : "navbar-size-fixed"}`}>
          <div className="responsive-wrapper-icons">
              <div  onClick={() => sendScreenSize("desktop")} className={`screen-icons-parent-wrapper ${screenSize==="desktop"?"screen-icons-selected":""}`} >
              <div  className='icon-wrapper'>
                  <img src={monitorIcon} alt="" />
              </div>
              </div>

             <div onClick={() => sendScreenSize("tablet")} className={`screen-icons-parent-wrapper ${screenSize==="tablet"?"screen-icons-selected":""}`} >
             <div className='icon-wrapper' >
                  <img src={tabletIcon} alt="" />
              </div>
             </div>
             <div  onClick={() => sendScreenSize("mobile")} className={`screen-icons-parent-wrapper ${screenSize==="mobile"?"screen-icons-selected":""}`} >
             <div className='icon-wrapper'>
                  <img src={phoneIcon} alt="" />
              </div>
             </div>
             
          </div>
          {<DomainHeader contentEditable={true} device={"mobile"==='mobile' ? 'mobile' : ''} />}
          <div className='right-column-screen-view'>
          {preview&&<div className='placement-header-right-section-screen-views'>
    
    <div className='reset-to-default-button-placement' onClick={()=>handleResetDomain()}   >
        <p className='text-sm--sb'>Reset to Default</p>
    </div>
    {!expandOption && (
        
        <Button onClick={()=>copyToClipBoard()} variant="outline" >
          Share Preview
        </Button>

  )}
    </div>}
        {expandOption&&<div onClick={() => invokeHandleView()}>
                  {currentView === "expand" ? 
                            <div  className={`screen-icons-parent-wrapper ${currentView==="expand"?"screen-icons-selected":""}`} >
                                    <div  className='icon-wrapper'>
                                        <img src={collapseIcon} alt="" />
                                    </div>
                            </div>: 
                            <div   className={`screen-icons-parent-wrapper ${currentView==="collapse"?"screen-icons-selected":""}`} >
                                <div  className='icon-wrapper'>
                                    <img src={expandIcon} alt="" />
                                </div>
                            </div>}
              </div>}


             
        
          </div>
         
      </div>
  )
}

export default ScreenViews