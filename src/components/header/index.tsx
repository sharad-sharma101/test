import React from 'react'
import "./index.sass"

const AppHeader:React.FC<AppHeader> = ({children}) => {
  return (
    <div className="app-header" >
        {children}
    </div>
  )
}

export default AppHeader