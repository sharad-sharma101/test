// @ts-nocheck
import React,{lazy, useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Routes, Route,Link } from 'react-router-dom';
import UseCases from '../../data/use-cases.json'
import {Button, InputField, EditableContentBlock, List, ListItem,} from "@attrybtech/attryb-ui"
import "./index.sass"
import EditIcon from "../../assets/images/edit-icon.svg"
import ChevronLeft from "../../assets/images/chevron-right--black.svg"
import ConfigurationView from '../../components/templates/configuration-view';
import ChevronRight from "../../assets/images/chevron-right.svg"
import UseCaseCard from '../../components/use-case-card';
import USE_CASES from '../../data/use-cases.json'
import { createTemplate, getMasterTemplates, getTemplates, updateTemplate } from '../../components/editor/api';
import { AuthContext } from '../../auth/AuthContext';
import { useAppSelector, useAppDispatch} from '../../app/hooks';
import AppHeader from '../../components/header';
import { updateEditTemplate, updateUseCase } from '../../features/use-case-templates/template-slice';
import { TEMPLATES_TYPES } from '../../components/editor/constants';
// const TemplatesView = lazy(()=>import("../../components/templates/templates-view"))
const Sidebar = lazy(()=> import("../../components/sidebar"))

import filterIcon from "../../assets/configuration-data/filter.svg"
import TemplateSkeletonComponent from "./skeleton"

import PreviewPopup from './previwePopup';
import TemplatesView from '../../components/templates/templates-view';
import SearchBarComponent from '../../components/search-bar-component';

type Props ={
  handleSave : (id:string) => void, 
  userTemplates : Template[], 
  masterTemplates : Template[] ,
  handleSelectTemplateID: (str: string,isNav:boolean) => void , 
  selectedTemplateId: string,
  isLoading: boolean
}

const EditUseCaseView = ({handleSave , userTemplates , masterTemplates , handleSelectTemplateID , selectedTemplateId, isLoading} : Props) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(masterTemplates[0])
  const [previwePopupState, setPreviwePopupState] = useState<boolean>(false)
  const [searchInput, setsearchInput] = useState('')

  function changeInputSearch(str : string) {
    setsearchInput(str)
  }
  const handleEditClick = async (template) =>{

    // if(template?.type === TEMPLATES_TYPES.custom){
    //   // navigate(`/${accountId}/${containerId}/editor/${template?._id}`)
    //   return;  
    // }

    // delete template._id
    // const newTempalte = await createTemplate({...template, accountId})

    // const campaign = await createCampaign({useCaseId:[useCaseId], segmentId:[segmentId], name:"My Campaign",containerId   })
    // const variant = await variantService.postConfiguration({  accountId, containerId, templateId:newTempalte._id,segmentId:segmentId,campaignId:campaign._id, configuration:{}})

    // navigate(`/${variant._id}/editor/${newTempalte?._id}`)
  }
  function handlePreviwe (template : Template) {
    setSelectedTemplate(template);
    setPreviwePopupState(true);  
  }
  function filterTemplate(template : Template) {
    if(searchInput.trim('') === '') return template;
    else if(template.name.toLowerCase().includes(searchInput)){
      return template
    }
  }

 
  return (
    <div className={`templates-section`} >
   { previwePopupState && <PreviewPopup modalState={previwePopupState} setmodalState={setPreviwePopupState} template={selectedTemplate} selectNewTemplate={handleSave} buttonTitle={'Use Template'} />}
      <div className="template-btn-header">
      
        <SearchBarComponent onTextChange={(e)=>setsearchInput(e)} isOpenInit={false}/>
        <div className="filter-button--wrapper">
          <img src={filterIcon} alt="" />
          <p>Filter</p>
        </div>
      </div>
      <div className="templates-view-container" >
        {isLoading ? (<><TemplateSkeletonComponent/>
          </>
        ):
        (  <TemplatesView
          userTemplates={userTemplates.filter((template) =>
            template.name.toLowerCase().includes(searchInput.toLowerCase())
          )}
          masterTemplates={masterTemplates.filter((template) =>
            template.name.toLowerCase().includes(searchInput.toLowerCase())
          )}
          handleSelectTemplate={handleSelectTemplateID}
          selectedTemplateId={selectedTemplateId}
          handleEditClick={handleEditClick}
          handlePreviwe={handlePreviwe}
          isLoading={isLoading}
        />
       )
        }
  </div>
    </div>
  )
}

export default EditUseCaseView