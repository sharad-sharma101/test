import {useState , useContext , useEffect} from 'react'
import "./index.sass"
import { getTemplates , getMasterTemplates } from '../../components/editor/api'
import { AuthContext } from '../../auth/AuthContext'
import TemplateCard from '../../components/templates/template-card'
import AddTemplateCard from '../../components/add-template-card'
import { useNavigate, useSearchParams} from 'react-router-dom'
import featureServices from '../../services/features'
import PreviewPopup from '../EditUseCaseView/previwePopup'

const AllTemplateView = () => {
    const [selectedOptionId, setselectedOptionId] = useState(0)
    const [optionViewStruction, setoptionViewStruction] = useState<{ viewStructure: any; name: any }[]>([])
    const [allTemplates, setAllTemplates] = useState<Template[]>([])
    const [selectedTemplate, setselectedTemplate] = useState<Template>()
    const {accountId , containerId} : any = useContext(AuthContext) ; 
    let [searchParams, setSearchParams] = useSearchParams();
    const [previwePopupState, setPreviwePopupState] = useState<boolean>(false)
    const [query, setQuery] = useState(searchParams.get("view-structure") ? searchParams.get("view-structure") : 'All')    
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
    setoptionViewStruction([allOptionObject,...tempArray]);
    }
    const fetchTemplates = async (val:any) =>{
        if(val === 'All'){
            const temps = await getTemplates(accountId, containerId,'') || []
            setAllTemplates([...temps])
        } else {
            const searchQuery = `viewStructure=${val}`
            const temps = await getTemplates(accountId, containerId,searchQuery) || []
            setAllTemplates([...temps])
        }
      }
     

    function handlePreviwe(template: Template) {
        setselectedTemplate(template)
        setPreviwePopupState(true)
    }
    function handleSelectTemplate () {
        return;
    }

    const handleStructureOption=(option: string , index:number)=>{
        setselectedOptionId(index)
        setSearchParams({ "viewStructure" : option})    
        setQuery(option) 
      }
    function capitalizeFirstLetter(input: string): string {
      if (!input)  return ''      
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
      
  return (
    <div className='see-all-template-wrapper'>
        { previwePopupState && <PreviewPopup modalState={previwePopupState} setmodalState={setPreviwePopupState} template={selectedTemplate || allTemplates[0]} selectNewTemplate={() => {}} buttonTitle={'Edit This Template'} />}
        
        <div className="selecting-header-heading">
                <div className="left-section-header">
                    {
                        optionViewStruction?.map((element: any , index:number) => (
                            <div className={`selecting-template-heading ${index === selectedOptionId ? 'selected-option' : ''}`} onClick={() => handleStructureOption(element.viewStructure , index)}>
                                {capitalizeFirstLetter(element.name)}
                            </div>
                        ))
                    }
                </div>
        </div>
        <div className="all-templates-card-outer-wrapper">
            <h1 className='text-xl--md' >My Templates</h1>
            <div className="template-grid-wrapper">
                <div className="master-template-section">
                    <AddTemplateCard />
					{allTemplates.slice().reverse().map((template, idx) => (
						<TemplateCard {...template}
							template={template}
							handleSelectTemplate={handleSelectTemplate}
							active={false}
							handleEditClick={()=>{}}
							handlePreviwe={handlePreviwe}
							key={idx}/>
					))}
				</div>	
            </div>
        </div>
    </div>
  )
}

export default AllTemplateView
