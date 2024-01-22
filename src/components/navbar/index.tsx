// @ts-nocheck
import React, { useContext, useState, useEffect, useRef } from "react";

import "./index.sass";

import { AuthContext } from "../../auth/AuthContext";
import { SidebarContext } from "../../auth/sidebarContext";

import { Button } from "@attrybtech/attryb-ui";
import { ProfileDropDown, Navbar, ProfileSkeleton } from "@attrybtech/attryb-ui";
import { getCookieByName } from "../../utils/helpers";
import { PRODUCT_NAME, PROFILE_STATUS, SIDEBAR_DATA } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../../assets/images/sidebar/notification.svg"
import settingsIcon from "../../assets/images/sidebar/settings.svg"
import searchIcon from "../../assets/images/sidebar/search.svg"
import BackArrow from "../../assets/images/sidebar/back-arrow.svg"
import { useLocation } from 'react-router-dom';
import breadcrumbArrow from "../../assets/images/sidebar/breadcumb-arrow.svg"
import SearchBar from "../search-bar"
import SearchBarComponent from "../search-bar";

const {
    VITE_AUTH_URL:AUTH_URL,
    VITE_CONTENT_STUDIO_URL:CONTENT_STUDIO_URL,
    VITE_CLIENT_BASE_URL:CLIENT_BASE_URL,
    VITE_ATTRYB_BASE_URL:ATTRYB_BASE_URL
} = import.meta.env
import Breadcrumb from "../breadcrumb";
import { getCustomerPortal } from "../../services/payments";
import { setPaymentModalVisible } from "../../features/globalConfigs/global-slice";
import { useAppDispatch } from "../../app/hooks";


