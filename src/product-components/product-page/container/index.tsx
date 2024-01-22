// @ts-nocheck
import React from "react";
import "./index.css";
import { Button } from "@attrybtech/attryb-ui";


import {
  mainProductImage,
  star,
  halfStar,
  rowFast,
  mobileSlider,
  removeIcon,
} from "../../../product-page-assets";
import ProductPageBlankState from "../../common-components/blank-states/productPageBlankState";
import Xicon from "../../../assets/images/x-black.svg";

import ReGenerateButtons from "../../common-components/loaders/reloader/reGenerateButton";

import Navigate from "../../common-components/navigate";
import { useState } from "react";
import buttonLight from "../../../product-page-assets/button-loader-light.svg";
import BlankInputState from "../../common-components/blank-input-state";
import ContentEditor from "../../common-components/editor";

export default function Container({
  setProductTitle,
  productTitle,
  switchButtonConfig,
  setProductBrief,
  productBrief,
  aboutProduct,
  setAboutProduct,
  productDescription,
  setProductDescription,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  productTitleApi,
  productBriefApi,
  aboutProductApi,
  faqApi,
  productDescriptionApi,
  setAboutVisible,
  metaTitleApi,
  metaDescriptionApi,
  //loaders states
  titleLoader = false,
  briefLoader = false,
  aboutLoader = false,
  faqsLoader = false,
  pDescriptionLoader = false,
  metaTitleLoader = false,
  metaDescLoader = false,
  brandName,
  titleVisible,
  setTitleVisible,
  briefVisible,
  setBriefVisible,
  aboutVisible,
  pDescriptionVisible,
  setPDescriptionVisible,
  metaTitleVisible,
  setMetaTitleVisible,
  metaDescVisible,
  setMetaDesVisible,
  mediaSrc,
  publishButtonCallback,
  setIsFormOpen,
  previewUrl,
  previewButtonType,
  publishButton,
  setTemplateVisible,
  isContentGenerated
}) {

  const [isEditModeTitle, setIsEditModeTitle] = useState(false);
  const [isEditModeBrief, setIsEditModeBrief] = useState(false);
  const [isEditModeAbout, setIsEditModeAbout] = useState(false);
  const [isEditModeProdDescription, setIsEditModeProdDescription] =
    useState(false);

  const [isEditModeMetaTitle, setIsEditModeMetaTitle] = useState(false);
  const [isEditModeMetaDescription, setIsEditModeMetaDescription] =
    useState(false);

  const generateEditableContentHtml = (passedData, type = "plain") => {
    let clonedData = passedData?.slice()?.trim(); // Slice returns a duplicate
    /**
     * Splitting the string at newline into array of strings
     */
    let placeholder = clonedData?.split(/\r\n|\r|\n/);
    /**
     *  We are returning the array after converting the string type items to HTML type
     */
    const tag = type === "plain" ? "div" : "li";
    const parentTag = type === "plain" ? "div" : "ul";

    const generatedHtml = placeholder?.map((entry) => {
      return `<${tag}>${entry ? entry : `<br />`}</${tag}>`;
    });

    return `<${parentTag}> ${generatedHtml?.join("")} </${parentTag}>`;
  };
  return (
    <React.Fragment>
      <div className="container">
        <div
          className="close-product-template-ui"
          onClick={() => {
            setTemplateVisible(false);
          }}
        >
          <img src={Xicon} alt="close" />
        </div>
        <div className="container__box">
          <div className="container__header">
            <div className="container__header-left">{brandName}</div>
            <div className="container__header-right">
              <div className="sub-header__right">
                <Navigate
                  children={<Button variant="subtle">Projects</Button>}
                  url="/projects-management"
                />
              </div>
              <div className="preview__button">
                <Navigate
                  external={true}
                  children={
                    <Button variant="subtle" state={previewButtonType}>
                      {" "}
                      Preview
                    </Button>
                  }
                  url={previewUrl}
                />
              </div>
              <div className="sub-header__right">
                <Button
                  variant="solid"
                  state={publishButton.type}
                  onClick={publishButtonCallback}
                  loadingIcon={buttonLight}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>

          <div className="container__body" id="main_container">
            <div className="container__body-row">
              <div className="container__body-media">
                <img
                  src={mediaSrc?.length ? mediaSrc[0] : mainProductImage}
                  alt="product-image"
                />
              </div>
              <div className="container__body-content">
                <div className="rating">
                  <img src={star} alt="product-image" />
                  <img src={star} alt="product-image" />
                  <img src={star} alt="product-image" />
                  <img src={star} alt="product-image" />
                  <img src={halfStar} alt="product-image" />
                  <span>(1,060)</span>
                </div>
                {switchButtonConfig[0].value ? (
                  <div className="product__title">
                    <div
                      className={`product__title-content ${
                        titleLoader && "loading--text"
                      }`}
                    >
                      {!productTitle?.trim()?.length && !isEditModeTitle ? (
                        <BlankInputState
                          callBack={setIsEditModeTitle}
                          styles={{ height: "4.1538rem" }}
                        />
                      ) : (
                        <ContentEditor
                          onFocus={() => {
                            setTitleVisible(false);
                          }}
                          onBlur={() => {
							if (isContentGenerated) setTitleVisible(true);
                          }}
                          htmlContent={productTitle}
                          setContent={(res) => {
                            setProductTitle(res);
                          }}
                        />
                      )}
                    </div>

                    <ReGenerateButtons
                      visibility={titleVisible}
                      isLoading={titleLoader}
                      callBack={() => {
                        productTitleApi({ saveContent: true });
                      }}
                    />
                  </div>
                ) : (
                  <ProductPageBlankState
                    styles={{ width: "auto", height: "auto" }}
                    placeholder="Product Title: Content not generated. Change settings in Content Configuration"
                  />
                )}
                {switchButtonConfig[1].value ? (
                  <div className="product__brief">
                    <div
                      className={`product__brief-content ${
                        briefLoader && "loading--text"
                      }`}
                    >
                      {!productBrief?.trim()?.length && !isEditModeBrief ? (
                        <BlankInputState callBack={setIsEditModeBrief} />
                      ) : (
                        <ContentEditor
                          onFocus={() => {
                            setBriefVisible(false);
                          }}
                          onBlur={() => {
                            setBriefVisible(true);
                          }}
                          htmlContent={productBrief}
                          setContent={(res) => {
                            setProductBrief(res);
                          }}
                        />
                      )}
                    </div>
                    <ReGenerateButtons
                      visibility={briefVisible && !isEditModeBrief}
                      isLoading={briefLoader}
                      callBack={() => {
                        productBriefApi({ saveContent: true });
                      }}
                    />
                  </div>
                ) : (
                  <ProductPageBlankState
                    styles={{
                      width: "auto",
                      height: "auto",
                      fontSize: "0.75rem",
                      marginTop: ".5rem",
                      marginBottom: "0.7rem",
                    }}
                    paraStyles={{ fontSize: "0.75rem", lineHeight: "1rem" }}
                    placeholder="Product Brief: Content not generated. Change settings in Content Configuration"
                  />
                )}
                <div className="product__brief-img">
                  <img src={rowFast} alt="product-image" />
                </div>
                <div className="about__product-heading">About this Product</div>
                {switchButtonConfig[2].value ? (
                  <div className="about__product">
                    <div
                      className={`about__product-content ${
                        aboutLoader && "loading--text"
                      }`}
                    >
                      {!aboutProduct?.trim()?.length && !isEditModeAbout ? (
                        <BlankInputState callBack={setIsEditModeAbout} />
                      ) : (
                        <ContentEditor
                          onFocus={() => {
                            setAboutVisible(false);
                          }}
                          onBlur={() => {
                            setAboutVisible(true);
                          }}
                          htmlContent={generateEditableContentHtml(
                            aboutProduct,
                            "unordered-list"
                          )}
                          formatType={"unordered-list"}
                          setContent={(values) => {
                            setAboutProduct(values);
                          }}
                        />
                      )}
                    </div>
                    <ReGenerateButtons
                      visibility={aboutVisible}
                      isLoading={aboutLoader}
                      callBack={() => {
                        aboutProductApi({ saveContent: true });
                      }}
                    />
                  </div>
                ) : (
                  <ProductPageBlankState
                    styles={{ width: "auto", height: "23.125rem" }}
                    placeholder="Content not generated. Change settings in Content Configuration"
                  />
                )}
              </div>
            </div>
            <div className="product__description-heading">
              Product Description
            </div>
            {switchButtonConfig[3].value ? (
              <div className="product__description">
                <div
                  className={`product_description-content ${
                    pDescriptionLoader && "loading--text"
                  }`}
                >
                  {!productDescription?.trim()?.length &&
                  !isEditModeProdDescription ? (
                    <BlankInputState callBack={setIsEditModeProdDescription} />
                  ) : (
                    <ContentEditor
                      onFocus={() => {
                        setPDescriptionVisible(false);
                      }}
                      onBlur={() => {
                        setPDescriptionVisible(true);
                      }}
                      htmlContent={productDescription}
                      setContent={(res) => {
                        setProductDescription(res);
                      }}
                    />
                  )}
                </div>
                <ReGenerateButtons
                  visibility={pDescriptionVisible && !isEditModeProdDescription}
                  isLoading={pDescriptionLoader}
                  callBack={() => {
                    productDescriptionApi({ saveContent: true });
                  }}
                />
              </div>
            ) : (
              <ProductPageBlankState
                styles={{
                  width: "auto",
                  height: "17.25rem",
                  marginLeft: "1rem",
                }}
                placeholder="Content not generated. Change settings in Content Configuration"
              />
            )}
            <div className="faq_container">
              <div className="faq_heading">Frequently Asked Questions</div>
              <div className="">
                <ReGenerateButtons
                  visibility={false}
                  isLoading={faqsLoader}
                  callBack={() => {
                    faqApi({ saveContent: true });
                  }}
                />
              </div>
            </div>
            {switchButtonConfig[4].value ? (
              <div className="faqs">
        
              </div>
            ) : (
              <ProductPageBlankState
                styles={{ width: "auto", height: "8rem", marginTop: "0.5rem" }}
                placeholder="Faqs: Content not generated. Change settings in Content Configuration"
              />
            )}
          </div>
        </div>
        <div className="container__footer">

          <div className="brand_link">https://www.{brandName.toLowerCase().replace(/ +/g, "")}.com</div>

          {switchButtonConfig[5].value ? (
            <div className="meta_title">
              <div
                className={`meta_title_content ${
                  metaTitleLoader && "loading--text"
                }`}
              >
                {!metaTitle?.trim()?.length && !isEditModeMetaTitle ? (
                  <BlankInputState callBack={setIsEditModeMetaTitle} />
                ) : (
                  <ContentEditor
                    onFocus={() => {
                      setMetaTitleVisible(false);
                    }}
                    onBlur={() => {
                      setMetaTitleVisible(true);
                    }}
                    htmlContent={metaTitle}
                    setContent={(res) => {
                      setMetaTitle(res);
                    }}
                  />
                )}
              </div>
              <ReGenerateButtons
                visibility={metaTitleVisible && !isEditModeMetaTitle}
                isLoading={metaTitleLoader}
                callBack={() => {
                  metaTitleApi({ saveContent: true });
                }}
              />
            </div>
          ) : (
            <ProductPageBlankState
              styles={{ width: "auto", height: "auto", marginTop: "0.5rem" }}
              placeholder="MetaTitle: Content not generated. Change settings in Content Configuration"
            />
          )}
          {switchButtonConfig[6].value? (
            <div className="meta__description">
              <div
                className={`meta__description-content ${
                  metaDescLoader && "loading--text"
                }`}
              >
                {!metaDescription?.trim()?.length &&
                !isEditModeMetaDescription ? (
                  <BlankInputState callBack={setIsEditModeMetaDescription} />
                ) : (
                  <ContentEditor
                    onFocus={() => {
                      setMetaDesVisible(false);
                    }}
                    onBlur={() => {
                      setMetaDesVisible(true);
                    }}
                    htmlContent={metaDescription}
                    setContent={(res) => {
                      setMetaDescription(res);
                    }}
                  />
                )}
              </div>
              <ReGenerateButtons
                visibility={metaDescVisible && !isEditModeMetaDescription}
                isLoading={metaDescLoader}
                callBack={() => {
                  metaDescriptionApi({ saveContent: true });
                }}
              />
            </div>
          ) : (
            <ProductPageBlankState
              styles={{ width: "auto", height: "auto", marginTop: "0.5rem" }}
              placeholder="Meta Description: Content not generated. Change settings in Content Configuration"
            />
          )}
        </div>
      </div>
      <div className="bottom_config">
        <img
          src={mobileSlider}
          alt=""
          onClick={() => {
            setIsFormOpen(true);
          }}
        />
        <Navigate
          children={
            <img
              className="button_preview"
              src={"https://cdn-icons-png.flaticon.com/24/5656/5656148.png"}
              alt=""
            />
          }
          url={previewUrl}
        />
        <img
          onClick={publishButtonCallback}
          className="button_publish"
          src={"https://cdn-icons-png.flaticon.com/24/7213/7213401.png"}
          alt=""
        />
      </div>
    </React.Fragment>
  );
}
