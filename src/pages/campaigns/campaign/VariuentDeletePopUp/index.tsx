import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../../../src/components/app-popup/index';
import closeIcon from "../../../../../src/assets/icons-v2/closeIcon.svg"
import backgroundPattern from "../../../../assets/icons-v2/Background pattern decorative.svg"
import deleteIcon from "../../../../assets/icons-v2/Delete Featured icon.svg"
import { Button } from "@attrybtech/attryb-ui"

export const VarientDeletePopup: React.FC<any> = ({ close, reference, saveConfiguration, handleDelete, rowItem, deleteLoadder }) => {

  const [openModal, setOpenModal] = useState(true)

  function handleCrossPopup() {
    close(false)
  }
  const PopupHeader = () => {
    return (
      <div className="configuration-cross-popup-header-variant">
        <div className="configuration-cross-popup-icons-variant">
          <div className="configuration-cross-popup-left-icon-variant">
            <div className='configuration-popup-background-pattern-variant'>
              <img src={backgroundPattern} alt="" />
            </div>
            <div className=''>
              <div className='configuration-popup-mail-icon-variant'>
                <img src={deleteIcon} alt="" />

              </div>
              <span className="configuration-popup-hover-circle-variant"></span>
            </div>

          </div>
          <div className="varient-delete-close-icon-variant" onClick={() => close(false)}>
            <img src={closeIcon} alt="" className="default-icon-variant" />
          </div>
        </div>
      </div>
    );
  };

  const PopupBody = () => {
    return (
      <div className="configuration-cross-popup-body-variant">
        <div className="configuration-cross-popup-heading-variant text-lg--sb">
          <p>Delete Variant</p>
        </div>
        <div className='configuration-cross-popup-description-variant text-sm'>
          <p>Are you sure you want to delete this Variant?</p>
        </div>
      </div>
    );
  };


  const PopupFooter = () => {
    return (
      <div className="configuration-cross-popup-button-variant">
        <div className='configuration-popup-discard-variant' >
          <Button style={{ padding: "1rem 2rem", width: "100%" }} onClick={handleCrossPopup} colorScheme="secondary" variant="solid">
            Keep Variant
          </Button>
        </div>
        <div className='configuration-popup-save-variant' >
          <Button state={deleteLoadder && "loading"} style={{ width: "100%", padding: "1rem 2rem" }} onClick={() => { handleDelete(rowItem) }} colorScheme="danger" variant="solid" >
            Delete Variant
          </Button>
        </div>
      </div>
    );
  };


  return (
    <div className="configuration-cross-popup-container-variant">
      <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter()} openModal={openModal} setOpenModal={(e: any) => close(e)} />
    </div>
  );
};