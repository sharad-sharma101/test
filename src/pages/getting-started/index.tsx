import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../auth/AuthContext";
import { getContainers, getEnableStatus, verifyAppInstalled } from "../../services/containers";
import choosePlanIconActive from "../../assets/images/choose-plan.svg";
import HorizontalInfoCard from "../../components/horizontal info card";
import AttrybLogoSmallActive from "../../assets/images/attryb-logo-small-active.svg";
import AttrybLogoSmallInactive from "../../assets/images/attryb-small-logoin_active.svg";
import codeEmadedIconInactive from "../../assets/images/code-embeded.svg";
import codeEmbedediconActive from "../../assets/images/code-embbeded_active.svg";
import readyToGoIcon from "../../assets/images/Ready-to-go-icon.svg";
import ProductOverviweIcon from "../../assets/images/product-overviwe.svg";
import UnderstandStructureIcon from "../../assets/images/under-structure.svg";
import TutorialIcon from "../../assets/images/tutorial.svg";
import VerticalInfoCard from "../../components/vertical info card";
import {
  AlertPopup,
  AlertPopupHeader,
  AlertPopupBody,
  AlertPopupFooter,
  useModal,
  Button,
} from "@attrybtech/attryb-ui";
import ContentWrapper from "../../components/content-wrapper";
import "./index.sass";
import ProgressBar from "../../components/progress-bar";

import { redirectToAuth } from "../../auth/utils";
import { getClientConfigs } from "../../services/settings";
import {
  BILLING_CARD_ORDER,
  BILLING_CYCLES,
  PROFILE_STATUS,
} from "../../utils/constants";
import AppLoader from "../../components/app-Loader";
import Payments from "../../components/payments/payments";
import DemoConnectShopify from "../../assets/demo-shopify-connect/How To Embed AppShopify.gif";
import { getCustomerPortal, getProductPlans } from "../../services/payments";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PaymentModalWrapper from "./PaymentModalWrapper";
import { setPaymentModalVisible } from "../../features/globalConfigs/global-slice";
import { RootState } from "../../app/store";
import { useDispatch } from "react-redux";
const { VITE_SHOPIFY_APP_URL: SHOPIFY_APP_URL, VITE_PRODUCT_ID: PRODUCT_ID } =
  import.meta.env;

