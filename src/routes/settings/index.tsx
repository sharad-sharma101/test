import React from "react";
import { Route, Routes } from "react-router-dom";
import {NavbarComponent} from "../../components/navbar"
import AppSidebar from "../../components/app-sidebar";
import SubSideBar from "../../pages/Settings/Components/sidebar"
import Domains from "../../pages/Settings/Domains";
import PersonalInformation from "../../pages/Settings/personal-information";
import { Navigate } from "react-router-dom";
import UserManagement from "../../pages/UserManagement";

export default function SettingsRoutes() {

    return(
        <div className="App__block">
            <AppSidebar />
            <SubSideBar />
            <div className="page-screen">
                <NavbarComponent />
                <Routes>
                    <Route path="/" element={<PersonalInformation />} />
                    <Route path="/domains" element={<Domains />} />
                    <Route path="/user-management" element={<UserManagement />} />
                </Routes>

            </div>
        </div>
    )

}