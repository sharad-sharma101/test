import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../components/app-popup';
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import backgroundPattern from "../../../assets/icons-v2/Background pattern decorative.svg"
import deleteIcon from "../../../assets/icons-v2/Delete Featured icon.svg"
import {Button} from "@attrybtech/attryb-ui"
import hoverX from "../../../assets/icons-v2/hoverX.svg"

export const RemoveTrigger: React.FC<any> = ({ close, handleDeleteTrigger, index}) => {
    const [openModal, setOpenModal] = useState(true)

    function DeleteTrigger(handleDeleteTrigger: (index:any) => void) {
        close(false);
      }
    function handleCrossPopup () {
        close(false);
      }
    const PopupHeader = () => {
      return (
        <div className="remove-trigger-popup-header-container">
          <div className="remove-trigger-icons">
            <div className="remove-trigger-left-icon">
                <div className='remove-trigger-background-pattern'>
                <img src={backgroundPattern} alt="" />
                </div>
             <div className='mail-icon'>
             <img src={deleteIcon} alt="" />
             </div>
              
            </div>
            <div className="trigger-popup-cross" onClick={() => close(false)}>
              <span className="trigger-hover-circle"></span>
              <img src={hoverX} alt="" className="hover-icon" />
            <img src={closeIcon} alt="" className="default-icon" />
            </div>
          </div>
        </div>
      );
    };
  
    const PopupBody = () => {
      return (
        <div className="remove-trigger-popup-body">
          <div className="remove-trigger-body-text text-lg--sb">
            <p>Remove Trigger</p>
          </div>
          <div className='remove-trigger-body-description text-sm'>
            <p>Are you sure you want to remove this Trigger?</p>
          </div>
        </div>
      );
    };
  
    const PopupFooter = () => {
      return (
        <div className="remove-trigger-submit-button">
            <div className='trigger-popup-button'>
          <Button style={{padding:".625rem 2.5rem"}}  onClick={ handleCrossPopup} colorScheme="secondary" variant="solid">
          Keep Trigger
          </Button>
          </div>
          <div className='trigger-popup-button'>
          <Button style={{padding:".625rem 2rem"}} onClick={() => DeleteTrigger(handleDeleteTrigger(index))} variant="solid" colorScheme="danger" >
          Remove Trigger
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <div className="trigger-popup-container">
        <AppPopup header={<PopupHeader />} body={<PopupBody />} footer={<PopupFooter />} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };
  