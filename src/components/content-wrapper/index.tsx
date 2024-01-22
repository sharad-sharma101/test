import React from 'react'
import "./index.sass"

export default function ContentWrapper ({children}:any) {
  return (
    <div className="content-wrapper" >
        {children}
    </div>
  )
}

