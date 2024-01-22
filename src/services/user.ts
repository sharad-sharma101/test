
import { httpClient, errorService } from "../libs"

const { VITE_USER_MANAGEMENT_BASE_URL: USER_MANAGEMENT_URL } = import.meta.env;




const handleFormSubmit = async (id: string) => {
    try {
      await httpClient.put(`${USER_MANAGEMENT_URL}/user/invites/${id}`, {},{})
      revokeUser(id);
    } catch (error) {
      errorService.reportError(error);
    }
  };

  
  const handleFormSubmitRole = async(firstName: string, lastName: string, email: string, role: string, customMessage: string, status: boolean, accountId:string, containerId:string) => {
    try{
      await httpClient.put(`${USER_MANAGEMENT_URL}/user/accepted`, {},{role,email})
    } catch (error) {
      errorService.reportError(error);
    } 
  }

async function createUserData(body:any){
    const response: any = await httpClient.post(`${USER_MANAGEMENT_URL}/user/invite`, {},
        body
    ,);

    const userData = response.data.data
    return userData
}


async function getInviteUserInfo(accountId:string){
    try {
        const response:any = await httpClient.get(`${USER_MANAGEMENT_URL}/user/invite/${accountId}`, {})
        return response.data.data
    } catch (error) {
        errorService.reportError(error)
    }
}


async function getResendUserInfo(id:string){
    try {
        const response:any = await httpClient.post(`${USER_MANAGEMENT_URL}/user/invite/${id}`,{} ,{})
		const data = response.data
        return data;
    } catch (error) {
        errorService.reportError(error)
    }
} // function for the resend invitation



async function revokeUser(id:string) {
	try {
		const response: any = await httpClient.put(
			`${USER_MANAGEMENT_URL}/user/invite/${id}`,{},
			{ revoke: true } 

		);
		return response.data 
		
	} catch (error) {
		errorService.reportError(error);
	}
}




async function getAcceptedUserInfo(accountId:string){
    try {
        const response:any = await httpClient.get(`${USER_MANAGEMENT_URL}/user/accepted/${accountId}`, {})
		
        return response.data.data
    } catch (error) {
        errorService.reportError(error)
    }
}


const resetRole = async (user:any, updatedRole: string) => {
    try {
	await httpClient.put(
			`${USER_MANAGEMENT_URL}/user/accepted/${user._id}`,{},
			{ role: updatedRole  } 
		)
		
	} catch (error) {
		errorService.reportError(error);
	}
};


async function deleteMapUser(user:any) {
	try {
		const response: any = await httpClient.deleteRequest(
			`${USER_MANAGEMENT_URL}/user/accepted/${user}`,{},
		)
        return response;
        
	} catch (error) {
		errorService.reportError(error);
	}
}


const resetStatus = async (user:any, updatedStatus: boolean) => {
    try {
		const response: any = await httpClient.put(
			`${USER_MANAGEMENT_URL}/user/${user._id}`,{},
			{ status: updatedStatus  } 

		);
	} catch (error) {
		errorService.reportError(error);
	}
};

export { getInviteUserInfo, createUserData, resetStatus, revokeUser, deleteMapUser, resetRole,getAcceptedUserInfo, getResendUserInfo,handleFormSubmit,handleFormSubmitRole}

function showUpdatePopup(arg0: boolean) {
    throw new Error("Function not implemented.");
}


function roleUpdated() {
    throw new Error("Function not implemented.");
}
