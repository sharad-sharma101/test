import CompleteTriggerPage from "../../CombineViweTriggerPage";
import "./index.sass";
import { Button } from "@attrybtech/attryb-ui";
import ConfigurationAccordion from "../../../../components/ConfigurationAccordion";
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { handleTriggerOrCondition } from '../../../../features/triggers/triggers-slice'

const AllTriggersBody = ({triggersData,readOnlyMode}: any) => {
    const {triggerArray }=useAppSelector((store)=>store.triggersConfig)
    const dispatch=useAppDispatch()
  
    return (
     
          <div className="triggers-body--data">
              {
                triggerArray?.map((element: any , index:any) => (
                  <> 
                  <CompleteTriggerPage readOnlyMode={readOnlyMode} triggersData={triggersData} selectedTriggerGroup={element}  indexX={index} key={index} />
                  {index < triggerArray.length - 1 ? 
                    ( 
                      <>
                      <div className="connected-line"></div>
                       <div className="container-trigger--footer inbetween">
                           <Button variant={'solid'} colorScheme={'secondary'} onClick={() => {}} >OR</Button>
                       </div>
                       <div className="connected-line"></div>
                      </>
                    ) : 
                    (
                      // or part
                      <>
{        !readOnlyMode&&<div className="connected-line"></div>}
                       {!readOnlyMode&&<div className="container-trigger--footer">
                           <Button variant={'solid'} colorScheme={'secondary'} onClick={() => dispatch(handleTriggerOrCondition())} >OR</Button>
                       </div>}
                      </>
                    )
                     }
                     </>
                ))
              }
          </div>
    );
  };
  
export default AllTriggersBody