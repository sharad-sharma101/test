// @ts-nocheck
import React, { useEffect } from 'react'
import priviewIcon from "../../../assets/template-library/previwe.svg" // fix typo
import './index.sass'
import TopBannerDemoSnapshot from '../../../assets/images/shapshots/top-banner-1.svg'
import BackgroundImage from "../../../assets/configuration-data/background-frame.svg"
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setTemplate } from '../../../features/templates/template-slice'
import editIcon from "../../../assets/template-library/edit-template.svg"
import previewIcon from "../../../assets/template-library/preview-eye.svg"
import copyIcon from "../../../assets/template-library/clone-template.svg"
import templateDataJSON from "../../../data/template-data.json"
import {templateGeneralizedFunction} from "../../../template-generalized-functions/template-functions.js";

export default function TemplateCard({template, active, handleSelectTemplate, handleEditClick , handlePreviwe }:TemplateCard) {
 
  const temp=useAppSelector((store)=>store.templateConfigs.template) || {_id:""}

  const dispatch=useAppDispatch()

  const handleSelectionofTemplate=()=>{
    handleSelectTemplate(template._id)
    dispatch(setTemplate(template))
  }
  templateGeneralizedFunction()
  const parser = new DOMParser();
  let templateDoc = parser?.parseFromString(template.html, 'text/html').querySelector('div');
  templateDoc?.setAttribute("data-template-display", `${JSON.stringify(templateDataJSON)}`)
  templateDoc?.setAttribute("data-preview-mode", 'true')
  templateDoc = window.attryb.convertDomToString(templateDoc)
  const templateHtml = `
      ${templateDoc}
      <style>${template.css}</style>
      ${template?.isDynamic ? `
      <script>
      (${templateGeneralizedFunction.toString()})()
      ${template.script}
      </script>` : ``}
  `
 function iframePreviweCard (template : Template) {

  if(template?.viewStructure === "banner" || template?.viewStructure === "section" ) {
    return (
      <>
      <div className={`preview-screen-wrapper ${template?.viewStructure === "section" ? 'preview-section-structure' : ''}`}>
      <iframe className="preview-iframe" srcDoc={templateHtml} frameBorder="0" ></iframe> 
      </div> 
      <div className="background-image-wapper">
        <img src={BackgroundImage} alt="" />
      </div>
    </>
    )
  } else if(template?.viewStructure === "toaster") {
    return (
    <div className='preview-screen-carousel-wrapper' >
      <div className='preview-screen-wrapper-carousel'>
      <iframe className="preview-iframe" srcDoc={templateHtml} frameBorder="0" ></iframe> 
      </div>
      <div className="background-image-wapper">
        <img src={BackgroundImage} alt="" />
      </div>
    </div>

   )} else {
    return (
    <div className='preview-screen-outer-wrapper' >
      <div className='preview-screen-wrapper-template'>
      <iframe className="preview-iframe" srcDoc={templateHtml} frameBorder="0" ></iframe> 
      </div>
    </div>
  )}
 }
  return (
    <div className={`template-card ${active ? "--active" : ""}`}  onClick={()=>{  handleSelectionofTemplate()}} >
      <div className="innerTemplateSelector" onClick={()=>{  handleSelectionofTemplate()}} >
      </div>
      <div className={`template-snapshot ${active ? "--active" : ""}`} >
        {
          iframePreviweCard(template)
        }
        
        <div className="selection-overlay" >
        </div>
        <div className="option-on-template-card-wrapper">
                <div className="option-template-card-icon-container" onClick={() => handlePreviwe(template)}>
                  <div className="image-wrapper">
                    <img src={previewIcon} alt="" />
                  </div>
                </div>              
                <div className="option-template-card-icon-container">
                  <div className="image-wrapper">
                    <img src={editIcon} alt="" />
                  </div>
                </div>        
                <div className="option-template-card-icon-container">
                  <div className="image-wrapper">
                    <img src={copyIcon} alt="" />
                  </div>
                </div>        
          </div>
      </div>
       <span className="template-card__body" >
        <div className="template-name-wrapper">
          <p className='template-name text-sm'>{template.name}</p>
        </div>
        <div className="template-metrices-wrapper">
          <p className='template-cr text-sm' >{
            template.metrics?.map((ele: any) => (
              `${ele.name}: ${ele.value}%`
            ))
          }</p>
        </div>
       </span>
    </div>
  )
}