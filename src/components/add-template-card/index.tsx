import React, {useState} from 'react'
import addIcon from "../../assets/template-library/plus-circle.svg"
import "./index.sass"
import CreateTemplatePopup from '../create-new-template'

const AddTemplateCard = () => {
  const [openPopup, setopenPopup] = useState(false)
  function handleCrossEvent(state : boolean) {
    setopenPopup(state)
  }
   
  return (
    // <div className='add-template-card-wrapper'>
    //     <div className="template-snapshot-wrapper" onClick={() => setopenPopup(true)} >
    //         <div className="add-icon-wrapper">
    //             <img src={addIcon} alt="" />
    //         </div>
    //     </div>  
    //     <div className="title-wrapper">
    //         <p className='text-sm' >Create New Template</p>
    //     </div>   
    //     <CreateTemplatePopup popupState={openPopup} handleCrossEvent={handleCrossEvent} />
    // </div>
    <></>
  )
}

export default AddTemplateCard
