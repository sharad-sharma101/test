import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import {
	getFeatureSettings,
	updateFeatureSettings,
} from "../../../../features/customer-configs/feature-settings-slice"
import { getSelectedFeature } from "../../../../features/features-configurations/features-slice"
import {
	convertColorRGBToHex,
	extractUnitFromValue,
	getStyle,
	postCssChangesInRealTime,
	removeUnitFromValue,
} from "../../../../utils/helpers"
import COMPLETION from "../../../../data/completions.json"
import { List, ListItem } from "@attrybtech/attryb-ui"

import "./index.sass"
import { addVersionOnIndex, createVersion } from "../../../../features/feature-versions/feature-version-slice"
import { CSS_UNITS } from "../../../../utils/constants"

interface Option {
	_id: string
	value: string
	data?: object
}

interface Props {
	label: string
	type?: string
	name: string
	onChange: () => void
}

// const unit = "px"



const InputWithLabel: React.FC<Props> = ({
	label = "",
	type = "text",
	name = "",
	onChange: handleChange,
}) => {
	const [value, setValue] = useState<string>("")
	const [unit, setUnit] = useState<string>("px")
	const [showOptions, setShowOptions] = useState<boolean>(false)
	const [selectedOption, setSelectedOption] = useState<Option>({ _id: "", value: "", data: {} })
	const [options, setOptions] = useState<Option[]>([])

	const dispatch = useAppDispatch()
	const selectedFeatureSettings = useAppSelector(getFeatureSettings)
	const selectedFeature = useAppSelector(getSelectedFeature)
	const feature = useAppSelector((state) => state.features)

	useEffect(() => {
		// if feature settings exists then pre-poulate its css from redux store
		if (selectedFeatureSettings) {
			if (selectedFeatureSettings?.css[name]) {
				if (checkInputType("number")) {
					setValue(parseUnit(selectedFeatureSettings?.css[name]))
				} else if (
					checkInputType("text") ||
					(checkInputType("color") && selectedFeatureSettings?.css[name].includes("#"))
				) {
					setValue(selectedFeatureSettings?.css[name])
				}
			}
		}

		if (!selectedFeatureSettings?.css[name] && selectedFeature) {
			const preStyle = getStyle(
				selectedFeature?.rules[0].then[0]?.params?.webComponent || "",
				name
			)
			let preStyleValue = preStyle || ""
			const unitFromVal = extractUnitFromValue(preStyleValue)
			if(unitFromVal) setUnit(unitFromVal)

			if(preStyleValue && !(checkInputType("color") && preStyleValue.toLowerCase().includes("nan"))  ){
				dispatch(
					addVersionOnIndex({
						_id: selectedFeature?._id,
						version: {
							[name.toLowerCase()]: preStyleValue,
						},
						index:0
					})
				)
			}

			if (checkInputType("color")) preStyleValue = convertColorRGBToHex(preStyle)
				else if (checkInputType("number") && preStyle.includes(unit)) {
					preStyleValue = parseUnit(preStyle)
				} else if (checkInputType("text")) preStyleValue = preStyle


			setValue(removeUnitFromValue(preStyleValue))
			
		}
	}, [selectedFeature, feature])

	useEffect(() => {
		if (checkInputType("text") && options.length && value && selectedOption.value !== value) {
			setSelectedOption(options.filter((option) => option.value === value)[0])
		}
	}, [value, options])

	useEffect(() => {
		const completionOptions = COMPLETION.properties
		if (name && Object.keys(completionOptions).includes(name)) {
			const values = completionOptions[name as keyof typeof completionOptions].values
			const optionsArr = values.map((value, idx) => {
				return {
					_id: idx.toString(),
					value,
					data: {
						_id: idx.toString(),
						value,
					},
				}
			})
			setOptions(optionsArr)
		}
	}, [])

	useEffect(() => {
		if (selectedOption.value) setValue(selectedOption.value)
	}, [selectedOption])

	const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const inputVal = event.target.value
		updateStore(inputVal)
		setValue(inputVal)
		handleChange()
	}

	const checkInputType = (inputType: string) => {
		return type === inputType
	}

	const parseUnit = (value: string) => {
		/**
		 * remove  unit 'px', '%' from input type 'number'
		 * because number type inputs can only take numbers in their value
		 */
		if (checkInputType("number")) return removeUnitFromValue(value)

		return value
	}

	const handleSelectItem = (item: Option) => {
		updateStore(item.value)
		setSelectedOption(options.filter((option) => option._id === item._id)[0])
		handleChange()
	}

	const updateStore = (value: string | number) => {
		const valueWithUnit = checkInputType("number") ? `${value + unit}` : value
		if (selectedFeature ) {
			postCssChangesInRealTime(selectedFeature, name, valueWithUnit.toString())
			dispatch(
				updateFeatureSettings({
					_id: selectedFeature._id,
					key: name.toLowerCase(),
					value: valueWithUnit.toString(),
				})
			)
			if(selectedFeatureSettings)
			dispatch(
				createVersion({
					_id: selectedFeature._id,
					version: {
						...selectedFeatureSettings.css,
						[name.toLowerCase()]: valueWithUnit,
					},
				})
			)
		}
	}

	return (
		<div className={`input-label-container`}>
			<label className="input-label">{label}</label>
			<div
				className={`input-contianer ${checkInputType("color") && `-with-type-color`} ${
					checkInputType("text") && `-with-type-text`
				}`}
				onClick={() => setShowOptions(!showOptions)}
			>
				{checkInputType("color") && (
					<input className="input" type={type} value={value} onChange={onChange} />
				)}
				{checkInputType("number") && (
					<>
						<input className="input" type={type} value={value} onChange={onChange} />
						<div className="property-unit">
							<div className="css-unit-options">
								<select
									name="units"
									id="units"
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
										setUnit(e.target.value)
										updateStore(e.target.value)
									}}
								>
									{CSS_UNITS.map((cssUnit, idx) => (
										<option key={idx} value={cssUnit} selected={cssUnit === unit}>
											{cssUnit}
										</option>
									))}
								</select>
							</div>
						</div>
					</>
				)}
				{!!(checkInputType("text") && options.length) && (
					<>
						<List
							list={[...options]}
							activeItem={selectedOption._id ? selectedOption : {}}
							buttonPlaceholder="Select"
							// searchProps={["value"]}
							selectCallback={handleSelectItem}
						>
							{[...options].map((item) => {
								return (
									<ListItem key={item._id} data={item}>
										{item.value}
									</ListItem>
								)
							})}
						</List>
					</>
				)}
			</div>
		</div>
	)
}

export default InputWithLabel
