import React, { useState, useEffect } from 'react';
import AppPopup from '../../../components/app-popup';
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import backgroundPattern from "../../../assets/icons-v2/Background pattern decorative.svg"
import {Button} from "@attrybtech/attryb-ui"
import deleteIcon from "../../../assets/icons-v2/Delete Featured icon.svg"
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setAlertVisible } from '../../../features/globalConfigs/global-slice';
import { callCoreFeaturesApiData } from '../../../features/core-feature-configs/core-features-slice';
import { putSegments } from '../../../services/segments';

export const DeleteCampaignPopup: React.FC<any> = ({ close, segment}) => {
    const dispatch=useAppDispatch()
    const [buttonLoading,setButtonLoading]=useState(false)
    const [openModal, setOpenModal] = useState(true)
    
    
  async  function handleDraftSave() {
    // setButtonLoading(true)
    // try {
    //     await deleteSegment(segment._id)
    //     dispatch(setAlertVisible({theme:"success",content:"Segment Deleted Successfully",visible:true}))
    //     dispatch(callCoreFeaturesApiData(true))
    //     setButtonLoading(false)
    //     close(false)
    // } catch (error) {
    //     setButtonLoading(false)
    //     dispatch(setAlertVisible({theme:"warning",content:"Failed to Delete Segment",visible:true}))
    // }

      }

    function handleCrossPopup () {
      close(false)
    }
    const PopupHeader = () => {
      return (
        <div className="configuration-cross-popup-header">
          <div className="configuration-cross-popup-icons">
            <div className="configuration-cross-popup-left-icon">
                <div className='configuration-popup-background-pattern'>
                <img src={backgroundPattern} alt="" />
                </div>
             <div className=''>
              <div className='configuration-popup-mail-icon'>
             <img src={deleteIcon} alt="" />

              </div>
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
            <p>Delete Segment</p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
            <p>Are you sure you want to Delete this Segment?</p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
            <p><span className='red-text-warning' >Warning:</span> All the campaigns associated with this Segment will also be Deleted</p>
          </div>
      
        </div>
      );
    };
  
    const PopupFooter = () => {
      return (
        <div className="configuration-cross-popup-button">
            <div className='configuration-popup-discard'>
          <Button style={{padding:".625rem 3.5rem",width:"100%"}} onClick={ handleCrossPopup} colorScheme="secondary" variant="solid">
          Cancel
          </Button>
          </div>
          <div className='configuration-popup-save'>
          <Button state={buttonLoading&&'loading'}  colorScheme="danger" style={{width:"100%",padding:".625rem 3rem"}} onClick={handleDraftSave} variant="solid" >
          Delete 
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <div className="configuration-cross-popup-container">
        <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter ()} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };

export default DeleteCampaignPopup;