import {useState , useContext , useEffect} from 'react'
import "./index.sass"
import filterIcon from "../../assets/configuration-data/filter.svg"
import TemplatesView from '../../components/templates/templates-view'
import { getTemplates , getMasterTemplates } from '../../components/editor/api'
import { AuthContext } from '../../auth/AuthContext'
import { setTemplate } from '../../features/templates/template-slice'
import { Link } from 'react-router-dom'
import featureServices from '../../services/features'
import PreviewPopup from '../EditUseCaseView/previwePopup'
import { useSearchParams } from 'react-router-dom'

const TemplateLibrary = () => {
    const [userTemplates, setUserTemplates] = useState<Template[]>([])
    const [masterTemplates, setMasterTemplates] = useState<Template[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<Template>()
    const [isTemplateLoading, setIsTemplateLoading] = useState<any>(false)
    const {accountId , containerId} : any = useContext(AuthContext) ; 
    const [previwePopupState, setPreviwePopupState] = useState<boolean>(false)
    const [selectedOptionId, setselectedOptionId] = useState(0)
    const [optionViewStructure, setoptionViewStructure] = useState<{ viewStructure: any; name: any }[]>([])
    let [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("viewStructure") ? searchParams.get("viewStructure") : 'All')    
    useEffect(() => {
        if(accountId && containerId)
        fetchTemplates(query);
        getUseCases()
    }, [containerId , accountId , query])
    async function getUseCases () {
        const masterUseCase = await featureServices.getFeaturesMaster() ;
        let set = new Set() ;
        let tempArray: { viewStructure: any; name: any }[] = [];
        masterUseCase.map((ele: any) => {
           if(!set.has(ele?.viewStructure)){
            tempArray.push({
            viewStructure : ele.viewStructure ,
            name : ele.viewStructure
            })
        }
        set.add(ele.viewStructure);
        
    })
    const allOptionObject = {
        viewStructure : 'All',
        name : 'All'
    }
    setoptionViewStructure([allOptionObject,...tempArray]);
    }
    const fetchTemplates = async (val:any) =>{
            const searchQuery = val==='All' ? '': `viewStructure=${val}`
            const temps = await getTemplates(accountId, containerId,searchQuery) || []
            const masterTemps = await getMasterTemplates(searchQuery) || []
            setUserTemplates([...temps])
            setMasterTemplates([...masterTemps])
      }
    
    function handleSelectionTemplate (id: string ) {
        return;
    }

    function handleEditClick(temp: Template) {
        return;
    }

    function handlePreview (template : Template) {
        setSelectedTemplate(template);
        setPreviwePopupState(true);  
      }
    const handleStructureOption=(option: string , index:number)=>{
        setselectedOptionId(index)
        setSearchParams({ "viewStructure" : option})    
        setQuery(option) 
      }
    function handleEditTemplate(id: string) {
        return;
    }
    function capitalizeFirstLetter(input: string): string {
        if (!input)  return ''      
        return input.charAt(0).toUpperCase() + input.slice(1);
      }

  return (
    <div className='template-library-outer-wrapper'>
         { previwePopupState && <PreviewPopup modalState={previwePopupState} setmodalState={setPreviwePopupState} template={selectedTemplate || masterTemplates[0]} selectNewTemplate={handleEditTemplate} buttonTitle={'Edit This Template'} />}
        <div className="template-library-header">
            <div className="template-library-main-header">
                <h1 className="header-heading display-sm--sb"> 
                    Template Library
                </h1>
                <h3 className='text-md header-subheading' >
                Manage and Configure your Use Cases here.
                </h3>
            </div>
            <div className="selecting-header-heading">
                <div className="left-section-header">
                    {
                        optionViewStructure?.map((element: any , index:number) => (
                            <div className={`selecting-template-heading ${element.viewStructure === query ? 'selected-option' : ''}`} onClick={() => handleStructureOption(element.viewStructure , index)}>
                                {capitalizeFirstLetter(element.name)}
                            </div>
                        ))
                    }
                </div>
                <div className="right-section-header">
                    <div className="filter-button--wrapper">
                        <img src={filterIcon} alt="" />
                        <p>Filter</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="template-library-container">
            <TemplatesView userTemplates={userTemplates} masterTemplates={masterTemplates} handleSelectTemplate={handleSelectionTemplate} selectedTemplateId={''} handleEditClick={handleEditClick} handlePreviwe={handlePreview} showMyTemplate={true} />
        </div>
    </div>
  )
}

export default TemplateLibrary
