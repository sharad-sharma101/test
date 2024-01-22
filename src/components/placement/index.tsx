import React, {useState, useEffect} from 'react'
import { List, ListItem } from "@attrybtech/attryb-ui"
import "./index.sass"
import { objectKeys } from '../../utils/helpers'

const Placement:React.FC<Placement> = ({placement, handlePlacementSelection, selectedPlacements, idx}) =>{

    const [placementList, setPlacementList] = useState([])
    const [activePlacement, setActivePlacement] = useState({})
    
    useEffect(() => {
     if(objectKeys(placement)){
      const updatedList = placement?.data.map((t:any)=>{
        return {
            _id:t._id,
            value:t.name,
            data:t
        }
      })
        setPlacementList(updatedList)
     }
    }, [placement]) 
    useEffect(() => {

        if(selectedPlacements){
            const newActivePlacement = {
                data :  selectedPlacements.data,
                value :  selectedPlacements?.data?.name,
                _id :  selectedPlacements._id
            }
            setActivePlacement(newActivePlacement);
         } 
    }, [selectedPlacements])
    
    const selectHandler = (item:any) => {
        setActivePlacement(item)
        handlePlacementSelection(item , placement._id )
    }

    
  
    // const filterSelectedPlacement  = () =>{

    //     const selectedPlacement = selectedPlacements.filter( (t:any)=> t?._id === placement._id)[0]

    //     if(!selectedPlacement) return {}

    //     return {
    //         _id:selectedPlacement.data.Parameter,
    //         value:selectedPlacement.data.Parameter,
    //         data:selectedPlacement.data
    //     }
    // }


    return (
            <div className="placement-section__container" >

                <div>
                    <h6 className="m-large" >Placement</h6>         
                </div>

                <div className="" >
                    { !!placementList.length &&  <List
                        list={placementList}
                        activeItem={activePlacement}
                        buttonPlaceholder="Select some items"
                        searchProps={["value"]}
                        selectCallback={selectHandler}>
                        {placementList.map((item:any) => {
                            return (
                                <ListItem key={item._id} data={item}>
                                    {item.value}
                                </ListItem>
                            )
                        })}
                    </List>}
                </div>

                </div> 
    )
}

export default Placement