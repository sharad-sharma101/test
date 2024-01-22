import React from 'react'
import {Button} from '@attrybtech/attryb-ui'
import './index.sass'

interface Props{
  variant:string
  message:string
  actionMessage:string
  onClick:()=>void
}

const AppBanner:React.FC<Props> = ({ variant, message, onClick, actionMessage }) => {
  return (
    <div className={`app-banner-container ${variant}`} >
        <div className="app-banner__body">
            <div className="app-banner_text">{message}</div>
            <div className="app-banner__action">
                <Button onClick={onClick} variant="outline" >{actionMessage}</Button>
            </div>
        </div>
    </div>
  )
}

export default AppBanner