import React, { useEffect, useState } from 'react'
import "./index.sass"
import TriggerPage from '..'
import { Button } from '@attrybtech/attryb-ui'
import seleteIcon from "../../../assets/images/delete.svg"
import { TRIGGER_DEFINATION } from '../../../utils/constants'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '../../../app/hooks'
import { handleTriggerAndCondition,handleParticularDeleteTrigger } from '../../../features/triggers/triggers-slice'

const CompleteTriggerPage = ({ triggersData , selectedTriggerGroup , indexX,readOnlyMode } : any) => {
 const [check, setcheck] = useState(true)
 const dispatch=useAppDispatch()
    
    function handleAddMore() {
       dispatch(handleTriggerAndCondition(indexX))
    }

    function handleDeleteTrigger(indexY: number) {
        dispatch(handleParticularDeleteTrigger([indexX,indexY]))
        setcheck(!check)
    }


  return (
    <div>

        <div  className={`and-condition-trigger-container ${readOnlyMode&&`make-grey-trigger`}`}> 

           {   selectedTriggerGroup.map((element: any , index : number,_id:string) => (
               <>
                <TriggerPage readOnlyMode={readOnlyMode} triggersData={triggersData} selectedTrigger={element} index={index}  key={_id} parentIndex={indexX}  handleDeleteTrigger={handleDeleteTrigger} />
                {index < selectedTriggerGroup.length - 1 ? 
                 ( 
                   <>
                   <div className="connected-line"></div>
                    <div className="container-trigger--footer inbetween">
                        <Button variant={'solid'} colorScheme={'secondary'} onClick={() => {}} >AND</Button>
                    </div>
                    <div className="connected-line"></div>
                   </>
                 ) : 
                 (
                  //and button
                   <>
                  {!readOnlyMode&& <div className="connected-line"></div>}
                  {!readOnlyMode&&<div className="container-trigger--footer">
                        <Button variant={'solid'} colorScheme={'secondary'} onClick={() => handleAddMore()} >AND</Button>
                    </div>}
                   </>
                 )
                  }
               </>
            ))  }
         
        </div>
 
    </div>
  )
}

export default CompleteTriggerPage
