import React, { useEffect } from 'react';
import "./index.sass";
import upArrow from "../../assets/upArrowIcon.svg";
import downArrow from "../../assets/downArrwoIcon.svg";
import Chart from '../cards';
 
const KpiCard = ({header, numbers, graph, statistic, context , showGraph=true }:any) => {

  return (
    <div className='metric-card '>
        <div className="metric-data">
            <div className='text-area'>
                <h1 className='text-xs kpi-heading'>{header}</h1>
                <div className="metric-number display-xs--sb">{numbers}</div>
                {/* <div className="metrics-subdata">
                    <div className={`metric-data-number  ${graph === 'up' ? 'graphUp' : 'graphDown'}`}>
                        <div className="arrowImage">
                            <img src={graph === 'up' ? upArrow : downArrow} alt="arrow" />
                        </div>
                        <div className="text-sm--md">{statistic}</div>
                    </div>
                    <div className="metric-context text-sm--md">{context}</div>
                </div> */}
            </div>
            {
                showGraph ?
                <div className='metric-chart'><Chart graphData={graph} /></div>
                : <></>
            }
        </div>
    </div>
  )
}

export default KpiCard