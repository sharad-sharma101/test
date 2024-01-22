// @ts-nocheck
import React from 'react'
import UseCaseIcon from "../../assets/images/blogPost.svg"
import "./index.sass"

const UseCaseCard = ({
    icon,
    heading,
    para,
    active=false,
    showIcon=true,
}:UseCaseCard) => {
  return (
    <div className={`use-case-card ${active ? "active" : ""}`} >
       {showIcon && <div className="use-case-card__icon" >
            <img src={"https://contentstudio.attryb.com/assets/images/blog-intro-paragraph.svg"} alt="" />
        </div>}
        <div className="use-case-card__body" >
            <div className="use-case-card__body-heading">{heading}</div>
            <p className="use-case-card__body-para">{para}</p>
        </div>
    </div>
  )
}

export default UseCaseCard