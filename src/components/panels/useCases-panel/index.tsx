import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Feature,
  setFeaturesInStore,
  toggleFeature,
  toggleFeatureSelected,
} from "../../../features/features-configurations/features-slice";
import SwitchWithDescription from "../../switch-with-description";
import "./index.sass";
import featureServices from "../../../services/features";
import CrossIcon from "../../../assets/images/x-black.svg";
import {
  formatFeatureName,
  isProductPageFeature,
  reloadAppBrowser,
} from "../../../utils/helpers";
import {
  PRODUCT_PAGE_USE_CASES,
  USECASE_TYPES,
} from "../../../utils/constants";
import { Button } from "@attrybtech/attryb-ui";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import USE_CASES from "../../../data/use-cases.json"

const recommendationUseCase = USE_CASES[0]

interface Props {
  isProductPage: boolean;
  iframeLoading: boolean;
  currentPage: string;
  templateVisible: boolean;
  useCaseByType: { [key: string]: Feature[] };
  handleToggleSettingPanel: (toggle: boolean) => void;
  handleToggleBrowserView: () => void;
  setTemplateVisible: (value: boolean) => void;
}

const ConfigurationPanel: React.FC<Props> = ({
  handleToggleSettingPanel,
  handleToggleBrowserView,
  isProductPage,
  currentPage,
  useCaseByType,
  iframeLoading,
  templateVisible,
  setTemplateVisible,
}) => {
  const { features } = useAppSelector((state) => state.features);
  const { accountId, containerId } = useAppSelector(
    (state) => state.customerConfigs
  );

  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAllFeatures(features);
  }, [features]);

  useEffect(() => {
    if (isProductPage && features) {
      dispatch(
        setFeaturesInStore(
          [...features]
          // .sort((a, b) => {
          // 	if (PRODUCT_PAGE_USE_CASES.includes(a.name) && a.isEnabled ) return -1
          // 	else if (PRODUCT_PAGE_USE_CASES.includes(b.name) && b.isEnabled ) return 1
          // 	return 0
          // })
        )
      );
    }
  }, [isProductPage]);

  async function handleToggleFeature(e: any, featureId: string, idx: number) {
    const toogleStatus = e.target?.checked;
    try {
      await featureServices.toggleFeature(
        featureId,
        toogleStatus,
        accountId,
        containerId
      );
      dispatch(toggleFeature({ _id: featureId }));
      reloadAppBrowser();
    } catch (error) {
      console.log(error);
    }
  }

  const handleFeatureSelection = (feature: Feature) => {
    dispatch(toggleFeatureSelected(feature._id));
    handleToggleSettingPanel(true);
  };

  const renderUseCases: React.FC = () => {
    return (
      <>
        {Object.keys(useCaseByType).sort((a,b) => {
          if(a === USECASE_TYPES.universal) return -1
          if(b === USECASE_TYPES.universal) return 1
          return 0
        })
          // .sort((a, b) => {
          // 		// if both a and b are universal usecases then sort them based on enabled parameter
          // 		if (
          // 			UNIVERSAL_USE_CASES.includes(a.name) &&
          // 			UNIVERSAL_USE_CASES.includes(b.name)
          // 		) {
          // 			if (a.isEnabled) return -1
          // 			else if (b.isEnabled) return 1
          // 		}
          // 		// sort universal use cases first
          // 		if (UNIVERSAL_USE_CASES.includes(a.name)) return -1
          // 		else if (UNIVERSAL_USE_CASES.includes(b.name)) return 1
          // 		return 0
          // 	})
          .map((useCaseType, index) => {
            return (
              <div
                className={`use-case-types ${
                  !(
                    useCaseType === currentPage ||
                    useCaseType === USECASE_TYPES.universal
                  ) && "not-applicable"
                }`}
                key={index}
              >
                <p>
                  {iframeLoading || !features ? (
                    <Skeleton />
                  ) : (
                    formatFeatureName(
                      useCaseType === currentPage ||
                        useCaseType === USECASE_TYPES.universal
                        ? useCaseType
                        : USECASE_TYPES.notApplicable
                    )
                  )}
                </p>
                <div className="use-case-types-list">
                  {useCaseByType[useCaseType]?.map((feature, idx) => (
                    <div key={idx}>
                      {iframeLoading || !features ? (
                        <Skeleton width={"100%"} height={"100%"} />
                      ) : (
                        <SwitchWithDescription
                          description={formatFeatureName(feature.name)}
                          toggleCallback={(e: unknown) => {
                            handleToggleFeature(e, feature._id, idx);
                          }}
                          checked={feature.isEnabled}
                          onIconClick={() => handleFeatureSelection(feature)}
                          disable={
                            !isProductPage && isProductPageFeature(feature.name)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </>
    );
  };

  return (
    <>
      <div className={`configuration-panel-container --use-case-panel`}>
        <div className="configuration-panel --config">
          <div className="configuration-panel__heading">
            <h2>Use Cases</h2>
          </div>
          <div className="features-container">
            <div className="configure-output">
              <div className="use-case-container">
                {renderUseCases({})}
              {isProductPage && (
                <div className="edit-content-btn-container">
                  <Button
                    onClick={() => {
                      setTemplateVisible(!templateVisible);
                      // navigate("/product-page")
                    }}
                  >
                    Content Suggestion
                  </Button>
                </div>
              )}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurationPanel;
