import React,{useState, useEffect} from "react";
import { Link } from "react-router-dom";
import ContentStudioIcon from "../../assets/images/content-studio.svg";
import PersonalizationIcon from "../../assets/images/personalization.svg";
import LogoutIcon from "../../assets/images/log-out.svg";
import {getCookieByName} from "../../utils/helpers"
import {USER_BROWSER_STROAGE_KEY} from "../../utils/constants"

import "./index.sass";

const PRODUCTS_DATA = [
  {
    name: "Content Studio",
    icon: ContentStudioIcon,
    id: "1",
	  link:"https://alpha.attryb.com/content-studio/templates",
    openIn:"_blank"
  },
  {
    name: "Web Personalisation",
    icon: PersonalizationIcon,
    id: "2",
	  link:"https://personalization-demo.attryb.com/home",
    openIn:"_self"
  },
];
const logOutUrl = "https://demosite.attryb.com/logout" 

const openInNewTab = (url:string,target:string) => {
	if (url)  window.open(url, target, 'noreferrer');
  };

export const ProfileDropDown = () => {
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const name = JSON?.parse(getCookieByName(USER_BROWSER_STROAGE_KEY) || '{"name":""}')?.name
    if(name){
        setUserName(name)
    }
}, [])

  return (
    <div className="profile__dropdown-container">
      <div className="profile-name">{userName} </div>
      <div className="profile">
        <div className="profile__body">
          <div className="profile__body-heading">Products</div>

          {PRODUCTS_DATA.map((product) => (
            <div className="products__container" key={product.id}  onClick={()=>{openInNewTab(product.link,product.openIn)}}>
              <div className="product-icon">
                <img src={product.icon} alt="" />
              </div>
              <div className="product-name">{product.name}</div>
            </div>
          ))}
        </div>
        <div className="profile__footer">
          <div className="profile__footer-section" onClick={()=>{openInNewTab(logOutUrl,"_self")}}>
            <div className="footer-section-img">
              <img src={LogoutIcon} alt="" />
            </div>
            <div className="footer-section-text">
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

