//@ts-nocheck
import React,{useState,useEffect, useContext} from 'react'
import ProfileInfoBox from '../../components/ProfileInfoBox'
import userprofleicon from '/src/assets/user-profile/user-profile-circle.svg'
import userProfileBotImg from '/src/assets/user-profile/user-profile-bot-img.svg'
import userLocation from '/src/assets/user-profile/location.svg'
import userMail from "/src/assets/user-profile/mail-img.svg"
import userContact from "/src/assets/user-profile/phone.svg"
import userCalender from "/src/assets/user-profile/calendar-check.svg"
import userSignal from "/src/assets/user-profile/signal.svg"
import maritalStatus from "/src/assets/user-profile/marital-status.svg"
import gender from "/src/assets/user-profile/gender.svg"
import dob from "/src/assets/user-profile/date-of-birth.svg"
import "./index.sass"
import { Badge, HTMLTableCell } from '@attrybtech/attryb-ui'
import ConfigurationAccordion from '../../components/ConfigurationAccordion'
import HeaderWithData from '../../components/HeaderWithData'
import EventTimeLine from './EventTimeLine'
import UserRelatedInformation from './UserRelatedInformation'

import { getSingleCustomerData, getSingleUserData, getSingleVisitorData , getCustomerMetaType , getVisitorMetaType } from '../../services/audiences'
import { getRandomProfileIcon } from './DynamicProfileIcon'
import KpiCard from '../../components/kpi-card'
import SummaryProfile from './SummaryProfile'
import MetaData from './metaData'
import { AuthContext } from '../../auth/AuthContext'
import LandingPage from './LandingPages'
import Products from './Products'
import { USER_PROFILE_VIEW } from '../../utils/constants'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { setReduxUserProfileSliceEmpty } from '../../features/core-user-profile-configs/core-user-profile-slice'