export const NavbarComponent = () => {
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState("");
    const [currentPage, setCurrentPage] = useState('')
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const searchIconRef = useRef(null);
    const iconRef = useRef(null);
    const [customerPortalUrlLoading,setCustomerPortalUrlLoading]=useState(false)
    const {collapseState} : boolean = useContext(SidebarContext);
    const [locationLength, setLocationLength] = useState(0)
    const authContext: { user: any; getSession: () => Promise<unknown> } =
        useContext(AuthContext);
    const user = authContext.user;
    const location = useLocation();
    const dispatch=useAppDispatch()
    const currentPath = location.pathname;
    
    const breadcrumbObject = [
        {
            id: 1 ,
            routeName: '/getting-started' ,
            name: 'Getting Start'
        } ,
    ]
    useEffect(() => {
      const path = location.pathname.replace(/^\/+|\/+$/g, '');
      const pathnameArray = path.split('/');
      setLocationLength(pathnameArray.length)
    }, [location])
    
    useEffect(() => {
        function getNameOfRoute () {
            breadcrumbObject.map((element : any) => { if(element.routeName === currentPath) setCurrentPage(element.name) })
        }
        getNameOfRoute() ;
    }, [currentPath])

    useEffect(() => {
        if (!authContext?.user) return;

        const { email, name } = authContext.user.idToken.payload;
        if (!name) {
            setUserName("Hi there");
        }
        else {
            setUserName(name);
        }
        setEmail(email);
    }, [authContext]);
    const createCustomerPortal=async()=>{
        let redirectUrl = window?.location?.href
        setCustomerPortalUrlLoading(true)
        try {
            let data=await getCustomerPortal(`redirectUrl=${redirectUrl}`)
           if(data?.portalSession){
            window.location.href=`${data.portalSession}`
           }else{
            dispatch(setPaymentModalVisible(true))
           }
           setCustomerPortalUrlLoading(false)
            
        } catch (error) {
                console.log(error)
                setCustomerPortalUrlLoading(false)
        }
    }

  
    
    const navigate = useNavigate();

    const userImage = "";
    const attrybLogo = "/attryb-ui/assets/icons/navbar/attryb-logo.svg";

    const urlCallBack = (domain, url, openIn) => {
       if(url&&!customerPortalUrlLoading){
        createCustomerPortal()
       }
    };

    const [showProfile, setShowProfile] = useState(false);
    const handleProfileToggle = () => {
        setShowProfile(!showProfile);
    };
    const hideProfileHandler = () => {
        setShowProfile(false);
    };

    const signOutCallBack = async () => {
        try {
            await authContext.logout(() =>
                window.open(`${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`, "_self", "noreferrer")
            );
        } catch (error) {}
    };

    // TODO: Replace this configuration from a API.
    const productsConfig = [
        {
            id: "94232b08-7d33-11ed-9f3b-00155d3e8ac7",
            domain: CLIENT_BASE_URL,
            active: true,
        },
        {
            id: "942338b7-7d33-11ed-9f3b-00155d3e8ac7",
            domain: CONTENT_STUDIO_URL,
        },
    ];
    const redirectToHome = ()=>{
        window.open(ATTRYB_BASE_URL, "_self", "noreferrer")
    }
    
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            showSearchBar && 
            searchIconRef.current &&
            !searchIconRef.current.contains(event.target) &&
            event.target.className !== 'search-input'
          ) {
            if (iconRef.current && iconRef.current.contains(event.target)) {
              return; // Exclude the iconRef from closing the search bar
            }
            setShowSearchBar(false);
          }
        };
      
        document.addEventListener('click', handleClickOutside);
      
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [showSearchBar]);
    
      const handleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
      };
      function isDiplayBack() {
        const basePathname = Object.values(SIDEBAR_DATA) 
        const currentPathname = location.pathname.replace(/^\/+|\/+$/g, '');
        let show = true
        basePathname.map((ele: string) => {
            if(ele.replace(/^\/+|\/+$/g, '') === currentPathname)
                show = false;
        })
        return show;
      }

      function handleBackClick(){
        const currentPathname = location.pathname.replace(/^\/+|\/+$/g, '');
        const pathnameArray = currentPathname.split('/');
        if(pathnameArray.length > 3){
            const pathnameSegments = pathnameArray.slice(0, -2);
            let updatedPathname = pathnameSegments.join('/');
            navigate(`/${updatedPathname}`)
        } else if(pathnameArray.length >= 2){
            const pathnameSegments = pathnameArray.slice(0, -1);
            let updatedPathname = pathnameSegments.join('/');
            navigate(`/${updatedPathname}`)
        }
      }
      function leftSection(){
        if(isDiplayBack())
          return (<div onClick={handleBackClick} className="back-icon-wrapper-parent">
                <div className="navbar-item-wrapper-search-icon">
                    <img src="/attryb-ui/assets/icons/navbar/chevron-left.svg" alt="back-arrow-icon" />
                </div>
                <p className="text-sm--md back-icon-title">Back</p>
            </div>)
        else return (<></>)
      }

    return (
        <div className="navbar__wrapper" >

        { 
        <Navbar
            navbarLeftSection={
                leftSection()
            }

            navbarRightSection={
                authContext.profileStatus === PROFILE_STATUS.loading ?
                 <ProfileSkeleton/>
                : authContext.profileStatus === PROFILE_STATUS.signIn ?
                (
                    <>
                       <div className="flex-box-navbar-icons">
                                    <div className="navbar-icon-wrapper">
                                        <a target="blank" href={`${CLIENT_BASE_URL}/preview`}>
                                            <Button colorScheme="secondary">Preview</Button>
                                     </a>
                                    </div>
                       
                       
                        <div onClick={()=>urlCallBack("","execute-payment-api")} className="navbar-icon-wrapper">
                            <div  className="icon-wrapper">
                                <img src={settingsIcon} alt="" />
                            </div>
                        </div>
                                    
                       </div>
                       
                        <ProfileDropDown
                            showProfile={showProfile}
                            hideProfileHandler={hideProfileHandler}
                            handleProfileToggle={handleProfileToggle}
                            productsConfig={productsConfig}
                            userImage={userImage}
                            name={userName}
                            email={email}
                            urlCallBack={urlCallBack}
                            profileChevronIcon={
                                "/attryb-ui/assets/icons/navbar/chevron-white.svg"
                            }
                            productChevronIcon={
                                "/attryb-ui/assets/icons/navbar/chevron-black.svg"
                            }
                            signOutIcon={
                                "/attryb-ui/assets/icons/navbar/sign-out.svg"
                            }
                            settingUrlOpenIn="_blank"
                            signOutCallBack={signOutCallBack}
                            productDomain={CONTENT_STUDIO_URL}
                        />
                    
                    </>

                ) : (
                    <a className="sign-out" href={`${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`}>
                        <Button onClick={() => {}}>Sign In</Button>
                    </a>
                )
            }
         />  }
        
        </div>
    );
};
