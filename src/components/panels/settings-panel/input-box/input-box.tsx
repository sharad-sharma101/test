import React, { useState, useEffect } from "react"
import { containsSpecialChars } from "../../../../utils/helpers"
import { List, ListItem } from "@attrybtech/attryb-ui"
import "./input.sass"
import { UnitObject } from ".."

const percentage = "%"

interface Props {
	label: string
	placeholder: string
	value?: number | string
	name?: string
	type?: string
	unit?: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>|null,unitObject?: UnitObject|undefined) => void
}

export interface MetaFieldUnit {
	_id: string
	value: string
	data?: object
}

const metaFieldUnits: MetaFieldUnit[] = [
	{
		_id: "percentage",
		value: "%",
	},
	{
		_id: "absolute",
		value: "Absolute",
	},
]

export const InputBox: React.FC<Props> = ({
	label,
	onChange,
	placeholder = "Enter value",
	value: propValue,
	name = "",
	type = "text",
	unit = "",
}) => {
	const [value, setValue] = useState<string | number>("")
	const [selectUnit, setSelectUnit] = useState<MetaFieldUnit | {}>({})
	const [isUnitListDisplay, setIsUnitListDisplay] = useState<boolean>(false)
	const [absoluteValue, setAbsoluteValue] = useState<string>("$")
	const [isAbsoluteValueVisible, setIsAbsoluteValueVisible] = useState<boolean>(false)

	useEffect(() => {
		if (propValue) {
			setValue(propValue)

			const { test, match } = containsSpecialChars(unit)
			if (test) {
				const selectUnitTemp = [...metaFieldUnits].filter((u) => u.value === unit)
				if (selectUnitTemp.length) setSelectUnit(selectUnitTemp[0])
				else {
					const absoluteSelectedMetaFeild = metaFieldUnits[1]
					setSelectUnit(absoluteSelectedMetaFeild)
					setAbsoluteValue(unit)
					setIsAbsoluteValueVisible(true)
				}
			}
			if (unit) {
				setIsUnitListDisplay(true)
			}
		}
	}, [propValue, unit])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// prevent entering the negitive values
		if (parseInt(event.target.value) < 0) {
			event.preventDefault()
			return
		}
		setValue(event.target.value)
		onChange(event)
	}

	const handleUnitSelect = (item: MetaFieldUnit) => {
		setSelectUnit(item)
		if (item._id === "absolute") {
			setIsAbsoluteValueVisible(true)
			onChange(null, { name: "unit", value: absoluteValue || "$" })
			return;
		}
		onChange(null, { name: "unit", value: item.value })
		setIsAbsoluteValueVisible(false)
	}

	return (
		<>
			{
				<div
					className={`${
						isAbsoluteValueVisible && "--visible"
					} absolute-field-container input-contianer`}
				>
					<input
						type="text"
						value={absoluteValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setAbsoluteValue(e.target.value)
							onChange(e)
						}}
						name="unit"
						className="input"
					/>
				</div>
			}

			<div className={`input-label-container`}>
				<label className="input-label">{label}</label>
				<div className={`input-contianer`}>
					<input
						className="input"
						type={type}
						value={value}
						onChange={handleChange}
						placeholder={placeholder}
						name={name}
					/>
				</div>
			</div>

			{isUnitListDisplay && (
				<div className="meta-field-units">
					<List
						list={[...metaFieldUnits]}
						activeItem={selectUnit}
						buttonPlaceholder="Select unit"
						// searchProps={["value"]}
						selectCallback={handleUnitSelect}
					>
						{[...metaFieldUnits].map((item) => {
							return (
								<ListItem key={item._id} data={item}>
									{item.value}
								</ListItem>
							)
						})}
					</List>
				</div>
			)}
		</>
	)
}
