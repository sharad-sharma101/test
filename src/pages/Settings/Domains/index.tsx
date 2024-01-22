import Sidebar from "../Components/sidebar";
import "./index.sass";

import ContentWrapper from "../../../components/content-wrapper";
import HeaderContent from "../Components/header-content";
import ProgressBar from "../../../components/progress-bar";
import HorizontalInfoCard from "../../../components/horizontal info card";
import AttrybLogoSmallActive from "../../../assets/images/attryb-logo-small-active.svg";
import AttrybLogoSmallInactive from "../../../assets/images/attryb-small-logoin_active.svg";
import codeEmadedIconInactive from "../../../assets/images/code-embeded.svg";
import codeEmbedediconActive from "../../../assets/images/code-embbeded_active.svg";
import Accordion from "../Components/accordion";
import React, { useState, useEffect, useContext } from "react";
import { getContainers } from "../../../services/containers";
import { AuthContext } from "../../../auth/AuthContext";
import {Button} from "@attrybtech/attryb-ui"

const Domains = () => {
  const [containerObject, setContainerObject] = useState<Container[]>([]);
  const [isContainerStatus, setIsContainerStatus] = useState(true);
  const authContext: any = useContext(AuthContext);
  useEffect(() => {
    getContainerObject();
  }, [authContext.accountId, authContext.containerId]);

  async function getContainerObject() {
    try { 
      if (authContext.userId) {
        const containerObject = await getContainers(
          `accountId=${authContext.accountId}`
        );
        setContainerObject(containerObject);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="domains-wrapper">
        <div className="domains-heading-wrapper">
          <HeaderContent heading={"Domains"} description={"Add or manage your domains"} />
          <div className="domains-add-button">
            <Button  onClick={() => {}}>
            + Add New Domain
            </Button>
  
          </div>
        </div>
        <div className="domains-container">
          
            {containerObject.map((item) => (
              <ContentWrapper>
              <Accordion
                heading={item.domainName}
                key={item._id}
                children={
                  <>
                    <ProgressBar totalStep={2} stepCompleted={Number(item.settings[0].scriptInjected+Number(item.settings[0].scriptEnable))} startingPoint={3} heading={"Domain Name"} showStep={true} isLoading={!isContainerStatus} showOnlyBarLine={true} />
                    <div className="onboarding-card--wrapper">
                      {[
                        {
                          completedStep: item.settings[0].scriptInjected,
                          component: (
                            <HorizontalInfoCard
                              imageScrActive={AttrybLogoSmallActive}
                              imageScrInactive={AttrybLogoSmallInactive}
                              buttonTitle={"Install"}
                              title={"Install Attryb Shopify App"}
                              activeState={item.settings[0].scriptInjected}
                              description={"Easily Connect Your Store with Attryb through our Shopify App"}
                              onclickFunction={() => {}}
                              completedStep={item.settings[0].scriptInjected}
                              isLoading={!isContainerStatus}
                            />
                          ),
                        },
                        {
                          completedStep: item.settings[0].scriptEnable,
                          component: (
                            <HorizontalInfoCard
                              imageScrActive={codeEmbedediconActive}
                              imageScrInactive={codeEmadedIconInactive}
                              buttonTitle={"Enable"}
                              title={"Enable App Embed on Shopify"}
                              activeState={item.settings[0].scriptInjected}
                              description={"Enable the App embedded in your Shopify store, and let’s start Personalizing"}
                              onclickFunction={() => {}}
                              completedStep={item.settings[0].scriptEnable}
                              isLoading={!isContainerStatus}
                            />
                          ),
                        },
                      ]
                        .sort((a, b) => (b.completedStep ? 1 : 0) - (a.completedStep ? 1 : 0))
                        .map(({ component }) => component)}
                    </div>
                  </>
                }
                defaultOpen={true} stepCompleted={Number(item.settings[0].scriptInjected+Number(item.settings[0].scriptEnable))}
              />
              </ContentWrapper>
            ))}
          
        </div>
      </div>
    </>
  );
};

export default Domains;
