import React, { Children, useEffect, useState } from 'react'
import "./index.sass"
import TemplatePreview from '../template-preview'
import {useContext} from "react"
import { AuthContext } from '../../auth/AuthContext'
import ClickAwayListener from 'react-click-away-listener'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import lockIconImg from "/src/assets/domainheader/greenLock.svg"
import refreshIconImg from "/src/assets/domainheader/refresh-icon.svg"
import { current } from '@reduxjs/toolkit'
import { setCurrentDomainHeader, setReloadIframe } from '../../features/globalConfigs/global-slice'

const DomainHeader = ({device,domainName,contentEditable}:any) => {

  const { accountId, containerId, containerData }: any = useContext(AuthContext);
  const { currentDomainHeader,reloadIframe }=useAppSelector((store)=>store.globalConfig)
  const [domainHeader,setDomainHeader]=useState("")
  const dispatch=useAppDispatch()

  useEffect(()=>{
      setDomainHeader(currentDomainHeader)
  },[currentDomainHeader])

  const handleReloadIframe=()=>{
    dispatch(setReloadIframe(false))
    setTimeout(()=>{
      dispatch(setReloadIframe(true))
    },200)
  }
  return (
    <div>
       <div className={`banner-full-width ${device === '' ?'placement-images-container' : ''}`}>

                 <div className='parent-wrapper-lock-icon'>
                 <div className='lock-icon-wrapper'>
                <img src={lockIconImg} alt="" />
                  </div>

                 </div>
                <input
                readOnly={!contentEditable}
                
     onKeyDown={(e:any)=>{
      if(e.key==="Enter"){
        if (domainHeader.startsWith("https://") == false) {
            dispatch(setCurrentDomainHeader(`https://${domainHeader}`))

        } else {
            dispatch(setCurrentDomainHeader(domainHeader))
        }
     
        e.target.blur()
      }
    }} 
      spellCheck={false}
      value={domainHeader} // Use 'value' instead of 'textContent'
      onChange={(e: any) =>  setDomainHeader(e?.target?.value)}
      
      className={`text-xs domain-name-text`}
    />
        <div onClick={()=>handleReloadIframe()} className={`refresh-icon-wrapper-parent`}>
          <div className='lock-icon-wrapper'>
            <img src={refreshIconImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DomainHeader
