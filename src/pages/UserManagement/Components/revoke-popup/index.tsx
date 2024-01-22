import React, { useState, useEffect } from 'react';
import "./index.sass";
import AppPopup from '../../../../components/app-popup';
// import closeIcon from "../../../../assets/icons-v2/closeIcon.svg"
import backgroundPattern from "../../../../assets/icons-v2/Background pattern decorative.svg"
import mailIcon from "../../../../assets/icons-v2/mail-icon-background.svg"
import {revokeUser } from '../../../../services/user';
import { Button } from '@attrybtech/attryb-ui'
import closeX from "../../../../assets/icons-v2/defaultX.svg"
import { errorService, httpClient } from '../../../../libs';

export const RevokePopup: React.FC<any> = ({ close, user, updateUserData, userData, removeUser, id,handleFormSubmit}) => {
  const [openModal, setOpenModal] = useState(true)
  async function handleClick(user: any, id: string) {
    try {
      await revokeUser(user);
      close(false);
      userData();
      removeUser(id);
    } catch (error) {
    }
  }


  const PopupHeader = () => {
    return (
      <div className="revoke-popup-header">
        <div className="revoke-icons">
          <div className="revoke-left-icon">
            <div className='revoke-background-pattern'>
              <img src={backgroundPattern} alt="" />
            </div>
            <div className='mail-icon'>
              <img src={mailIcon} alt="" />
            </div>

          </div>
          <div className="revoke-cross-wrapper" onClick={() => close(false)}>
            <div className="revoke-cross-icon">
              <img src={closeX} alt="" className="default-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PopupBody = () => {
    return (
      <div className="revoke-popup-body">
        <div className="revoke-popup-header text-lg--sb">
          <p>Revoke Invite</p>
        </div>
        <div className='revoke-popup-description text-sm'>
          <p>Revoking an invite will no longer allow this person to become a member of your organization</p>
        </div>
      </div>
    );
  };


  const PopupFooter = () => {
    return (
      <div className="revoke-submit-button">
        <Button style={{ width: "12.43rem" }} variant="solid" colorScheme="secondary" onClick={() => close(false)}>
          Keep Invite
        </Button>
        <Button style={{ width: "12.43rem" }} colorScheme="danger" onClick={() => handleClick(user, id)}>
          Revoke Invite
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
