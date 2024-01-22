import React from 'react'
import "./index.sass"
import Placement from '../../components/placement'

const PlacementPage = ({ placementData, setSelectedPlacement, selectedPlacement }: any) => {

    const handlePlacementSelection = (item: any = [], placementId: any) => {
        const updatedPlacement = { _id: placementId, data: item.data }
        setSelectedPlacement(updatedPlacement);
    }
    return (
        <div>
            <div className="configuration-section__placement-container">
            <h1 className='text-lg-sb' >Placement </h1>
                {
                    placementData.map((placement: any, idx: number) =>
                        <Placement placement={placement} key={placement?._id} handlePlacementSelection={handlePlacementSelection} selectedPlacements={selectedPlacement} idx={idx} />
                    )
                }
            </div>
        </div>
    )
}

export default PlacementPage
