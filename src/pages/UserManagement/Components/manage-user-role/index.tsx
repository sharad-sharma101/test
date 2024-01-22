import React, { useState, useEffect, useContext } from 'react';
import "./index.sass";
import AppPopup from '../../../../components/app-popup';
import RadioButton from '../../../../components/radio-input';
import TextInput from '../../../../components/text-input';
import { createUserData } from '../../../../services/user';
import cirleIcon from "../../../../assets/icons-v2/circle-icon.svg"
import { options } from "../invite-popup/options";
import userRoleIcon from "../../../../assets/icons-v2/UserRole Featured icon.svg"
import { AuthContext } from '../../../../auth/AuthContext';
import {USER_ROLE} from "../../../../utils/constants"
import {Button} from '@attrybtech/attryb-ui'
import closeX from "../../../../assets/icons-v2/defaultX.svg"
import { errorService, httpClient } from '../../../../libs';
import { handleFormSubmitRole } from '../../../../services/user';

export const RoleChangePopup: React.FC<any> = ({user, setRoleChangePopup,userDetail,showUpdatePopup,roleUpdated}) => {
  const { accountId, containerId }: any = useContext(AuthContext)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(USER_ROLE.Admin);
  const [status, setStatus] = useState(Boolean);
  const [customMessage, setCustomMessage] = useState("");
  const [openModal, setOpenModal] = useState(true);

useEffect(()=>{
  setFirstName(userDetail.firstName)
  setLastName(userDetail.lastName)
  setEmail(userDetail.email)
},[])
 
  async function handleClick(firstName: string, lastName: string, email: string, role: string, customMessage: string, status: boolean, accountId: string, containerId: string) {

  }


  const PopupHeader = () => {
    return (
      <div className='manage-role-popup-header-container'>
        <div className="manage-role-popup-icons">
          <div className='manage-role-popup-left-icon'>
            <div className="manage-role-popup-background-circles">
              <img src={cirleIcon} alt="" />
            </div>
            <div className="manage-role-popup-icon">
              <img src={userRoleIcon} alt="" />
            </div>
          </div>
          <div className="manage-role-popup-cross-wrapper" onClick={()=>{setRoleChangePopup()}} >
          <div className="manage-role-popup-cross-icon">
            <img src={closeX} alt="" className="cross-default-icon" />
            </div>
          </div>
        </div>
        <div className="manage-role-popup-header-text text-lg--sb">
          <p>Manage User Role</p>
        </div>
      </div>
    )
  }

  const PopupBody = () => {
    return (
      <div className="manage-role-popup-body">
        <div className="manage-role-popup-user-name-input">
          <TextInput
            label={"First Name"}
            placeholder="Enter your First Name"
            value={firstName}
            state={"disabled"}
            onChange={(e:any) => setFirstName(e.target.value)}
          />
          <TextInput
            label={"Last Name"}
            placeholder={"Enter your Last Name"}
            value={lastName}
            state={"disabled"}
            onChange={(e:any) => setLastName(e.target.value)}
          />
        </div>
        <div className="manage-role-popup-email-input">
          <TextInput
            label={"Email Address"}
            placeholder="Enter your Email Address"
            value={email}
            state={"disabled"}
            onChange={(e:any) => setEmail(e.target.value)}
          />
        </div>
        <div className="manage-role-input text-sm--md">
          <div className="manage-role-popup-label">Role</div>
          <div className="manage-role-popup-radio-input">
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
      </div>
    )
  }
  
  const PopupFooter = () => {

    return (
      <div className="manage-role-submit-buttons">
       
        <Button  onClick={()=>setRoleChangePopup()} variant="solid" colorScheme="secondary">
        Cancel
        </Button>
        <Button  onClick={() => {handleFormSubmitRole(firstName, lastName, email, role, customMessage, status, accountId, containerId); showUpdatePopup(false); roleUpdated()}} variant="solid">
        Save Changes
        </Button>
      </div>
    )
  }
  return (
    <div className="manage-role-popup-container">
      <AppPopup header={PopupHeader()} body={PopupBody()} footer={PopupFooter()} openModal={openModal} setOpenModal={(e: any) => setRoleChangePopup(e)} />
    </div>
  )
}  