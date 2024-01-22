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

export const ConfigurationCrossPopup: React.FC<any> = ({ close, reference, saveConfiguration,saveBtnLoading,currentIndex}) => {
    const navigate = useNavigate();
    const dispatch=useAppDispatch()
    const [openModal, setOpenModal] = useState(true)

    const {variantObject , variantName,completedStep}=useAppSelector((store)=>store.templateConfigs)
    const {statusTabTitle} = useAppSelector((store:any)=>store.coreFeaturesSlice)
    const [saveButtonLoading,setSaveButtonLoading]=useState(false)

    async function handleDraftSave() {
      let content;
      if(variantName.trim() === ''){
        dispatch(setAlertVisible({content:"Your Variant Name Cannot Be Empty",theme:"danger",visible:true}))
        return;
      }
      
      if(variantObject.isDraft){
        content="Draft Saved Successfully"
      }else{
        content="Changes Saved Succesfully"
      }
      setSaveButtonLoading(true)
      await saveConfiguration()
      setSaveButtonLoading(false)
      close(false);
    dispatch(setAlertVisible({theme:"success",content,visible:true}))
        navigate(`/my-campaigns/${variantObject?.campaignId?._id}?status=${statusTabTitle}`)
        dispatch(setReduxTemplateSliceEmpty())
        dispatch(setReduxTriggersSliceEmpty())
      }
    function handleCrossPopup () {
      let content='Changes Discarded';
      dispatch(setAlertVisible({theme:"warning",content,visible:true}))
      navigate(`/my-campaigns/${variantObject?.campaignId?._id}?status=${statusTabTitle}`)
      dispatch(setReduxTemplateSliceEmpty())
      dispatch(setReduxTriggersSliceEmpty())
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
             <div>
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
            <p>Unsaved changes</p>
          </div>
          <div className='configuration-cross-popup-description text-sm'>
            <p>If you leave this page, any changes you have made will be lost.</p>
          </div>
          {variantObject.isDraft===true?  <div  style={{width:"100%",marginTop:"1.25rem"}}>
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
          <Button style={{padding:".625rem 3.5rem"}} onClick={ handleCrossPopup} colorScheme="secondary" variant="solid">
          Discard
          </Button>
          </div>
          <div className='configuration-popup-save'>
          <Button state={saveButtonLoading&&"loading"}  style={{width:"100%"}} onClick={handleDraftSave} variant="solid" >
          {completedStep.step>4?'Save and Exit':`Save as Draft`}
          </Button>
          </div>
        </div>
      );
    };
  
    return (
      <div className="configuration-cross-popup-container">
        <AppPopup header={PopupHeader ()} body={PopupBody()} footer={PopupFooter()} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };
  