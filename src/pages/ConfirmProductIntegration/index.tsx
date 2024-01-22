import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "./index.sass"
import "./index.css"              
//import { Link } from "react-router-dom";
import { getCurrentUser, redirectToAuth } from "../../auth/utils";
import { objectKeys } from "../../utils/helpers";
import { AuthContext } from "../../auth/AuthContext"
import { getContainer } from "../../services/containers";
import verifications  from "../../services/verifications";

import attrybLogo from "../../assets/images/attryb-logo.svg"
import connectAttryb from "../../assets/images/connect-attryb.svg"
import connectShopify from "../../assets/images/connect-shopify.svg"
import { Button } from "@attrybtech/attryb-ui";

const {
  VITE_AUTH_URL: AUTH_URL,
  VITE_CLIENT_BASE_URL: CLIENT_BASE_URL,
} = import.meta.env

const buttonStatus = {
  "disabled": false
}

const ConfirmProductIntegration = () => {
  const [shop, setShop] = useState('')
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const [isValidated, setIsValidated] = useState(false)
  const authContext:any = useContext(AuthContext);
  const [isConnected, setisConnected] = useState(false)
  
  const id = params.get('id')

  useEffect(() => {
    if (!id) {
     navigate('/not-found')
      return;
    }

    getAccountInfo()
  }, [])


  const fetchContainer = async (s: any) => {
    const container = await getContainer(`domainName=${s}`)
    return container
  }

  const handleConnectClick = async () => {
    const user = await getCurrentUser() || {}
    await verifications.updateVerifyPlatform(id, {isConnected: true})
    if (objectKeys(user).length) {
      redirectToSettings(shop)
      return
    }
    redirectToAuth(`${CLIENT_BASE_URL}/getting-started?shop=${shop}`)
    return
  }

  const redirectToSettings = (s: any) => {
    navigate(`../getting-started?shop=${s || ''}`)
  }

  // const redirectToAuth= ()=>{
  //   window.location.href = `${AUTH_URL}?returnUrl=${CLIENT_BASE_URL}/settings/domains?shop=${shop}`
  // }

  const getAccountInfo = async () => {
    const response = await verifications.verifyPlatform(id)
    // redirectToSettings(response.shop || '')
    const userShop = response?.shop
    setisConnected(response?.isConnected)
    if(response?.isConnected){
      navigate(`../getting-started`)
    }
    if (!userShop) {
     navigate('/not-found')
      return;
    }
    const containers = await fetchContainer(userShop)
    if (containers.length) {
      // redirectToSettings(userShop)
    }
    setIsValidated(true)
    setShop(userShop)
  }

  function formatShopifyName(url: string): string | null {
    if (url.includes(".myshopify.com")) {
      const name = url.replace(".myshopify.com", "");
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      return formattedName;
    } else {
      return null;
    }
  }

  return (
    <> 

     <div className="confirm-product-integration-connect" >
      <div className="attryb-logo__wrapper">
        <img src={attrybLogo} alt="" />
      </div>
      <div className="confirm-product-integration-connect-container">
      
      <div className="integration-connect__container">
        <div className="integration-connect_header">
            <h1 className="display-lg--sb" >Connect <span>{formatShopifyName(shop )}</span> with <span>Attryb</span></h1>
        </div>
        <div className="integration-connect__body">

          <div className="connecting-mail__wrapper">
              <div className="connect-icon_wrapper">
                <img src={connectShopify} alt="" />

              </div>
              <div className="credential_container">
                <p className="text-lg" >{formatShopifyName(shop)}</p>
              </div>
            </div>
            <div className="connecting-mail__wrapper">
              <div className="connect-icon_wrapper">
                <img src={connectAttryb} alt="" />
              </div>
              <div className="credential_container">
                <p className="text-lg" >{authContext?.user ? authContext.user.idToken.payload.email : 'Attryb'}</p>
              </div>
            </div>
        </div> 
        <div className="integration-connect__footer">
          <div className="footer-headline">
            <p className="display-xs" >You are about to connect {formatShopifyName(shop )} with Attryb </p>
          </div>
          <div className="connect-button__wrapper">
            <Button  style={{width:"29rem",textAlign:"center",justifyContent:"center"}} onClick={handleConnectClick } isLoading={ !isValidated }>
             Confirm
            </Button>
            {/* <p className="text-sm" >Want to use a different account? <a href={AUTH_URL} >Login/signup</a></p> */}
          </div>
        </div>
        </div>
      </div>
     </div>

    </>
  );
};

export default ConfirmProductIntegration;
