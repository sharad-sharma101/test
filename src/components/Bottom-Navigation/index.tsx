import React from "react"
import LayoutIcon from "../../assets/images/layout.svg"
import SettingIcon from "../../assets/images/setting--white.svg"
import "./index.sass"

interface Props {
	handleToggleBrowserView: () => void
	handleLayoutClick: () => void
}

const BottomNavigation: React.FC<Props> = ({ handleToggleBrowserView, handleLayoutClick }) => {
	return (
		<div className="bottom-navigation-mobile">
			<div className="navigation-icon" onClick={handleToggleBrowserView}>
				<img src={SettingIcon} alt="" />
			</div>
			<div className="navigation-icon" onClick={handleLayoutClick}>
				<img src={LayoutIcon} alt="" />
			</div>
		</div>
	)
}

export default BottomNavigation