import React, {useState, useEffect , useReducer} from 'react'
import { List, ListItem } from "@attrybtech/attryb-ui"
import "./index.sass"

const Trigger:React.FC<Trigger> = ({trigger ,setSelectedObject , label , activeItem,readOnlyMode}) =>{

    const [triggerList, setTriggerList] = useState([])
    const [activeTrigger, setActiveTrigger] = useState({})
    const [listState, setListState] = useState('disabled')
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
     if(trigger?.length){
        
      const updatedList =  trigger.map((t:any)=>{
        return {
            _id:t._id,
            value:t.value,
            data:t
        }
      })
        const selectedObject = updatedList.filter((ele:any) => ele.value === activeItem)
        
        if(selectedObject.length !== 0)
            selectHandler(selectedObject[0])
        setTriggerList(updatedList)
        
        setListState('')
     } else {
        setTriggerList([])
        setListState('disabled')
     }

    }, [trigger])


    /// to disable dropdown on list have only 1 option
    useEffect(() => {
        if(trigger?.length === 1) {
            selectHandler(triggerList[0])
         }
        forceUpdate();
    }, [triggerList])

    const selectHandler = (item:any) => {
        setSelectedObject(item)
        setActiveTrigger(item)
    }
 
    return (
            <div className="trigger-section__container" >

                <div className="trigger-list-wrapper" >
                    <List
                        list={triggerList}
                        activeItem={activeTrigger}
                        buttonPlaceholder={label}
                        buttonState={`${listState}`}
                        searchProps={[]}
                        selectCallback={selectHandler}
                        variant={readOnlyMode&&"read-only"}>
                        {triggerList.map((item:any) => {
                            return (
                                <ListItem key={item._id} data={item}>
                                   
                                        <p>{item.value}</p>
                                </ListItem>
                            )
                        })}
                    </List>
                </div>

                </div> 
    )
}

export default Trigger