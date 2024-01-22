import React, {useState, useEffect , useReducer} from 'react'
import { List, ListItem } from "@attrybtech/attryb-ui"
import "./index.sass"

const FrequencyDropDown = ({selectedItem , activeRow}: any) =>{

    const optionList = [
        
        {
            _id: 1,
            value: "Limited"
        },
        {
            _id: 2,
            value: "Not Limited"
        }
    ]
    
    const [activeOption, setActiveOption] = useState(activeRow )
    const selectHandler = (item:any) => {
        setActiveOption(item)
        selectedItem(item)
    }
 
    return (
            <div className="trigger-section__container" >

                <div className="trigger-list-wrapper" >
                    <List
                        list={optionList}
                        activeItem={activeOption}
                        buttonPlaceholder={activeOption?.value }
                        searchProps={[]}
                        selectCallback={selectHandler}
                        variant={false}>
                        {optionList.map((item:any) => {
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

export default FrequencyDropDown