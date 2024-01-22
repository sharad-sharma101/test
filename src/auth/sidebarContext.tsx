import { log } from "console";
import React, { useState, createContext } from "react"

const SidebarContext = createContext({});

const SidebarInformation = (props : any) => {

    const [collapseState, setcollapseState] = useState<boolean>(true)

    function toggleSidebar(state : boolean) {
        setcollapseState(state)
    }

    return (
        <SidebarContext.Provider value={{ toggleSidebar , collapseState }}>{props.children}</SidebarContext.Provider>
    )
}

export { SidebarInformation, SidebarContext }