import React, { useState, useEffect } from 'react';
// import "./index.sass";
import AppPopup from '../../../components/app-popup';
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import backgroundPattern from "../../../assets/icons-v2/Background pattern decorative.svg"
import unsavedIcon from "../../../assets/icons-v2/UnsavedFeatured icon.svg"
import {Button} from "@attrybtech/attryb-ui"
import { useNavigate } from 'react-router'
import deleteIcon from "../../../assets/icons-v2/Delete Featured icon.svg"
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setReduxTemplateSliceEmpty, setVariantName } from '../../../features/templates/template-slice';
import { setReduxTriggersSliceEmpty } from '../../../features/triggers/triggers-slice';
import { setAlertVisible } from '../../../features/globalConfigs/global-slice';
import TextInput from '../../../components/text-input';
import { deleteCampaign } from '../../../services/campaigns';
import { callCoreFeaturesApiData, setCoreFeaturesLoading } from '../../../features/core-feature-configs/core-features-slice';

export const DeleteCampaignPopup: React.FC<any> = ({ close,campaign}) => {
    const navigate = useNavigate();
    const dispatch=useAppDispatch()
    const [buttonLoading,setButtonLoading]=useState(false)
    const [openModal, setOpenModal] = useState(true)

    const {variantObject , variantName,completedStep}=useAppSelector((store)=>store.templateConfigs)
    

  async  function handleDraftSave() {
    setButtonLoading(true)
    try {
      
        await  deleteCampaign(campaign._id)
        dispatch(setAlertVisible({theme:"success",content:"Campaign Deleted Successfully",visible:true}))
        dispatch(callCoreFeaturesApiData(true))
        setButtonLoading(false)
        close(false)
    } catch (error) {
        setButtonLoading(false)
        dispatch(setAlertVisible({theme:"warning",content:"Failed to Delete Campaign",visible:true}))
    }

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
            <p>Delete Campaign</p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
            <p>Are you sure you want to Delete this Campaign?</p>
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
  