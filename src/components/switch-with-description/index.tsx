import React,{useState} from "react"
import {useNavigate} from "react-router-dom"
import SettingIcon from "../../assets/images/settings.svg"
import Dots from "../../assets/images/vertical-dots.svg"
import {
	useModal
} from "@attrybtech/attryb-ui"
import "./index.sass"

const EDIT_OPTIONS = [
	{
	  label:"Templates",
	  route:"templates"
  },
  {
	  label:"Placement",
	  route:"placement"
	},
	// {
	// 	label:"Configuration",
	// 	route:"configuration"
	// },
  ]
  
interface Props {
	description: string
	checked: boolean
	disable?:boolean
	toggleCallback: (e:unknown) => void
	onIconClick:()=>void
	type?:string
}

const SwitchWithDescription: React.FC<Props> = ({
	description = "",
	checked = true,
	toggleCallback,
	onIconClick,
	disable=false,
	type=""
}) => {
	const [showOptions, setShowOptions] = useState(false)

	return (
		<div className={`switch-with-description ${disable && '--disable'}`}>
			<p>{description}</p>
			<label className="switch">
				<input type="checkbox" checked={checked} onChange={toggleCallback} />
				<span className="slider round"></span>
			</label>
			<div className="setting-icon" onClick={()=>{
				if(type === "dropdown")
					setShowOptions(!showOptions)

				else{
					onIconClick()
				}
				}} >
				<img src={type === "dropdown" ? Dots : SettingIcon} alt="" />
			</div>
		</div>
	)
}

export default SwitchWithDescription