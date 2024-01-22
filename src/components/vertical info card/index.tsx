import React from 'react'
import Skeleton from "react-loading-skeleton";
import "./index.sass"
import "react-loading-skeleton/dist/skeleton.css";


type Props = {
    imgeSrc: string;
    title: string;
    description: string;    
    isLoading?:boolean
};

const VerticalInfoCard = ({ imgeSrc , title , description, isLoading } : Props) => {
    return (
        <div className="tutorial-card--wrapper">
            <div className="tutorial-card-container">
                <div className="tutorial-card--header">
                    {isLoading ? <Skeleton circle width={"3.5rem"} height={"3.5rem"} containerClassName=''/> : <img src={imgeSrc} alt="" />}
                </div>
                <div className="tutorial-card-body">
                    <div className="tutorial-card--title text-md--sb">
                    {isLoading ? <Skeleton width={"12.3704rem"} height={"1.1829rem"} containerClassName='tutorial-card--title'/> : <p>{title}</p>}
                    </div>
                    <div className="tutorial-card--description text-md">
                    {isLoading ? <Skeleton width={"12.3704rem"} height={"1.1829rem"} containerClassName='tutorial-card--description'/> : <p>{description}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerticalInfoCard
 
