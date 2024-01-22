import {useState} from 'react'
import { AlertPopup, AlertPopupHeader, AlertPopupBody, AlertPopupFooter, useModal } from "@attrybtech/attryb-ui"
import "./index.sass"
import sidePopupDefault from "../../assets/template-library/side-popup-default.svg"
import sidePopupSelected from "../../assets/template-library/side-popup-selected.svg"
import fullPopupSelected from "../../assets/template-library/full-page-popup-default.svg"
import fullPopupHover from "../../assets/template-library/full-page-popup-hover.svg"
import carouselDefault from "../../assets/template-library/carousel-default.svg"
import carouselSelected from "../../assets/template-library/carousel-select.svg"
import productDefault from "../../assets/template-library/product-suggestion-default.svg"
import productSelected from "../../assets/template-library/product-suggestion-selected.svg"
import sectionDefault from "../../assets/template-library/section-default.svg"
import sectionSelected from "../../assets/template-library/section-selected.svg"
import topBannerDefault from "../../assets/template-library/top-banner-default.svg"
import topBannerSelected from "../../assets/template-library/top-banner-selected.svg"
import codeEmbedediconActive from "../../assets/images/code-embbeded_active.svg"
import {Button} from '@attrybtech/attryb-ui'
import AppPopup from '../app-popup'

interface props {
    popupState: boolean , 
    handleCrossEvent : any
}

const CreateTemplatePopup = ({popupState , handleCrossEvent} : props) => {
    
    // const { modalState, modalRef, exitModal , showModal } = useModal();
    // const modalCancelHandler: () => void = () => {exitModal(); handleCrossEvent(false)}
    
    const [selectedTemplateCard, setselectedTemplateCard] = useState()
    const arrayPagesImage = [
        {
            '_id' : 1 ,
            defaultImage : sidePopupDefault,
            selectedImage: sidePopupSelected,
            pageName: 'Side Popup'
        },
        {
            '_id' : 2 ,
            defaultImage : fullPopupSelected,
            selectedImage: fullPopupHover ,
            pageName: 'Full Page Popup'
        },
        {
            '_id' : 3 ,
            defaultImage : carouselDefault,
            selectedImage: carouselSelected,
            pageName: 'Carousel'
        },
        {
            '_id' : 4 ,
            defaultImage : productDefault,
            selectedImage: productSelected,
            pageName: 'Recommended Product'
        },
        {
            '_id' : 5 ,
            defaultImage : sectionDefault,
            selectedImage: sectionSelected,
            pageName: 'Section'
        },
        {
            '_id' : 6 ,
            defaultImage : topBannerDefault,
            selectedImage: topBannerSelected,
            pageName: 'Top Banner'
        }
    ]
    function handleCardSelection(card: any){
        setselectedTemplateCard(card._id)
    }
    const HeaderPopup = () => {
        return(
            <div className="popup-header">
                <div className="image-wrapper-popup">
                  <img src={codeEmbedediconActive} alt="" />
                </div>
                <div className="popup-header-content">
                  <p className="text-lg--sb">Create New Template</p>
                  <h2 className="text-sm" >Choose a view structure and start creating your template</h2>
                </div>
            </div>
        )
    }
    const BodyPopup = () => {
        return(
            <div className='create-template-popup-body--wrapper'>
                {arrayPagesImage.map((element: any) => (
                    <div className={`new-pages-card ${element._id === selectedTemplateCard ? '--active' : ''} `} onClick={() => handleCardSelection(element)}>
                        <div className="image-wrapper">
                            <img src={element._id === selectedTemplateCard  ? element.selectedImage : element.defaultImage} alt="" />
                        </div>
                        <p className='text-md'>{element.pageName}</p>
                    </div>
                ))}
            </div>
        )
    }
    const FooterPopup = () => {
        return(
            <div className='footer-popup-wrapper' >
                <Button variant ="solid" colorScheme="secondary" onClick={() => handleCrossEvent(false)} >
                   Dismiss
                </Button>
                <Button onClick={() => {}}  >
                    Continue
                </Button>
            </div>
        )
    }

  return (
    <div className='new-template-popup-wrapper'>
        <AppPopup  header={<HeaderPopup/>} body={<BodyPopup/>} footer={<FooterPopup/>} openModal={popupState} setOpenModal={handleCrossEvent} />
    </div>
  )
}

export default CreateTemplatePopup
