//@ts-nocheck
import { useNavigate } from "react-router-dom"
import { useState , useContext, useEffect } from "react"

import pageIcon from "../../assets/images/sidebar/file-minus-02.svg"
import dashboardIcon from "../../assets/images/sidebar/grid.svg"
import segmentIcon from "../../assets/images/sidebar/users.svg"
import useCaseIcon from "../../assets/images/sidebar/useCase-icon.svg"
import campaignIcon from "../../assets/images/sidebar/list.svg"
import brandKitIcon from "../../assets/images/sidebar/cube-outline.svg"
import analyticsIcon from "../../assets/images/sidebar/pie-chart.svg"
import templateLibraryIcon from "../../assets/images/sidebar/layer-three.svg"
import sidebarLogo from "../../assets/images/sidebar/attryb-product.svg"
import "./index.sass"
import { Sidebar } from "@attrybtech/attryb-ui"
import DropDown from "../dropdown"
import SubHeaderUncollapse from "./sub-header-uncollapse"
import { setAlertVisible } from "../../features/globalConfigs/global-slice";

import AppDropDown from '../sidebar-dropdown'
import { getContainers, patchContainerEnabledState, patchContainerSelectedState } from '../../services/containers'
import { AuthContext } from '../../auth/AuthContext'
import greenBrandkiticon from "../../assets/images/sidebar/brandkit-green-icon.svg"
import dasboardGreenIcon from "../../assets/images/sidebar/dashboard-green-icon.svg"
import analyticsGreenIcon from '../../assets/images/sidebar/analytics-green-icon.svg'
import campaignGreenIcon from '../../assets/images/sidebar/campaign-green-icon.svg'
import pagesGreenIcon from '../../assets/images/sidebar/pages-green-icon.svg'
import segmentGreenIcon from '../../assets/images/sidebar/segments-green-icon.svg'
import useCaseGreenIcon from '../../assets/images/sidebar/usecase-green-icon.svg'
import templateLibraryGreenIcon from "../../assets/images/sidebar/template-library-green-icon.svg"
import { PRODUCT_NAME, SIDEBAR_DATA } from "../../utils/constants"
import { useAppDispatch } from "../../app/hooks"

const {
    VITE_AUTH_URL:AUTH_URL
} = import.meta.env

const AppSidebar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [userId , setUserId] = useState<string>('')
    const authContext: any = useContext(AuthContext);
    const [domainsNames, setDomainsNames] = useState<any>([])
    const [selectedDomain, setselectedDomain] = useState<any>()
    const [sidebarState, setSidebarState] = useState(false)

    const {containerData ,isCustomerSubscribed,allContainers } = authContext;
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (authContext?.userId)
            setUserId(authContext?.userId);
    }, [authContext])   

    useEffect(() => {
        if(isCustomerSubscribed && containerData?.settings && containerData?.settings[0].scriptInjected) {
            setSidebarState(true)
        }
    }, [containerData , isCustomerSubscribed])
    
    useEffect(() => {
        if (authContext.hasOwnProperty('containerData')) {
            setselectedDomain(authContext.containerData);
            if(  Object.keys(authContext.containerData).length)
                    setDomainsNames([authContext.containerData])
        } else {
           
            
        }
        if(allContainers.length==1){
            setselectedDomain(allContainers[0])
        }
    }, [userId, authContext.containerId,allContainers])

    const signOutCallback = async () => {
        try {
            await authContext.logout(() =>
                window.open(`${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`, "_self", "noreferrer")
            );
        } catch (error) {}
    };
    const handleSupportCallback = () =>{
        window.open('https://attryb.com/contact-us', '_blank');
    };
    const updateContainerEnableState=async(selectedElement:any)=>{
        try {
       
          let data=await patchContainerSelectedState(selectedElement?._id,{isSelected:true,accountId:selectedElement?.accountId})
          window.location.reload()
        } catch (error) {
          
        }
    }
   async function DropDownFunction(res : any) {
            setselectedDomain(res)
            setIsOpen(!isOpen)
          await  updateContainerEnableState(res)
        //   window.location.reload()
    }

    const subHeaderComponent = {

        collapse: <SubHeaderUncollapse/> ,
        uncollapse: <AppDropDown isOpen={isOpen} setIsOpen={setIsOpen} selectedElement={selectedDomain} listOfItems={domainsNames} DropDownFunction={DropDownFunction} /> ,
    }
    const  sideBarHeaderData= {
         sideBarHeaderTitle:"Web Personalization" , 
         sideBarLogo:sidebarLogo
    }  
    const sidebarData = [
        {
            _id: "1",
            title: "Onboarding",
            route: SIDEBAR_DATA.Onboarding,
            asset: dashboardIcon,
            selectedAsset:dasboardGreenIcon
        },
        {
            _id: "2",
            title: "Campaigns",
            route: SIDEBAR_DATA.Campaigns,
            asset: campaignIcon,selectedAsset:campaignGreenIcon
        },
        {
            _id: "3",
            title: "Use Cases",
            route: SIDEBAR_DATA["Use Cases"],
            asset: useCaseIcon,
            selectedAsset:useCaseGreenIcon
        },
        {
            _id: "33",
            title: "Audiences",
            route: SIDEBAR_DATA.Audiences,
            asset: segmentIcon,
            selectedAsset:segmentGreenIcon,
            subItems:[
                {
                _id: "331",
                title: "Find Visitors",
                route: SIDEBAR_DATA["Find Visitors"],
                asset: useCaseIcon,
                selectedAsset:useCaseGreenIcon
            },
            {
                _id: "332",
                title: "Segments",
                route: SIDEBAR_DATA.Segments,
                asset: useCaseIcon,
                selectedAsset:useCaseGreenIcon
            }
            ]
        },
        {
            _id: "6",
            title: "Template Library",
            route: SIDEBAR_DATA["Template Library"],
            asset: templateLibraryIcon,selectedAsset:templateLibraryGreenIcon
        },
        {
            _id: "5",
            title: "Pages",
            route: SIDEBAR_DATA.Pages,
            asset: pageIcon,selectedAsset:pagesGreenIcon,
            isDisabled:true,
        },
      
        {
            _id: "7",
            title: "Brand Kit",
            route: SIDEBAR_DATA["Brand Kit"],
            asset: brandKitIcon,selectedAsset:greenBrandkiticon,
            isDisabled:true,
        },
        {
            _id: "8",
            title: "Analytics",
            route: SIDEBAR_DATA["Analytics"],
            asset: analyticsIcon,selectedAsset:analyticsGreenIcon,
            isDisabled:true,
        }
    ]

    const navigate = useNavigate() ;
    function handleOnClick (str : string , ele: any) {
        // if(sidebarState){
           
        // }
        // else {
        //     dispatch(setAlertVisible({content:"Please Complete All The Onboarding Steps First",theme:"warning",visible:true}))
        // }
        navigate(str)
    }
    return (
        // <></>
        <Sidebar sideBarHeaderData={sideBarHeaderData} sidebarData={sidebarData} handleItemOnClick={handleOnClick} subHeaderComponent={subHeaderComponent} signOutCallback={signOutCallback} supportCallback={handleSupportCallback} />
    )
}

export default AppSidebar;