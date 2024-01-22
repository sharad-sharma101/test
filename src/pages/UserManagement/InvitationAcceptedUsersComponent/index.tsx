import React, { useState } from 'react'
import deleteIcon from "../../../assets/icons-v2/deleteIcon.svg";
import { RemovePopup } from '../Components/remove-popup';
import { Table, HTMLTableCell } from "@attrybtech/attryb-ui"
import editPen from "../../../assets/icons-v2/editPen Icon.svg";
import { RoleChangePopup } from "../Components/manage-user-role/index"
import "./index.sass"


interface IColumnType<T> {
  key: string;
  title: string;
  style?: React.CSSProperties;
  render?: (column: IColumnType<T>, item: T) => void;
}

interface Props {
  user: any[];
  onUpdateStatus: (userId: string, updatedStatus: boolean) => void;
  onUpdateRole: (userId: string, updatedRole: string) => void;
  userData: () => void;
  renderData: () => void
}


const InviteAcceptedUser: React.FC<Props> = ({ user, userData, renderData }) => {
  const columns: IColumnType<any>[] = [
    {
      key: "userName",
      title: "Name",
      style: { width: 530 },
      render: (_, { firstName, lastName, email }) => (
        <>
          <HTMLTableCell header={firstName + " " + lastName} description={email} />
        </>
      )
    },
    {
      key: "role",
      title: "Role",
      style: { width: 400 },
      render: (_, { role }) => (
        <>
          {role}
        </>
      )
    },
    {
      key: "",
      title: "",
      style: { width: 56 },
      render: (_, { firstName, lastName, email, role }) => (
        <div className='edit-pen-wrapper'>
          <img className="edit-pen" src={editPen} onClick={() => { handleRoleChange(firstName, lastName, email, role) }}></img>
        </div>
      )
    },
    {
      key: "",
      title: "",
      style: { width: 68 },
      render: (_, { _id }) => (
        <div className='manage-role-delete-icon-wrapper'>
          <img className="manage-role-delete-icon" src={deleteIcon} onClick={() => { handleRemoveInvite(_id) }}  ></img>
        </div>
      )
    },

  ];

  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [showRoleChangePopup, setShowRoleChangePopup] = useState(false);
  const [removeMapUser, setRemoveMapUser] = useState("");
  const [userDetail, setUserDetail] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  const handleRemoveInvite = async (_id: string) => {
    setRemoveMapUser(_id);

    setShowRemovePopup((prevState) => !prevState);
  };
  const handleRoleChange = (firstName: string, lastName: string, email: string, role: string) => {

    setUserDetail({
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
    });

    setShowRoleChangePopup((prevState) => !prevState);
  };

  const data: any[] = [...user]

  return (
    <>
      <div className="user-management-accept-user-table" style={{ width: "100%" }}>
        <Table
          data={data}
          columns={columns}
          showPaginationFooter={false}
        />
      </div>
      {showRemovePopup &&
        <RemovePopup
          userId={removeMapUser}
          deleteSuccessful={() => renderData()}
          close={() => [setShowRemovePopup(false), renderData()]}
          userData={userData}
        />
      }
      {
        showRoleChangePopup &&
        <RoleChangePopup
          roleUpdated={() => renderData()}
          showUpdatePopup={(e: any) => [setShowRoleChangePopup(e), renderData()]}
          user={user}
          userDetail={userDetail}
          userData={userData}
          setRoleChangePopup={setShowRoleChangePopup}
        />
      }
    </>
  );
};

export default InviteAcceptedUser