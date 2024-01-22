import { Switch } from "@attrybtech/attryb-ui";
import React, { useState, useRef, useEffect } from "react";
import './index.sass'

const Appswitch = () =>{

    const [togglePeriod, setTogglePeriod] = useState<boolean>(false)
    const handlePeriodToggle = () => {
        setTogglePeriod(!togglePeriod)
    }

    return(
          <div>
            <Switch value={togglePeriod} onClick={() => handlePeriodToggle()} ></Switch>
          </div>
    )
}

export default Appswitch;