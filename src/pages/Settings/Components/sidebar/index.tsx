import {Link} from "react-router-dom"
import UserSquareIcon from "../../../../assets/images/sidebar/user-square.svg"
import BankNoteIcon from "../../../../assets/images/sidebar/bank-note-01.svg"
import GlobeIcon from "../../../../assets/images/sidebar/globe-06.svg"
import UsersEditIcon from "../../../../assets/images/sidebar/users-edit.svg"
import UserCheckIcon from "../../../../assets/images/sidebar/user-check-01.svg"
import LayoutGridIcon from "../../../../assets/images/sidebar/layout-grid-01.svg"
import UsersPlusIcon from "../../../../assets/images/sidebar/users-plus.svg"
import "./index.sass"


const Sidebar = () => {
    
    const SideBarDetail = [
        {
            _id: "1",
            title: "Personal Information",
            route: "/settings/",
            asset: UserSquareIcon,
        },
        {
            _id: "2",
            title: "Billing and Payment",
            route: "#",
            asset: BankNoteIcon,
        },
        {
            _id: "3",
            title: "Domains",
            route: "/settings/domains",
            asset: GlobeIcon,
        },
        {
            _id: "4",
            title: "User Management",
            route: "#",
            asset: UsersEditIcon,
        },
        {
            _id: "5",
            title: "Customer Experience",
            route: "#",
            asset: UserCheckIcon,
        },
        {
            _id: "6",
            title: "Page Structure",
            route: "#",
            asset: LayoutGridIcon,
        },
        {
            _id: "7",
            title: "Invite and Referrals",
            route: "#",
            asset: UsersPlusIcon,
        }
    ]

    return (
        <div className='settings-sidebar-wrapper' >
            <div className="settings-sidebar--content">
                <div className="settings-header-sidebar" >
                    <p className="display-xs--md">Settings</p>
                </div>
                <div className="settings-body-sidebar">
                    {
                        SideBarDetail.map((element: any, index: number) => (
                            <Link to={element.route} >
                                <div className="settings-sidebar-option">
                                    <div><img src={element.asset} alt="" /></div>
                                    <p className="text-md">{element.title}</p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default Sidebar;