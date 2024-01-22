import React from 'react'
import LoaderIcon from "../../assets/images/loader.svg"
import "./index.sass"

const AppLoader:React.FC = () => {
  return (
    <div className="loading-container" >
        <div className="loading-media">
        <object type="image/svg+xml" data={LoaderIcon}>
        </object>
        </div>
        <div className="loading-text">Loading</div>
    </div>
  )
}

export default AppLoader