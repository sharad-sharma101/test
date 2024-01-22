import React, { useState , useEffect } from 'react'
import AppPopup from '../../../components/app-popup'
import { Button, Badge } from '@attrybtech/attryb-ui'
import variantIcon from "../../../assets/template-library/variant.svg"
import "./index.sass"
import cross from "../../../assets/template-library/cross.svg"
import TemplatePreview from '../../../components/template-preview'
import ClickAwayListener from "react-click-away-listener";

import DomainHeader from '../../../components/DomainHeader'
type Props = {
    modalState: boolean ,
    template: Template ,
    selectNewTemplate: (id:string,isNavigate:boolean) => void , 
    setmodalState: React.Dispatch<React.SetStateAction<boolean>>,
    buttonTitle: string
}

const PreviewPopup = ({modalState , template , selectNewTemplate , setmodalState , buttonTitle} : Props) => {

    const [selectedTemnplate , setSelectedTemplate] = useState<Template>()
    const [selectedDevice, setSelectedDevice] = useState<string>('desktop')

    
    function handleDeviceSwitch(str : string) {
        setSelectedDevice(str)
    }
    function saveTemplateFunction () {
   
        selectNewTemplate(template._id,true);

    }

    const getSelectedDevice=()=>{
            if(selectedDevice==="desktop")return `desktop`
            if(selectedDevice==="tablet")return `tablet`
            else return "mobile"
    }
    const handleClose = () => {
        setmodalState(false)
      };

  return (
     
    <div className="Backdrop" >
      {/* <AppPopup header={<PopupHeader/>} body={<PopupBody />} footer={<PopupFooter />}  openModal={modalState} setOpenModal={setmodalState}  /> */}
      <ClickAwayListener
        onClickAway={(e) => {
          handleClose();
        }}
      >
      <div className='preview-popup-body--container' >
                <div className="left-side-preview-popup">
                    <div className="upper-container">
                        <div className="variant-icon--wrapper">
                            <img src={variantIcon} alt="" />
                        </div>
                        <div className="variant-name-wrapper">
                            <p className='display-xs--md' >{template.name}</p>
                        </div>
                        <div className="average-conversition">
                            <p className='text-md--md' >Average Convertion rate: {template?.metrics[0]?.value}%</p>
                        </div>
                        <div className="variant-tags">
                            <Badge labelText={'Build your list'} variant="indigo"  />
                            <Badge labelText={'Collect feedback'} variant="purple" />
                        </div>
                    </div>
                    <div className="use-template-btn-wrapper">
                        <Button onClick={saveTemplateFunction} state={""}  >{buttonTitle}</Button>
                    </div>
                </div>
                <div className="right-side-preview-popup">
                    <div className="tab-change-container">
                        <div className="cross-popup--wrapper" onClick={() => setmodalState(false)} >
                            <img src={cross} alt="" />
                        </div>
                        <div className="device-switcher--wrapper">
                            <div className={`desktop device-switcher--wrapper ${selectedDevice === 'desktop' ? 'selected-device' : ''} text-sm--sb`} onClick={ () =>handleDeviceSwitch('desktop')} >
                                Desktop
                            </div>
                            <div className={`tablet device-switcher--wrapper ${selectedDevice === 'tablet' ? 'selected-device' : ''} text-sm--sb`} onClick={ () =>handleDeviceSwitch('tablet')} >
                                Tablet
                            </div>
                            <div className={`mobile device-switcher--wrapper  ${selectedDevice === 'mobile' ? 'selected-device' : ''} text-sm--sb`} onClick={ () =>handleDeviceSwitch('mobile')}>
                                Mobile
                            </div>
                        </div>
                    </div>


                    <div className={`${getSelectedDevice()}-banner-full-width placement-images-container transition-placement-preview`}>
                    {/* <DomainHeader device={getSelectedDevice()} /> */}
                        <TemplatePreview device={selectedDevice} template={template} />
                    </div>

                    {/* <div className="previwe-device--wrapper">
                        <div className="preview-popup--footer">
                        <div className="main-page-container">
                        <TemplatePreview device={selectedDevice} template={template} />
                        </div>
                        <p className='text-sm--md supporting-text' >Main Page</p>
                        </div>
                    </div> */}

                </div>
            </div>
            </ClickAwayListener>
    </div>
    
  )
}

export default PreviewPopup
