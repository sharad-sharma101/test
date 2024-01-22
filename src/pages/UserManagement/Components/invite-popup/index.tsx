import React, { useState, useEffect, useContext } from 'react';
import "./index.sass";
import { EditableBlock } from '../../../../components/editable-block';
import AppPopup from '../../../../components/app-popup';
import { options } from "./options";
import RadioButton from '../../../../components/radio-input';
import TextInput from '../../../../components/text-input';
import { createUserData } from '../../../../services/user';
import cirleIcon from "../../../../assets/icons-v2/circle-icon.svg"
import messageIcon from "../../../../assets/icons-v2/message-icon.svg"
import { AuthContext } from '../../../../auth/AuthContext';
import {validateForm} from "../invite-popup/validator"
import {USER_ROLE} from "../../../../utils/constants"
import {Button} from '@attrybtech/attryb-ui'
import closeX from "../../../../assets/icons-v2/defaultX.svg"

export const InvitePopupComponent: React.FC<any> = ({ setShowPopup, userData }) => {
  const { accountId, containerId }: any = useContext(AuthContext)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(USER_ROLE.Admin);
  const [status, setStatus] = useState(Boolean);
  const [customMessage, setCustomMessage] = useState("");
  const [openModal, setOpenModal] = useState(true);


  async function handleClick(firstName: string, lastName: string, email: string, role: string, customMessage: string, status: boolean, accountId: string, containerId: string) {
    await createUserData({firstName, lastName, email, role, customMessage, status, accountId, containerId})
    setOpenModal(false);
    userData();
    setShowPopup(false);

  }

  const handleFormSubmit = (firstName: string, lastName: string, email: string, role: string, customMessage: string, status: boolean, accountId:string, containerId:string) => {
    const isValid = validateForm(firstName, lastName, email );
    if (isValid) {
      handleClick(firstName, lastName, email, role, customMessage, status, accountId, containerId);
    }
  }

  const PopupHeader = () => {
    return (
      <div className='invite-popup-header-container'>
        <div className="invite-popup-icons">
          <div className='invite-popup-left-icon'>
            <div className="invite-popup-background-circles">
              <img src={cirleIcon} alt="" />
            </div>
            <div className="invite-popup-message-icon">
              <img src={messageIcon} alt="" />
            </div>
          </div>
          <div className="invite-popup-cross-wrapper" onClick={() => setShowPopup(false)} >
          <div className="invite-popup-cross">
            <img src={closeX} alt="" className="default-icon" />
            </div>
          </div>
          
        </div>
        <div className="invite-popup-header-text text-lg--sb">
          <p>Invite Member</p>
        </div>
      </div>
    )
  }

  const PopupBody = () => {
    return (
      <div className="invite-popup-body">
        <div className="invite-popup-user-name-input">
          <TextInput
            label={"First Name"}
            placeholder="Enter your First Name"
            value={firstName}
            onChange={(e:any) => setFirstName(e.target.value)}
          />
          <TextInput
            label={"Last Name"}
            placeholder={"Enter your Last Name"}
            value={lastName}
            onChange={(e:any) => setLastName(e.target.value)}
          />
        </div>
        <div className="invite-popup-email-input">
          <TextInput
            label={"Email Address"}
            placeholder="Enter your Email Address"
            value={email}
            onChange={(e:any) => setEmail(e.target.value)}
          />
        </div>
        <div className="invite-popup-role-input text-xs--sb">
          <div className="invite-popup-role-label">Role</div>
          <div className="invite-popup-radio-input-container">
            {options.map((option) => (
              <div key={option.value}>
                <RadioButton
                  value={option.value}
                  label={option.heading}
                  content={option.content}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="invite-popup-custom-message-input">
          <div className="invite-popup-custom-message">
            <div className="invite-popup-custom-message-label">
              <p className='text-sm--md'>Custom Message</p>
            </div>
            <div>
              <EditableBlock
                placeholder={'Optional'}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const PopupFooter = () => {

    return (
      <div className="invite-popup-submit-buttons">
       
        <Button  onClick={() => setShowPopup(false)} variant="solid" colorScheme="secondary">
        Cancel
        </Button>
        <Button  onClick={() => handleFormSubmit(firstName, lastName, email, role, customMessage, status, accountId, containerId)} variant="solid">
        Invite
        </Button>
      </div>
    )
  }
  return (
    <div className="invite-popup-container">
      <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter()} openModal={openModal} setOpenModal={(e: any) => setShowPopup(e)} />
    </div>
  )
}  