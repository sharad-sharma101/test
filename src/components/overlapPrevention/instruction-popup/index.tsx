import React, { useEffect } from 'react'
import "./index.sass";
import crossSvg from "../../../assets/cross.svg"
import {OVERLAP_INSTRUCTION} from "../../../utils/constants"
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setOverlapType} from "../../../features/templates/template-slice";
// import cooldownGif from "../../../assets/over-lap-prevention/show-cooldown.gif"
// import noShowGif from "../../../assets/over-lap-prevention/dont-show.gif"
// import showGif from "../../../assets/over-lap-prevention/Show.gif"
interface InstructionPopup {
    handleCross: () => void
}

const InstructionPopup: React.FC<InstructionPopup> = ({handleCross}) => {
  const dispatch = useAppDispatch()
  const {overlapType}=useAppSelector((store:any)=>store.templateConfigs)
  function handleOverpalType(str: string) {
    dispatch(setOverlapType(str))
  }
  const gif = [ 'show' , 'no-show' , 'cooldown' ]
  function returnGif( str: string){
    // if( str === gif[0] ) {
    //     return showGif
    // } else if( str === gif[1] ) {
    //     return noShowGif
    // } else if( str === gif[2] ) {
    //     return cooldownGif
    // }
    return ''
  }
 
  return (
    <div className='sidepopup_wrapper'>
        <div className="overlay" onClick={handleCross}></div>    
        <div className="right-side-instruction-section">
            <div className="popup-cross-wrapper" onClick={handleCross}>
                <img src={crossSvg} alt="" />
            </div>
            <div className="heading-section">
                <h2 className='text-lg--sb'>When displaying multiple floating widgets simultaneously, you can select from various options for their appearance to optimize User Experience.</h2>
            </div>
            <div className="description-option">
                {
                    OVERLAP_INSTRUCTION.map((data: any) => ( 
                        <div className="card-of-description" onClick={ () => handleOverpalType(data.selected)}>
                            <div className="option-to-select">
                                <div className="radio-input-wrapper">
                                    <input
                                        className="radio-input-circle"
                                        checked={overlapType === data.selected}
                                        type="radio"
                                        name="overlap-check"
                                        value=""
                                    />
                                </div>
                            </div>
                            <div className="middle-section-text">  
                                <div className="heading-section">
                                    <h3 className='text-md--sb' >{data.heading}</h3>
                                </div>
                                {
                                    data.subheading.map((content: string) => (
                                        <div className="description-insctruction">
                                            <p className='text-sm' >{content}</p>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="right-side-gif-wrapper">
                                {/* <img src={returnGif(data.gifLink)} alt="" width="100%" height="100%"/> */}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default InstructionPopup
