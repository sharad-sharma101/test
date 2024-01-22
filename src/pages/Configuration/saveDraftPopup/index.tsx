import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../components/app-popup';
import closeIcon from "../../../assets/icons-v2/crossIcon.svg"
import backgroundPattern from "../../../assets/icons-v2/Background pattern decorative.svg"
import unsavedIcon from "../../../assets/icons-v2/UnsavedFeatured icon.svg"
import {Button} from "@attrybtech/attryb-ui"
import { useNavigate } from 'react-router'
import hoverX from "../../../assets/icons-v2/hoverX.svg"
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setReduxTemplateSliceEmpty, setVariantName } from '../../../features/templates/template-slice';
import { setReduxTriggersSliceEmpty } from '../../../features/triggers/triggers-slice';
import { setAlertVisible } from '../../../features/globalConfigs/global-slice';
import TextInput from '../../../components/text-input';

export const SaveAsDraftPopup: React.FC<any> = ({ close, reference, saveConfiguration}) => {
    const navigate = useNavigate();
    const dispatch=useAppDispatch()
    const [openModal, setOpenModal] = useState(true)

    const {variantObject , variantName,completedStep}=useAppSelector((store)=>store.templateConfigs)
    const {statusTabTitle} = useAppSelector((store:any)=>store.coreFeaturesSlice)
    

    function handleDraftSave() {
      
      
      if(variantName.trim() === ''){
        dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
        return;
      }
      saveConfiguration()
      dispatch(setAlertVisible({content:"Draft Saved Succesfully",theme:"success",visible:true}))
        close(false);
      
        navigate(`/my-campaigns/${variantObject?.campaignId?._id}?status=${statusTabTitle}`)
        dispatch(setReduxTemplateSliceEmpty())
        dispatch(setReduxTriggersSliceEmpty())
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
             <img src={unsavedIcon} alt="" />

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
            <p>Save as Draft</p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
            <p>Please enter a name for this Variant.</p>
          </div>
        {variantObject.isDraft==true?  <div  style={{width:"100%",marginTop:"1.25rem"}}>
          <TextInput
            label={"Name"}
              placeholder="e.g. Varaint1"
              value={variantName}
              onChange={(e) => dispatch(setVariantName(e.target.value))}  />
          </div>:null}
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
          <Button  style={{width:"100%",padding:".625rem 3rem"}} onClick={handleDraftSave} variant="solid" >
          {completedStep.step>4?'Save and Exit':`Save as Draft`}
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <div className="configuration-cross-popup-container">
        <AppPopup header={PopupHeader()} body={PopupBody()} footer={<PopupFooter />} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };
  