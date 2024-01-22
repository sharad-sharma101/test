import React, { useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react';
import './index.sass';
import { Button } from '@attrybtech/attryb-ui';
import { InvitePopupComponent } from './Components/invite-popup';
import { AuthContext } from "../../auth/AuthContext"
import { getInviteUserInfo, resetRole,getAcceptedUserInfo, getResendUserInfo} from "../../services/user"
import MessageIcon from "../../assets/icons-v2/MessageIcon.svg"
import ActiveUser from './PendingUsersInvitationComponent';
import InviteAcceptedUser from './InvitationAcceptedUsersComponent';



interface Props {
  user: any;
  onUpdateStatus: (userId: string, updatedStatus: boolean) => void;
  onUpdateRole: (userId: string, updatedRole: string) => void;
  userData: () => void;
  inviteAgain: (id:string) => void;
}


const UserManagement: React.FC = () => {
  const { accountId, containerId }: any = useContext(AuthContext);

  const [showInvitePopup, setInvitePopup] = useState(false);

  const [activeUsers, setActiveUsers] = useState<any>([]);
  const [inviteAcceptedUser, setInviteAcceptedUser] = useState<any[]>([]);


  const handleClick = () => {
    setInvitePopup((prevState) => !prevState);
  };

  const updateUserStatus = async (userId: any, updatedStatus: boolean) => {
  }

  const updateUserRole = async (userId: any, updatedRole: string) => {
    const userRole = await resetRole(userId, updatedRole)
    userInfoAccepted()

  }

  const userInfo = async () => {
    const response: any = await getInviteUserInfo(accountId)
    const data: any = await response;
    setActiveUsers(data.filter((user:any) => !user.status && !user.revoke));
  }

  const userInfoAccepted = async () => {
    const response: any = await getAcceptedUserInfo(accountId)
    const data: any = await response;
    setInviteAcceptedUser(data.filter((user:any) => user.accountId));
  };

  
  const inviteAgain = async (id: string) => {
    try {
      const response: any = await getResendUserInfo(id);
      const data: any = await response;
      return data;
    } catch (error) {
    }
  }

  useEffect(() => {
    userInfo();
    userInfoAccepted();


  }, [accountId,]);

  return (
    <div className="user-management-main-container">
      <div className="user-management-header-container">
        <div className="user-management-header-top display-sm--sb">
          <p>User Management</p>
        </div>
        <div className="user-management-header-down text-md">
          <p>Add or manage your Domains</p>
        </div>
      </div>
      <div className="user-managemnet-information-container">
        <div className="user-management-information">
          <div className="user-left-side-label">
            <div>
              <div className="user-left-side-header text-md--sb">
                <p>Users</p>
              </div>
              <div className="user-left-side-description text-sm">
                <p>Add or Remove Users and manage their roles and permissions</p>
              </div>
            </div>
            <div className="user-management-invite-button" >
              <Button onClick={handleClick} style={{ padding: "8px 14px" }} >
                <div className='user-management-invite-button-content'>
                  <img src={MessageIcon}></img>
                  <div> Invite People</div>
                </div>
              </Button>
            </div>
          </div>
          <div className='user-detail-table'>
            <InviteAcceptedUser
              renderData={() => userInfoAccepted()}
              user={inviteAcceptedUser}
              onUpdateRole={() => updateUserRole}
              userData={userInfo} onUpdateStatus={function (userId: string, updatedStatus: boolean): void {
                throw new Error('Function not implemented.');
              } }      

            />
          </div>

        </div>
        <hr className='break-line' />
        <div className="user-management-information">
          <div className="user-left-side-label down-left-label">
            <div>
              <div className="user-left-side-header text-md--sb">
                <p>Pending Invites</p>
              </div>
              <div className="user-left-side-description text-sm">
                <p>Manage the status of user account invitations that have been sent out but have not yet been accepted by the recipients
                </p>
              </div>
            </div>
          </div>
          <div className="user-detail-table">
            <ActiveUser
              user={activeUsers}
              onUpdateStatus={updateUserStatus}
              onUpdateRole={updateUserRole}
              getResendUserInfo={(id) => inviteAgain(id)}
              userData={userInfo} renderData={function (): void {
                throw new Error('Function not implemented.');
              } } removeUser={function (user: string): void {
                throw new Error('Function not implemented.');
              } } />
          </div>
        </div>
        {showInvitePopup && <InvitePopupComponent setShowPopup={() => setInvitePopup(false)} userData={() => userInfo()} />}
      </div>
    </div>
  );
};

export default UserManagement;