const GettingStarted = () => {
  const dispatch=useAppDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState();
  const [user, setUser] = useState<any>();
  const navigate = useNavigate();
  const { modalState, modalRef, exitModal, showModal } = useModal();
  const modalCancelHandler: () => void = () => {
    exitModal();
  };
  const authContext: any = useContext(AuthContext);
  const {containerObjectInRedux}=useAppSelector((store:RootState)=>store.coreUserFeatures)
  const [isCodeEmbeded, setisCodeEmbeded] = useState<boolean>(false);

  const [domainName, setDomainName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [containerId, setContainerId] = useState("");
  const [shopName, setShopName] = useState("");
  const [isShopifyVisit, setIsShopifyVisit] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [isContainerStatus, setIsContainerStatus] = useState(false);
  const [isScriptStatus, setIsScriptStatus] = useState(false);
  const [setUpCompleted, setSetupCompleted ] = useState(false)
  const [customerPortalUrlLoading,setCustomerPortalUrlLoading]=useState(false)


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
  useEffect(() => { 
    if ( isScriptStatus) setIsContainerStatus(true);
  }, [ isScriptStatus]);


  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  useEffect(() => {
    const profileStatus = authContext.profileStatus;
    if (
      profileStatus !== PROFILE_STATUS.loading &&
      authContext.userId
    ) {
      setupUserAccount();
    }

    if (profileStatus !== PROFILE_STATUS.loading && !authContext.user) {
      redirectToAuth(window.location.href);
    }
  }, [authContext?.profileStatus, shop]);

  const { isCustomerSubscribed } = authContext; // Access isCustomerSubscribed from AuthContext
  const [stepCompleted, setStepCompleted] = useState<number>(0);
  const [scriptEnable, setScriptEnable] = useState<boolean>(false);
  const [scriptInjected, setScriptInjected] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    setIsPaid(isCustomerSubscribed);
  }, [isCustomerSubscribed]);

  useEffect(() => {
    if (authContext?.userId) {
      setUser(authContext?.user);
      setUserId(authContext?.userId);
    }
  }, [authContext?.userId]);

  const setupUserAccount = async () => {
    const user = authContext.user;
    if (user) {
      const { email } = authContext.user.idToken.payload;
      // const response = await getClientConfigs(
      //   shop || "",
      //   email,
      //   authContext.user || false,
      //   true
      // );
      
      setAccountId(authContext?.accountId || "");
      setContainerId(authContext?.containerId || "");
      setIsLoading(false);
      setShopName(shop || "");
      setSetupCompleted(true)
      await authContext.fetchContainerId()
    } else {
      redirectToAuth(window.location.href);
    }
  };


  useEffect(() => {
  
    if (scriptInjected && stepCompleted < 3) {
      setStepCompleted((prevStep) => prevStep + 1);
    }
  }, [scriptInjected]);

  useEffect(() => {
    if (scriptEnable && stepCompleted < 3) {
      setStepCompleted((prevStep) => prevStep + 1);
    }
  }, [scriptEnable]);

    
  useEffect(() => {
    if (isPaid&&!authContext?.userProfile?.subscription?.cancel_at && stepCompleted < 3) {
      setStepCompleted((prevStep) => prevStep + 1);
    }
  }, [isPaid]);

  useEffect(() => {
    getContainerObject();
  }, [userId, shop, isLoading, authContext?.containerId  ,setUpCompleted,containerObjectInRedux]);


  async function getContainerObject() {
    try {
      const isAccountSetup = !shop ? true :  shop && setUpCompleted
      if(isAccountSetup){
        if (userId&&containerObjectInRedux) {
          const containerObject = containerObjectInRedux;
          if(containerObject){
          if(containerObject[0]?.domainName){
            let statusOfTheAppInstall:any=await verifyAppInstalled(`shop=${containerObject[0]?.domainName}`)
            setScriptInjected((statusOfTheAppInstall?.data?.data?.isConnected?true:false))
          }
            
            setDomainName(containerObject[0].domainName || "");
    
            setAccountId(containerObject[0]?.accountId || "");
            setContainerId(containerObject[0]?._id || "");
            setShopName(containerObject[0]?.domainName || "" )
    
            const checkVar = await getEnableStatus(
              `shop=${containerObject[0]?.domainName}`
            );
            setScriptEnable(checkVar?.data?.status);
            setIsScriptStatus(true);
          }
        }
      }
    } catch (error) {
      
    }
  }

  function linktoShopifyApp() {
    // setStepCompleted(stepCompleted + 1);
    setisCodeEmbeded(true);
    setIsShopifyVisit(true);
  }

  function handleProgressButton() {
    // if (stepCompleted !== 3) {
    //     setStepCompleted(prevStep => prevStep + 1);
    // }
  }

  function appEmbededPopup() {
    showModal();
  }


  function handleChoosePlan() {
    createCustomerPortal()
  }

  function handleAppInstall() {
    window.open(SHOPIFY_APP_URL, "_blank");
  }

  const handleDismiss = async () => {
    setIsLoading(true)
    await getContainerObject();
    setIsLoading(false)
    setIsShopifyVisit(false)
    exitModal();
  };
  const handleDoneOnPopup = async () => {
    setButtonState(true);
    await getContainerObject();
    setButtonState(false)
    setIsShopifyVisit(false)
    exitModal();
  }

  return (
    <>
      {false ? (
        <AppLoader />
      ) : (
        <div className="getting-started-wrapper">

          <AlertPopup
            wrapperRef={modalRef}
            name={`got to enable script`}
            visibility={modalState}
            onBackdropClick={modalCancelHandler}
          >
            <AlertPopupHeader>
              <div className="popup-header">
                <div className="image-wrapper-popup">
                  <img src={codeEmbedediconActive} alt="" />
                </div>
                <div className="popup-header-content">
                  <p className="text-sm">Step 3</p>
                  <h2 className="text-lg--sb" >Enable Custom Code Injection</h2>
                </div>
              </div>
            </AlertPopupHeader>
            <AlertPopupBody>
              <div className="instruction-gif_wrapper">
                <img
                  src={DemoConnectShopify}
                  alt=""
                  width="100%"
                  height="100%"
                />
              </div>
            </AlertPopupBody>
            <AlertPopupFooter>
              <div className="footer-of-popup">
                {/* <button className="dismiss-cta" onClick={handleDismiss}>
                  Dismiss
                </button> */}
                <div className="dismiss-button--wrapper">
                 <Button variant ="solid" colorScheme="secondary"  state={isLoading&&"loading"} onClick={handleDismiss} loading={true} style={{minWidth:'6.1875rem'}} >
                Dismiss
                 </Button>
                </div>
                {isShopifyVisit ? (
                  <Button state={buttonState&&"loading"} onClick={handleDoneOnPopup} style={{minWidth:'6.1875rem'}}>Done</Button>
            
                ) : (
                  <a
                    href={`https://${shopName}/admin/themes/current/editor?context=apps&activateAppId=1189ff8b-3a7f-4694-8495-a97498ee56831189ff8b-3a7f-4694-8495-a97498ee5683/app-embed`}
                    target="_blank"
                  >
                    <div className="link-to-shopify-button-wrapper">
                      <Button onClick={linktoShopifyApp}  >
                      Go To Shopify
                      </Button>
                    </div>
                  </a>
                )}
              </div>
            </AlertPopupFooter>
          </AlertPopup>
          <div className="getting-started-container">
            <div className="header-of-getting-started">
              <div className="heading--header-of-dashboard">
                <h1 className="display-sm--sb" >
                  {" "}
                  {!isContainerStatus ? (
                    <Skeleton
                      width={"48.3434rem"}
                      height={"2.3349rem"}
                      containerClassName="heading--header-of-dashboard"
                    />
                  ) : (
                    <>Welcome, {user?.idToken.payload.name}</>
                  )}
                </h1>
              </div>
              <div className="header-discription">
                <p className="text-md" >
                  {" "}
                  {!isContainerStatus ? (
                    <Skeleton
                      width={"34.2889rem"}
                      height={"1.218rem"}
                      containerClassName="header-discription"
                    />
                  ) : (
                    <>
                      <span>Unlock</span> the Full Potential of Personalization
                      by completing these simple onboarding steps!{" "}
                    </>
                  )}
                </p>
              </div>
            </div>
            <ContentWrapper>
              <ProgressBar
                totalStep={3}
                stepCompleted={stepCompleted}
                startingPoint={4}
                heading={"Let’s set up your Business"}
                showStep={true}
                isLoading={!isContainerStatus}
              />
              <div className="onboarding-card--wrapper">
                {[
                   {
                    completedStep: scriptInjected,
                    component: (
                      <HorizontalInfoCard
                        imageScrActive={AttrybLogoSmallActive}
                        imageScrInactive={AttrybLogoSmallInactive}
                        buttonTitle={"Install"}
                        title={"Install Attryb Shopify App"}
                        activeState={ true}
                        description={
                          "Easily Connect Your Store with Attryb through our Shopify App"
                        }
                        onclickFunction={handleAppInstall}
                        completedStep={scriptInjected}
                        isLoading={!isContainerStatus}
                      />
                    ),
                  },
                  {
                    completedStep: isPaid,
                    component: (
                      <HorizontalInfoCard
                      loadingState={customerPortalUrlLoading}
                        imageScrActive={choosePlanIconActive}
                        imageScrInactive={choosePlanIconActive}
                        buttonTitle={"Choose a Plan"}
                        title={"Choose a Plan"}
                        activeState={ true }
                        description={
                          "Choose the perfect plan that suits your needs"
                        }
                        onclickFunction={handleChoosePlan}
                        completedStep={isPaid&&!authContext.userProfile.subscription.cancel_at}
                        isLoading={!isContainerStatus}
                      />
                    ),
                  },
                  {
                    completedStep: scriptEnable,
                    component: (
                      <HorizontalInfoCard
                        imageScrActive={codeEmbedediconActive}
                        imageScrInactive={codeEmadedIconInactive}
                        buttonTitle={"Enable"}
                        title={"Enable App Embed on Shopify"}
                        activeState={!isContainerStatus ? true   : scriptInjected}
                        description={
                          "Enable the App embedded in your Shopify store, and let’s start Personalizing"
                        }
                        onclickFunction={appEmbededPopup}
                        completedStep={scriptEnable}
                        isLoading={!isContainerStatus}
                      />
                    ),
                  },
                ]
                  .sort(
                    (a, b) =>
                      (b.completedStep ? 1 : 0) - (a.completedStep ? 1 : 0)
                  )
                  .map(({ component }) => component)}
              </div>
            </ContentWrapper>

            <ContentWrapper>
              <div
                className={!isContainerStatus ? 'onboarding-complete--continer':(`${isPaid && scriptEnable && scriptInjected ? 'onboarding-complete--continer' : 'inactive-onboarding-complete--continer'}`)}
              >
                <div className="heading-on-onboarding">
                  <div className="image-ready-to-go">
                    {!isContainerStatus ? (
                      <Skeleton
                        width={"2.5rem"}
                        height={"2rem"}
                        containerClassName="image-ready-to-go"
                      />
                    ) : (
                      <img  src={readyToGoIcon} alt="" />
                    )}
                  </div>
                  <div className="rtg-body-description">
                    <p className="active-span-description text-lg">
                      {" "}
                      {!isContainerStatus ? (
                        <Skeleton
                          width={"30.875rem"}
                          height={"1.875rem"}
                          containerClassName="active-span-description"
                        />
                      ) : (
                        <>
                          <span className="text-lg--sb" >Ready To Go?</span> Start Personalizing your
                          website in seconds
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="button-of-container-wrapper">
                  {!isContainerStatus ? (
                    <Skeleton
                      width={"10.5625rem"}
                      height={"1.7875rem"}
                      containerClassName="button-of-container-wrapper"
                    />
                  ) : (
                    <Button  state={isLoading&&"loading"}  onClick={() => {
                      navigate(`/use-cases`);
                    }}>Let's Get Started</Button>
                    
                  )}
                </div>
               
              </div>
            </ContentWrapper>
            <ContentWrapper>
              <div className="tutorial-process--container">
                <div className="tutorial-process--header">
                  {!isContainerStatus ? (
                    <Skeleton
                      width={"48.3434rem"}
                      height={"1.4213rem"}
                      containerClassName="tutorial-process--header"
                    />
                  ) : (
                    <p className="text-lg--sb"> Learn How To Use </p>
                  )}
                </div>
                <div className="tutorial-cards--wrapper">
                  <VerticalInfoCard
                    imgeSrc={ProductOverviweIcon}
                    title={"Product Overview"}
                    description={
                      "Take an interactive tour to learn the basics of our app"
                    }
                    isLoading={!isContainerStatus}
                  />
                  <VerticalInfoCard
                    imgeSrc={UnderstandStructureIcon}
                    title={"Understand the Structure"}
                    description={
                      "Explore our guides, videos tutorials, and best-recommended practices"
                    }
                    isLoading={!isContainerStatus}
                  />
                  <VerticalInfoCard
                    imgeSrc={TutorialIcon}
                    title={"Tutorial"}
                    description={
                      "Talk to our team and learn more about what you can do"
                    }
                    isLoading={!isContainerStatus}
                  />
                </div>
              </div>
            </ContentWrapper>
          </div>
        </div>
      )}
    </>
  );
};

export default GettingStarted;