const UserProfileView = () => {
  const pathname=window.location.pathname.split("/")
  const [currentActiveOption,setCurrentActiveOption]=useState(0)
  const [userType, setUserType] = useState(pathname[3])
  const [userData,setUserData]=useState({})
	const { containerId } = useContext(AuthContext);
	const [searchParams, setSearchParams] = useSearchParams()
	const tabQueryStatus = searchParams.get('tab')
  const dispatch=useAppDispatch()

  useEffect(() => {
    return () => {
      dispatch(setReduxUserProfileSliceEmpty());
    };
  }, []);

    const setQueryTotheUrl=async(index)=>{
      if(index == 0){
        setSearchParams({tab:USER_PROFILE_VIEW.summery})
      }else if(index == 1){
        setSearchParams({tab:USER_PROFILE_VIEW.eventActivity})
      }else if(index == 2){
        setSearchParams({tab:USER_PROFILE_VIEW.metaData})
      }else if(index == 3){
        setSearchParams({tab:USER_PROFILE_VIEW.landingPages})
      }else if(index == 4){
        setSearchParams({tab:USER_PROFILE_VIEW.products})
      }
    }
    const getVistorData=async()=>{
        try {
         let data=await getSingleUserData(containerId, `/${pathname[3]=='user' ? 'customer' : pathname[3]}/${pathname[4]}`)
         if(data?.data)
          setUserData(data.data[0])
        } catch (error) {
            console.log(error)
        }
    }
  
  async function getUserType (user: string , id: string){
    let response = ""
      
    if(user === 'visitor') {
      response = await getVisitorMetaType(containerId, id)
    } else {
      response = await getCustomerMetaType(containerId, id)
    }
    return response
 }
   async function completeFunction () {
    try {
      await getVistorData()
      const data = await getUserType(pathname[3] , pathname[4])
      setUserType(data?.data[0]?.user_category)
    } catch (error) {
      
    }
   
  }

  useEffect(()=>{
    if(containerId){
      completeFunction()
    }
  },[pathname[4], containerId])

  useEffect(()=>{
    if(tabQueryStatus == USER_PROFILE_VIEW.summery){
      setCurrentActiveOption(0)
    }else if(tabQueryStatus == USER_PROFILE_VIEW.eventActivity){
      setCurrentActiveOption(1)
    }else if(tabQueryStatus == USER_PROFILE_VIEW.metaData){
      setCurrentActiveOption(2)
    }else if(tabQueryStatus == USER_PROFILE_VIEW.landingPages){
      setCurrentActiveOption(3)
    }else if(tabQueryStatus == USER_PROFILE_VIEW.products){
      setCurrentActiveOption(4)
    }
  },[tabQueryStatus])
  

 const refrenceProfileData= [
    {
        "_id": 1,
        "title": "Name",
        "iconVariant": {"img": userprofleicon},
        "text":userData?.name||"-"
    },
    {
        "_id": 2,
        "title": "Email",
        "iconVariant": {"img": userMail},
        "text": userData?.email||"-"
    },
    {
        "_id": 3,
        "title": "Contact Number",
        "iconVariant": {"img": userContact},
        "text": userData?.contact_number||"-"
    },
    {
        "_id": 4,
        "title": "Reachable Channels",
        "iconVariant": {"img": userSignal},
        "text": "-",
        badgesData:[
          {_id:8765,tag:"Email",type:userData?.email_subscription_status},
          {_id:8098,tag:"Whatsapp",type:userData?.whatsapp_subscription_status},
          {_id:2312,tag:"SMS",type:userData?.sms_subscription_status
        }
        ]
    },
    {
        "_id": 5,
        "title": "Gender",
        "iconVariant": {"img": gender},
        "text": userData?.gender||"-"
    },
    {
        "_id": 6,
        "title": "Marital Status",
        "iconVariant": {"img": maritalStatus},
        "text": userData?.marital_status||"-"
    },
    {
        "_id": 7,
        "title": "Date of Birth",
        "iconVariant": {"img": dob},
        "text": userData?.date_of_birth||"-"
    },
    {
        "_id": 8,
        "title": "Address",
        "iconVariant": {"img": userLocation},
        "text": userData?.shipping_address
        ||"-"
    }
 ]
 
 let refrenceUserData=[
  {
    "title": "Personal Information",
    "_id":"34343",
    "data": [
      {
        "title": "Gender",
        "text": userData?.gender||"-",
        "_id": 75
      },
      {
        "title": "Date of Birth",
        "text": userData?.dob||"-",
        "_id": 76
      },
      {
        "title": "Martial Status",
        "text": userData?.maritial_status||"-",
        "_id": 778
      },
      {
        "title": "Shipping Address",
        "text": userData?.shipping_address||"-",
        "_id": 78
      },
      {
        "title": "First Seen at",
        "text": userData?.first_seen_at||"-",
        "_id": 79
      },
      {
        "title": "Billing Address",
        "text": userData?.billing_address||"-",
        "_id": 80
      }
    ]
  },
  {
    "title": "Location",
    "_id":"34343",
    "data": [
      {
        "title": "City",
        "text": userData?.city||"-",
        "_id": 75
      },
      {
        "title": "State",
        "text": userData?.state||"-",
        "_id": 76
      },
      {
        "title": "Country",
        "text": userData?.country||"-",
        "_id": 77
      },
    ]
  },
  {
    "title": "Device Properties",
    "_id":"34343",
    "data": [
      {
        "title": "Device Type",
        "text": userData?.device||"-",
        "_id": 75
      },
      {
        "title": "OS",
        "text": userData?.os||"-",
        "_id": 76
      },
      {
        "title": "Browser",
        "text": userData?.user_agent_context||"-",
        "_id": 77
      },
      {
        "title": "Screen Size",
        "text": userData?.screen_size?userData?.screen_size+" PX":"-",
        "_id": 7734
      }
      
    ]
  },
  {
    "title": "Other",
    "_id":"34343",
    "data": [
      {
        "title": "Bot Detection",
        "text": userData?.bot_detection||"-",
        "_id": 75
      },
      {
        "title": "Information Confidence",
        "text": userData?.dob||"-",
        "_id": 76
      },
      
    ]
  }
]
const screensArray = [
  {
    name: "Summary" , 
    route: "/profile"
  },
  {
    name: "Event Activity" , 
    route: "/profile"
  },
  {
    name: "Meta Data" , 
    route: "/profile"
  },
  {
    name: "Landing Pages" , 
    route: "/profile"
  },
  {
    name: "Products" , 
    route: "/profile"
  }
]
function capitalizeFirstLetter(input: string): string {
  if (!input)  return ''      
  return input.charAt(0).toUpperCase() + input.slice(1);
}

  return (
    <div className='user-profile-view-details-wrapper'>

    <div className='profile-box-sidebar-wrapper'>
      <div className='profile-sidebar-user-child-first'>
          <div className='user-profile-bot-img-wrapper'>
            {(pathname[3]=='customer' || pathname[3]=='user')? <HTMLTableCell header={`${refrenceProfileData[0]?.text}`} /> : <img src={getRandomProfileIcon(pathname[4])} alt="" />}
          </div>
          <p className='text-md--md'>{pathname[4]||"-"}</p>
          <Badge variant='blue-light' labelText={capitalizeFirstLetter(userType)}/>
      </div>

      <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[0]?.title} iconVariant={refrenceProfileData[0]?.iconVariant} text={refrenceProfileData[0]?.text}/>
          </div>
      <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[1]?.title} iconVariant={refrenceProfileData[1]?.iconVariant} text={refrenceProfileData[1]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[2]?.title} iconVariant={refrenceProfileData[2]?.iconVariant} text={refrenceProfileData[2]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[3]?.title} badgesData={refrenceProfileData[3]?.badgesData} iconVariant={refrenceProfileData[3]?.iconVariant} text={refrenceProfileData[3]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[4]?.title} iconVariant={refrenceProfileData[4]?.iconVariant} text={refrenceProfileData[4]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[5]?.title} iconVariant={refrenceProfileData[5]?.iconVariant} text={refrenceProfileData[5]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[6]?.title} iconVariant={refrenceProfileData[6]?.iconVariant} text={refrenceProfileData[6]?.text}/>
          </div>
          <div className='profile-box-items-wrapper'>
    <ProfileInfoBox title={refrenceProfileData[7]?.title} iconVariant={refrenceProfileData[7]?.iconVariant} text={refrenceProfileData[7]?.text}/>
          </div>

    </div>
    <div className="right-side-section-profile">
      <div className="left-section-header">
        {
            screensArray?.map((element: any , index:number) => (
                <div onClick={()=>{setCurrentActiveOption(index); setQueryTotheUrl(index)}} className={`selecting-template-heading ${ currentActiveOption === index? 'selected-option' : ''}`} >
                   <p className="text-sm" >{capitalizeFirstLetter(element.name)}</p> 
                </div>
            ))
        }
      </div>
    <div className='event-time-line-main'>
    {currentActiveOption==0 ? <SummaryProfile/> : <></>}
    {currentActiveOption==1?<EventTimeLine />:<></>}
    {currentActiveOption==2?<MetaData/>:<></>}
    {currentActiveOption==3?<LandingPage/>:<></>}
    {currentActiveOption==4?<Products/>:<></>}
    </div>
    
    </div>

    
    </div>
  )
}

export default UserProfileView
