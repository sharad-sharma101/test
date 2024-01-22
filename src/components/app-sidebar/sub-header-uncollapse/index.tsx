import React from 'react'
import domainDropdownIcon from "../../../assets/images/sidebar/content.svg"
import "./index.sass"
const SubHeaderUncollapse = () => {
  return (
    <div className="sidebar-icon-wrapper">
    <div className="sidebar-icon-collapse_wrapper">
        <img src={domainDropdownIcon} alt="" />
    </div>
    </div>
  )
}

export default SubHeaderUncollapse
