import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../components/app-popup';
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import backgroundPattern from "../../../assets/icons-v2/Background pattern decorative.svg"
import unsavedIcon from "../../../assets/icons-v2/UnsavedFeatured icon.svg"
import {Button} from "@attrybtech/attryb-ui"
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import offCautionIcon from "../../../assets/icons-v2/offCaution.svg"
import onCautionIcon from "../../../assets/icons-v2/onCaution.svg"
import { useNavigate } from 'react-router-dom';
import primaryCaution from "../../../assets/icons-v2/primaryCaution.svg";
export const StatusPopup: React.FC<any> = ({ close, selectedRow, type="item", toggleCallBack, buttonLoading, explicitStatus }) => {

    const [openModal, setOpenModal] = useState(true)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    function handleToggle() {
        // close(false);
        if(type === "Variant" && selectedRow?.isDraft === true){
          if(selectedRow.progress?.completed?.route!==""){
            navigate(`/${selectedRow._id}/${selectedRow.progress?.completed?.route}`)
            }else{
            navigate(`/variants/${selectedRow._id}/template`)
            }
        }

        else{
          toggleCallBack();
        }        
        close(false);


      }
    function handleCrossPopup () {
      
        close(false);
      }
    const PopupHeader = () => {
      return (
        <div className="configuration-cross-popup-header">
          <div className="configuration-cross-popup-icons">
            <div className="configuration-cross-popup-left-icon">
                <div className='configuration-popup-background-pattern'>
                <img src={backgroundPattern} alt="" />
                </div>
             <div className='configuration-popup-mail-icon'>
             {/* {selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true ? <img src={primaryCaution} alt="" /> : <img src={primaryCaution} alt="" />}
              */}
              <img src={(selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true) ? offCautionIcon : onCautionIcon} alt="" />
             <span className="configuration-popup-hover-circle"></span>
             </div>
              
            </div>
            <div className="configuration-popup-cross" onClick={() => close(false)}>
            <span className="configuration-popup-hover-circle"></span>
              <img src={hoverX} alt="" className="hover-icon" />
            <img src={closeIcon} alt="" className="default-icon" />
            </div>
          </div>
        </div>
      );
    };
  
    const PopupBody = () => {
      return (
        <div className="configuration-cross-popup-body">
          <div className="configuration-cross-popup-heading text-lg--sb">
          <p>
          {
  type === 'Variant' && selectedRow?.isDraft === true
    ? "Finish Configuring the Variant first"
    : selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true
    ? `Turn Off ${type}`
    : `Turn On ${type}`
}
          </p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
          <p>
          {
  type === "Variant" && selectedRow?.isDraft === true
    ? "You need to complete configuring the variant before you can turn it on"
    : `Are you sure you want to turn ${
        selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true ? "off" : "on"
      } this ${type}?`
}
          </p>

          </div>
        </div>
      );
    };
  
    const PopupFooter = () => {
      return (
        <div className="configuration-cross-popup-button">
            <div className='configuration-popup-discard'>
          <Button style={{padding:".625rem 3.5rem"}} onClick={ handleCrossPopup} colorScheme="secondary" variant="solid">
          Cancel
          </Button>
          </div>
          <div className='configuration-popup-save'>
          <Button 
            style={{ padding: ".625rem 2.5rem" }} 
            onClick={handleToggle} 
            variant="outline-fill" 
            colorScheme={selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true ? "danger" : "success"}
          >

          {  type === "Variant" && selectedRow?.isDraft === true
    ? "Go to the Variant"
    :selectedRow?.status === true || selectedRow?.status === 'active' || explicitStatus === true ? `Turn Off ${type}` : `Turn On ${type}`}
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <div className="configuration-cross-popup-container">
        <AppPopup header={PopupHeader()} body={PopupBody ()} footer={PopupFooter()} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };
  