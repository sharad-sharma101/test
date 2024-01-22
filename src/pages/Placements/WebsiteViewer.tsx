import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../auth/AuthContext'

const {VITE_PROXY_SERVER_BASE_URL:PROXY_SERVER_BASE_URL} = import.meta.env
const WebsiteViewer = () => {

    const {accountId,containerId}:any=useContext(AuthContext)
    
  return (
    <>
      {accountId && containerId && (
  
         <iframe
          src={`${PROXY_SERVER_BASE_URL}/?url=${"https://attryb.com"}&accountId=${accountId}&containerId=${containerId}`}
          id="app-browser-frame"
          sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"	
          style={{width:"100%",height:"100%"}}
          >
         </iframe>
		)}
    </>
  )
}

export default WebsiteViewer
