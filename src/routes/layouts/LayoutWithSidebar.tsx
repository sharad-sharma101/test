import React, { ReactNode } from "react";
import AppSidebar from "../../components/app-sidebar";
import { NavbarComponent } from "../../components/navbar";

const LayoutWithSidebar: React.FC<{children:ReactNode}> = ({ children }) => {
	return (
		<div className="App__block">
			<AppSidebar />
			<div className="page-screen">
				<NavbarComponent />
				{children}
			</div>
		</div>
	);
};

export default LayoutWithSidebar;
