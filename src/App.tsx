import React, { useEffect, useContext,useState } from "react";
import AppRoute from "./routes";
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import "./styles/index.sass";
import "./styles/class-lib.css";
import "./styles/color-palette.css";
import 'tippy.js/dist/tippy.css';
import DefaultLoading from "./components/Loader-Components/AppLoader";
import { useSelector, useStore } from "react-redux";
import {Alert} from "@attrybtech/attryb-ui";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { setAlertVisible } from "./features/globalConfigs/global-slice";
import { useAppDispatch } from "./app/hooks";
import CoreFeatures from "./pages/CoreFeatures";
import PaymentModalWrapper from "./pages/getting-started/PaymentModalWrapper";
import { RootState } from "./app/store";
import Banner from "./components/Banner";
import { AuthContext } from "./auth/AuthContext";
import { useFeatureRequest } from "@shopify/app-bridge-react";



function App() {
  const { isVariantLoading } = useSelector((store: any) => store.templateConfigs)
  const { globalAlert,paymentModalVisible } = useSelector((store:any) => store.globalConfig)
  const {userProfile,isOnboardingCompleted}:any =useContext(AuthContext)

  const dispatch=useAppDispatch()
  const nav=useNavigate()
  const [showBanner,setShowBanner]=useState(false)
  const [globalBannerStatus,setGlobalBannerStatus]=useState(true)



  const getCurrentStatusOfBanner=()=>{
    let location=window.location.pathname
    if(location.includes("variants")||location.includes("getting-started")||location.includes("not-found")){
      return false
    }
    if(globalBannerStatus==false)return false
    return !isOnboardingCompleted
  }
  useEffect(()=>{

        setShowBanner(getCurrentStatusOfBanner())

  },[isOnboardingCompleted,window.location.pathname,globalBannerStatus])
  return (
   <>
  {/* {showBanner&& <Banner handleCrossBanner={()=>setGlobalBannerStatus(false)}/>} */}
    <div className="App">
    
      {paymentModalVisible&&<PaymentModalWrapper  />}
      {globalAlert?.visible && <Alert navigateToAlertData={()=>nav(globalAlert?.ctaData?.route)} hideContainer={()=>dispatch(setAlertVisible(["none","Nothing",false]))} ctaData={globalAlert?.ctaData} theme={globalAlert?.theme} variant="active" content={globalAlert?.content} timeSpan={3000} />}

      <CoreFeatures/>
      <AppRoute />
    </div>
   </>
  );
}

export default App;
