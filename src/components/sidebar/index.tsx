import React,{useState} from 'react'
import { List, ListItem, Button } from "@attrybtech/attryb-ui"
import USE_CASES from '../../data/use-cases.json'
import { Link } from 'react-router-dom';
import "./index.sass"
import UseCaseCard from '../use-case-card';
import { FiSidebar } from "react-icons/fi";

const SIDEBAR_STATES = {
    expand:"expand",
    collapse:"collapse",
    default:"collapse"
}

export default function Sidebar({children,headerChild, aligned="left", navState, type }:Sidebar) {
    const [ status, setStatus ] = useState(navState||SIDEBAR_STATES.default)

    const handleStatusChange = () =>{
        switch (status) {
            case SIDEBAR_STATES.collapse:
                setStatus(SIDEBAR_STATES.expand)
                break;
            case SIDEBAR_STATES.expand:
                setStatus(SIDEBAR_STATES.collapse)
                break;
        }
    }

    const isSidebarCollapse = () => status === SIDEBAR_STATES.collapse

  return (
    <>
    {
        (type === "overlay" && !isSidebarCollapse()) ? <>
        <div className="sidenav-backdrop"></div>
        </> : <></>
    }
    <aside className={`side-nav --${status} ${aligned} --${type}`} >
        <div className="side-nav__section">
            <div className="side-nav__subheading">
            { !isSidebarCollapse() && headerChild }
            <div className="side-nav__status-icon" onClick={handleStatusChange}>
                <FiSidebar color={isSidebarCollapse() ?"#6e40ff" :"" } />
            </div>
            </div>
            { !isSidebarCollapse() &&   <>
            {children}
            </>}
        </div>
    </aside>
    </>
  )
}