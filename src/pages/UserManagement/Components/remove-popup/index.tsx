import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../../components/app-popup';
import backgroundPattern from "../../../../assets/icons-v2/Background pattern decorative.svg"
import deleteIcon from "../../../../assets/icons-v2/Featured icon.svg"
import {deleteMapUser} from "../../../../services/user"
import { Button } from '@attrybtech/attryb-ui';
import closeX from "../../../../assets/icons-v2/defaultX.svg"
export const RemovePopup: React.FC<any> = ({ close, userId, userData,deleteSuccessful}) => {
  const [openModal, setOpenModal] = useState(true)

  const handleDeleteUser = async (userId:any) => {
      const response = await deleteMapUser(userId);
      deleteSuccessful();
    close(false)
    userData()
  };

    const PopupHeader = () => {
      return (
        <div className="remove-popup-header-container">
          <div className="remove-icons">
            <div className="remove-left-icon">
                <div className='remove-background-pattern'>
                <img src={backgroundPattern} alt="" />
                </div>
             <div className='mail-icon'>
             <img src={deleteIcon} alt="" />
             </div>
              
            </div>
            <div className="remove-cross-wrapper" onClick={() => close(false)}>
            <div className="remove-cross-icon">
            <img src={closeX} alt="" className="default-icon" />
            </div>
            </div>
          </div>
        </div>
      );
    };
  
    const PopupBody = () => {
      return (
        <div className="remove-popup-body">
          <div className="remove-popup-header-text text-lg--sb">
            <p>Remove Member</p>
          </div>
          <div className='remove-popup-description text-sm'>
            <p>You are about to remove a member which will not allow this person to access your organization </p>
          </div>
        </div>
      );
    };
  
    const PopupFooter = () => {
      return (
        <div className="remove-submit-button">
          <Button style={{width:"11rem"}} onClick={() => close(false)} variant="solid" colorScheme="secondary">
          Keep Member
          </Button>
          <Button style={{width:"11rem"}} colorScheme="danger"  onClick={() => handleDeleteUser(userId)} >
          Remove Member
          </Button>
        </div>
      );
    };
  
    return (
      <div className="popup-container">
        <AppPopup header={<PopupHeader />} body={<PopupBody />} footer={<PopupFooter />} openModal={openModal} setOpenModal={(e: any) => close(e)} />
      </div>
    );
  };
  