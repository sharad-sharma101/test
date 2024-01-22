import React from "react";
import "./index.sass";

const AppHeader:React.FC<any> = ({ pageTitle="" }) => {
	return (
		<header className="app-header">
			<div className="app-header__heading">{pageTitle}</div>
		</header>
	);
};

export default AppHeader;