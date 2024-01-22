import React, {useState, useEffect} from 'react'
import { RevokePopup } from '../Components/revoke-popup';
import { Table, HTMLTableCell,Button } from "@attrybtech/attryb-ui"
import "./index.sass"
import {getResendUserInfo} from "../../../services/user"

interface Props {
  user: any;
  onUpdateStatus: (userId: string, updatedStatus: boolean) => void;
  onUpdateRole: (userId: string, updatedRole: string) => void;
  userData:()=>void;
  removeUser:(user:string) => void
  renderData:()=>void
  getResendUserInfo:(id:string)=>void
}
interface IColumnType<T> {
	key: string;
	title: string;
	style?: React.CSSProperties; 
	render?: (column: IColumnType<T>, item: T) => void;
  }

const ActiveUser: React.FC<Props> = ({ user, userData,renderData}) => {

  const columns: IColumnType<any>[] = [
    {
      key: "userName",
      title: "Name",
      style: { width: 600}, 
      render: (_, {firstName, lastName, email}) => (
        <>
          <HTMLTableCell header={firstName+" "+lastName}  description={email} />
        </>
      )
    },
    {
      key: "type",
      title: "",
      style: { width: 160}, 
      render: (_, {_id}) => (
        <div className='user-management-active-user-button'>
        <Button    variant="solid" colorScheme="secondary" style={{width:"8.2rem"}} onClick={()=>{handleResendInvite(_id)}}>Resend Invite </Button> 
        </div>
      )
    },
    {
      key: "type",
      title: "",
      style: { width: 160}, 
      render: (_, {_id}) => (
        <div className='user-management-active-user-button'>
        <Button colorScheme="danger"  variant="outline-fill" style={{width:"8.2rem"}}onClick={()=>{handleRevokeInvite(_id)}}>
            Revoke invite
            </Button>
        </div>
      )
    },
  
  ];

    const [showRevokePopup, setShowRevokePopup] = useState(false)
    const [revokeUser, setRevokeUser] = useState("");
  

    
    const handleResendInvite = async (id:any) => {
    getResendUserInfo(id)
    };


    const handleRevokeInvite = async (_id:any) => {
      setRevokeUser(_id);
      ;
  
      setShowRevokePopup((prevState) => !prevState);
    };

    




    const data: any = [...user]
    return (
      <div >
       <div className="user-management-table-parent" style={{width: "100%"}}>
            <Table 
                data={data} 
                columns={columns} 
                showPaginationFooter={false}
                />
        </div>
        {showRevokePopup &&
          <RevokePopup
          userRemove={()=>renderData()}
            user={revokeUser}
            close={() => setShowRevokePopup(false)}
            userData={userData}
          />
        }
      </div>
    );
  };

export default ActiveUser;