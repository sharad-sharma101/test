import { useSearchParams } from 'react-router-dom'
import PlacementsPage from '../../pages/Placements'
import EditorView from '../Editor'
import {useState , useEffect} from "react"
import placementSvg from "../../assets/images/placement/placement.svg"
import variableSvg from "../../assets/images/placement/variable.svg"
import unselectedPlacement from "../../assets/images/placement/unselected-placement.svg"
import unselectedVariable from "../../assets/images/placement/unselected-variable.svg"
import "./index.sass"

const PlacementVariable = ({selectedTemplate} : any) => {
  const [placementPage , setPlacementPage] = useSearchParams(); 
  const [query, setquery] = useState(placementPage.get('step') ? placementPage.get('step') : 'placement' ) 
  useEffect(() => {
    if(query)
    setPlacementPage({"step" : query})
  }, [query])
  
  return (
    <div className='placement-and-variable-wrapper' >
      <div className="navigation-left-sidebar-template">
      <div className={`placement-button-wrapper navigate-button-wrapper ${query === 'placement' ? 'selected' : ''}`}  onClick={() => setquery('placement')}>
          <div className="navigate-container">
            <div className="image-container">
              {
                query === 'placement' ?
                <img src={placementSvg} alt="" /> :
                <img src={unselectedVariable} alt="" />
              }
            </div>
            <p className='query-text text-xs--md'>Placement</p>
          </div>
        </div>
        <div className={`variable-button-wrapper navigate-button-wrapper ${query === 'variable' ? 'selected' : ''}`} onClick={() => setquery('variable')}>
          <div className="navigate-container">
            <div className="image-container">
            {
                query === 'variable' ?
                <img src={variableSvg} alt="" /> :
                <img src={unselectedPlacement} alt="" />
              }
            </div>
            <p className='query-text text-xs--md'>Design</p>
          </div>
        </div>
      </div>
      <div className="right-section-placement">
        {
          query === 'variable'  ?
          <EditorView/> :
          <PlacementsPage currentTemplate={selectedTemplate} />
          
        }
      </div>
    </div>
  )
}

export default PlacementVariable
