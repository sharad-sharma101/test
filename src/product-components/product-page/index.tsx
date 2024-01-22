// @ts-nocheck
import React, { useState, useEffect, useRef, useContext } from "react"

import Container from "./container"
import {ProductConfiguration} from "@attrybtech/attryb-ui"

import "./index.css"



import { httpClient } from "../../libs"

import ".././component-config.css"
import { nanoid } from "nanoid"

import AlertFeedback from "../common-components/alert-feedback/index"
import { useAppSelector } from "../../app/hooks"
import { AuthContext } from "../../auth/AuthContext"

import { formatFeatureName } from "../../utils/helpers"
import { PRODUCT_NAME, SHOPIFY_PRODUCT_IDENTIFIER } from "../../utils/constants"
const {
    VITE_AUTH_URL:AUTH_URL,
	VITE_CONTENT_STUDIO_API_URL:CONTENT_STUDIO_API_URL,
	VITE_PRODUCT_PAGE_BASE_URL:PRODUCT_PAGE_BASE_URL
} = import.meta.env

function ProductPage({
	setTemplateVisible,
	currentIframeUrl,
	isContentGenerated,
	isShopifyCreditialsAdded,
	showAccessTokenPopUp,
	setShowAccessTokenPopUp,
	initialBrandName,
	productId
}) {
	const { user } = useContext(AuthContext)

	const BackEndApiClient = httpClient


	const [productName, setProductName] = useState("New Apple AirPods Pro with MagSafe Charging Case")


	let [isFormOpen, setIsFormOpen] = useState(true)

	let [productTitle, setProductTitle] = useState(productName)
	let [productBrief, setProductBrief] = useState(
		"EMI starts at ₹1,125. No Cost EMI available EMI options 10-day replacement only"
	)

	let [aboutProduct, setAboutProduct] =
		useState(`Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.
Compatible with iPad (6th, 7th and 8th generation),iPad Air (3rd generation), iPad Pro 12.9-inch (1st and 2nd generation), iPad Pro 10.5-inch, iPad Pro 9.7-inch, iPad mini (5th generation).
Apple Pencil (2nd generation) transforms into your favorite creative instrument, your paint brush, your charcoal or your pencil.
Adaptive EQ automatically tunes music to the shape of your ear`)

	let [productDescription, setProductDescription] = useState(
		"AirPods Pro have been designed to deliver Active Noise Cancellation for immersive sound, Transparency mode so you can hear your surroundings and a customizables fit for all-day comfort. Just like AirPods, AirPods Pro connect magically to your Apple devices. And they’re ready to use straight out of the case. Incredibly light, noise-cancelling headphones, AirPods Pro block out your environment so you can focus on what you՚re listening to. AirPods Pro use two microphones, an outward-facing microphone and an inward-facing microphone, to create superior noise cancellation. By continuously adapting to the geometry of your ear and the fit of the ear tips, Active Noise Cancellation silences the world to keep you fully tuned in to your music, podcasts and calls. Switch to Transparency mode and AirPods Pro let the outside sound in, allowing you to hear and connect to your surroundings. Outward- and inward-facing microphones enable AirPods Pro to undo the sound-isolating effect of the silicone tips so things sound and feel natural, like when you’re talking to people around you. And Conversation Boost makes it easier to hear people during face-to-face conversations in noisy environments by focusing your AirPods Pro on the person talking directly in front of you."
	)

	let [metaTitle, setMetaTitle] = useState("Buy New Apple AirPods Pro with MagSafe Charging Case")

	let [metaDescription, setMetaDescription] = useState(
		"AirPods Pro deliver Active Noise Cancellation, Transparency mode, and spatial audio - in a customizable fit. Available with free engraving"
	)
	// //Default specification

	//Default values for toggle
	const [toggleMap, setToggleMap] = useState({
		"Product Title": true,
		"Product Brief": true,
		"About Product": true,
		"Product Description": true,
		"FAQs": false,
		"Meta Title": true,
		"Meta Description": true,
	})



	let [publishButton, setPublishButton] = useState({ type: "disabled" })
	let [previewButton, setPreviewButton] = useState({ type: "disabled" })
	const [faqs, setFaqs] = useState([
		{
			_id: nanoid(),
			question: "Is this better than the sony wf1",
			answers: [
				{
					answer: `Have not used the Sony ones, but the airpods Pro are basically jack of everything. They are not the best in any category but they are amongst top 3 in all categories. Sony wf1000xm3 are bigger than the aipods pro size wise and may not be as much pocketable and airpods. Automatic connectivity is also better in airpods pro if you are using iPhone. If you are on Android and a little bit big size is not a concern go for the Sony ones. Also I think airpods pro are overpriced by a big margin.`,
				},
			],
		},
		{
			_id: nanoid(),
			question: "Can you charge AirPods with MagSafe case?",
			answers: [
				{
					answer: `MagSafe chargers can also charge AirPods and other iPhone models that support wireless charging. (MagSafe chargers, battery packs, cases, and sleeves are sold separately.)`,
				},
			],
		},
	])

	const [showAlertFeedback, setShowAlertFeedback] = useState({
		message: "",
		show: false,
		type: "alert-feedback--success",
	})
	const [titleLoader, setTitleLoader] = useState(false)
	const [briefLoader, setBriefLoader] = useState(false)
	const [aboutLoader, setAboutLoader] = useState(false)
	const [pDescriptionLoader, setPDescriptionLoader] = useState(false)
	const [metaTitleLoader, setMetaTitleLoader] = useState(false)
	const [metaDescLoader, setMetaDesLoader] = useState(false)
	const [faqsLoader, setFaqsLoader] = useState(false)
	const [brandName, setBrandName] = useState(initialBrandName)
	const [titleVisible, setTitleVisible] = useState(false)
	const [briefVisible, setBriefVisible] = useState(false)
	const [aboutVisible, setAboutVisible] = useState(false)
	const [pDescriptionVisible, setPDescriptionVisible] = useState(false)
	const [faqsVisible, setFaqsVisible] = useState(false)
	const [metaTitleVisible, setMetaTitleVisible] = useState(false)
	const [metaDescVisible, setMetaDesVisible] = useState(false)
	const [mediaSrc, setMediaSrc] = useState([])
	const [previewUrl, setPreviewUrl] = useState(null)

	const { shopName, accessToken } = useAppSelector((state) => state.customerConfigs)

	const [isFormCollapse, setIsFormCollapse] = useState(false)
    const [categoryActiveItem, setCategoryActiveItem] = useState({})
    const [productTypeActiveItem, setProductTypeActiveItem] = useState({})
	const [productActiveItem, setProductActiveItem] = useState({})
    const [categoryData, setCategoryData] = useState([])
    const [productTypeData, setProductTypeData] = useState([])
	const [productsData, setProductsData] = useState([])
    const [switchButtonConfig, setSwitchButtonConfig] = useState([
        {
            label: "Product Title",
            value: true,
        },
        {
            label: "Product Brief",
            value: true,
        },
        {
            label: "About Product",
            value: true,
        },
        {
            label: "Product Description",
            value: true,
        },
        {
            label: "FAQS",
            value: false,
        },
        {
            label: "Meta Title",
            value: true,
        },
        {
            label: "Meta Description",
            value: true,
        },
    ])

    const [specifications, setSpecifications] = useState([
        {
            _id: "00-d32cf6e6-83e8-535c-afd3-797c510da793",
            label: "Brand Name",
            value: brandName,
        }
    ])
    const [generateButtonState, setGenerateButtonState] = useState("disabled")

    const fetchProductCategory = async() =>{
		let response = await BackEndApiClient.get(
			`${CONTENT_STUDIO_API_URL}/api/v1/product/product-category`,{})

        setCategoryData(response.data.data)
    }
	useEffect(() => {
        fetchProductCategory()
    }, [])



	useEffect(() => {
		if (isShopifyCreditialsAdded) {
			setPublishButton({ type: "default" })
		}
	}, [isShopifyCreditialsAdded])


	 // Updating brand name
	 useEffect(() => {
        const brandSpecification = specifications.find(
            (item) => item.label === "Brand Name",
        )
        const brandName = brandSpecification?.value
        if (brandName) setBrandName(brandName)
    }, [specifications])


	const checkRestrictions = () => {
		return true
	}




	const specificationFormatter = () => {
	  return specifications?.map((item) => {
	    return {
			name: item.label,
	        value: item.value,
	    }
	  });
	};



	const productTitleApi = async () => {
		try {
			if (!toggleMap["Product Title"] || !checkRestrictions(true)) return
			setTitleLoader(true)
			setTitleVisible(true)
			const formattedSpecification =  specificationFormatter()
			formattedSpecification.push({name: "Name", value: productName})

			let payload = {specifications:formattedSpecification }
			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/product-title`,
				{},
				payload
			)

			if (productTitleCharacterLimit(response.data.data[0]))
				showAlertBasedType("generateTitleLimit")
			setProductTitle(response.data.data[0])
			setTitleLoader(false)
			return response
		} catch (error) {
			console.log(error)
			setTitleLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}

	const productBriefApi = async () => {
		try {
			if (!toggleMap["Product Brief"] || !checkRestrictions(true)) return
			setBriefLoader(true)
			setBriefVisible(true)
			const formattedSpecification =  specificationFormatter()
			formattedSpecification.push({name: "Name", value: productName})
			let payload = {specifications:formattedSpecification }
			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/product-brief`,
				{},
				payload
			)

			setProductBrief(response?.data?.data[0])
			setBriefLoader(false)
		} catch (error) {
			console.log(error)
			setBriefLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}

	const aboutProductApi = async () => {
		try {
			if (!toggleMap["About Product"] || !checkRestrictions(true)) return
			setAboutLoader(true)
			setAboutVisible(true)
			const formattedSpecification =  specificationFormatter()
			formattedSpecification.push({name: "Name", value: productName})

			let payload = {specifications:formattedSpecification }
			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/about-product`,
				{},
				payload
			)
			const convertToText = response.data.data.join("\r\n")
			setAboutProduct(convertToText)

			setAboutLoader(false)
		} catch (error) {
			setAboutLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}
	const productDescriptionApi = async () => {
		try {
			if (!toggleMap["Product Description"] || !checkRestrictions(true)) return
			setPDescriptionLoader(true)
			setPDescriptionVisible(true)
			const formattedSpecification =  specificationFormatter()
			formattedSpecification.push({name: "Name", value: productName})

			let payload = {specifications:formattedSpecification ,productName: productName}

			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/product-description`,
				{},
				payload
			)

			setProductDescription(response.data.data[0])
			setPDescriptionLoader(false)
		} catch (error) {
			console.log(error)
			setPDescriptionLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}
	const faqFormatter = (tempFaq) => {
		return tempFaq.map((item) => {
			item.answers[0]["isDisplay"] = true
			return {
				question: item.question,
				answers: item.answers,
				_id: nanoid(),
			}
		})
	}

	const faqApi = async () => {
		try {
			if (!toggleMap["FAQs"] || !checkRestrictions(true)) return
			setFaqsLoader(true)
			setFaqsVisible(true)

			let payload = {}
			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/api/product-faqs`,
				{},
				payload
			)
			setFaqs(faqFormatter(response.data.data))
			setFaqsLoader(false)
		} catch (error) {
			console.log(error)
			setFaqsLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}
	const metaTitleApi = async () => {
		try {
			if (!toggleMap["Meta Title"] || !checkRestrictions(true)) return
			setMetaTitleLoader(true)
			setMetaTitleVisible(true)

			let brand = specifications.filter((item) => item.label === "Brand Name")
			let productMetaTitle = productName;
			if(brand[0]?.value) productMetaTitle = productMetaTitle + " | " + brand[0]?.value
			setTimeout(() => {
				setMetaTitleLoader(false)
				setMetaTitle(productMetaTitle)
			}, 1000)
		} catch (error) {
			console.log(error)
			setMetaTitleLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}

	const metaDescriptionApi = async () => {
		try {
			if (!toggleMap["Meta Description"] || !checkRestrictions(true)) return
			setMetaDesLoader(true)
			setMetaDesVisible(true)
			const formattedSpecification =  specificationFormatter()
			formattedSpecification.push({name: "Name", value: productName})
			let payload = {specifications:formattedSpecification }
			let response = await BackEndApiClient.post(
				`${PRODUCT_PAGE_BASE_URL}/meta-description`,
				{},
				payload
			)
			setMetaDescription(response.data.data[0])

			setMetaDesLoader(false)
		} catch (error) {
			console.log(error)
			setMetaDesLoader(false)
			showAlertBasedType("somethingWentWrong")
		}
	}


	// // Onclick on generate button
	const onClickGenerateButton = async () => {
		try {
			if (!specifications.length) return showAlertBasedType("emptySpecification")
			let isSpecificationEmpty = false
			for (let item of specifications) {
				if (
					!item?.name?.length ||
					!item?.value?.length ||
					item?.name === "New Specification"
				) {
					isSpecificationEmpty = true
					break
				}
			}

			setPublishButton({ type: "disabled" })

			setGenerateButtonState("loading")
			if (!checkRestrictions()) {
				setTimeout(() => {
					return setGenerateButtonState("default")
				}, 1000)
			} else {
				productTitleApi()
				productBriefApi()
				aboutProductApi()
				productDescriptionApi()
				metaTitleApi()
				metaDescriptionApi()
			}
		} catch (error) {
			console.log(error)
			setGenerateButtonState("disabled")
			showAlertBasedType("contentGenerateFail")
		}
	}


	// // show alert message based on case
	const showAlertBasedType = (type:string) => {
		let successFeedback = "alert-feedback--success"
		let dangerFeedBack = "alert-feedback--danger"
		let warningFeedBack = "alert-feedback--warning"
		let message
		let feedback
		switch (type) {
			case "generateTitleLimit":
				message = "Warning! Title Character Limit exceeds the maximum of 250."
				feedback = warningFeedBack
				break
			case "publishTitleCharacterLimit":
				message =
					"Error! Product Page failed to publish. Reduce the title length to 250 or less."
				feedback = dangerFeedBack
				break
			case "somethingWentWrong":
				message = "Oops! Something went wrong, please try again."
				feedback = dangerFeedBack
				break
			case "publishMessage":
				message = "Success! Your Product Page is successfully published"
				feedback = successFeedback
				break
			case "publishFail":
				message = "Error! Product Page failed to publish. Try again."
				feedback = dangerFeedBack
				break
			case "contentGenerated":
				message = "Success! Your Product Page content is successfully generated"
				feedback = successFeedback
				break
			case "contentGenerateFail":
				message = "Error! One of the sections failed to generate content."
				feedback = dangerFeedBack
			case "emptySpecification":
				message =
					"Error! Specifications of the product are missing. Add specifications to generate content."
				feedback = dangerFeedBack
				break

			case "lowerPlanExpiringSoon":
				message = "Info! Your Plan is expiring soon. Renew or upgrade the plan today."
				feedback = warningFeedBack
				break
			case "higherPlanExpiringSoon":
				message = "Info! Your Plan is expiring soon. Renew the plan today."
				feedback = warningFeedBack
				break
			case "planExpiry":
				message = "Info! Your Plan has expired. Renew the plan today!"
				feedback = warningFeedBack
				break
			//Plan Expiry
		}
		// return preparingAlert(message, feedback)
	}

	const productTitleCharacterLimit = (string) => {
		return false
	}

	// creating payload based on configuration toggle is true or false.
	const generatePayload = (payload = {}) => {
		payload["vendor"] = brandName
		return payload
	}

	// // Responsible to publish content on shopify.
	const publishContent = async () => {
		try {
			if (accessToken && user) {
				if (publishButton.type === "disabled") return
				const payload = generatePayload()
				if (!Object.keys(payload).length) return
				if (productTitleCharacterLimit(productTitle))
					return showAlertBasedType("publishTitleCharacterLimit")
				setPublishButton({ type: "loading" })
				let { faqs } = payload
				let updateFaq = faqs?.map((item, index) => {
					let answer = item.answers.filter((item) => {
						if (item.isDisplay) return item
					})
					if (answer.length) {
						return { question: item.question, answer: answer[0].answer }
					}
				})
				payload.faqs = updateFaq
				payload.shop = shopName
				payload.accessToken = accessToken
				await httpClient.post(
					`${PRODUCT_PAGE_BASE_URL}/api/publish-content`,
					{},
					{ payload, productId }
				)

				showAlertBasedType("publishMessage")
				setPublishButton({ type: "disabled" })
			} else if (user && !accessToken) {
				setShowAccessTokenPopUp(true)
			} else if (!user && !accessToken) {
				window.location.href = `${AUTH_URL}/?product=${PRODUCT_NAME.toLowerCase()}`
			}
		} catch (error) {
			console.log(error)
			setPublishButton({ type: "default" })
			showAlertBasedType("publishFail")
		}
	}

	// // Update faqs array.
	const updateFaqs = (newItem) => {
		let tempFaqs = [...faqs]
		tempFaqs.filter((parentItem, index) => {
			if (parentItem._id === newItem._id) {
				parentItem.answers.map((item, index) => {
					if (index === newItem.currentIndex) {
						item.answer = newItem.answer
						item.isDisplay = true
					} else {
						parentItem.answers[index].isDisplay = false
					}
				})
			}
		})
		setFaqs(tempFaqs)
	}

	const ref = useRef(null)
	const [feedbackStyle, setFeedbackStyle] = useState({})

	// close left form if width is 912
	useEffect(() => {
		let widthOfContainer = ref.current.offsetWidth
		if (widthOfContainer <= 912 && isFormOpen) setIsFormOpen(false)

		//feedback style
		var element = document.getElementById("main_container")
		var position = element?.getBoundingClientRect()
		var letPosition = position?.left
		let addStyle = { left: `${letPosition}px` }
		setFeedbackStyle(addStyle)
	}, [])


	useEffect(() => {
		if (currentIframeUrl && currentIframeUrl.includes(SHOPIFY_PRODUCT_IDENTIFIER)) {
			const productNameFromUrl = formatFeatureName(currentIframeUrl.split(SHOPIFY_PRODUCT_IDENTIFIER)[1])
			setProductName(productNameFromUrl)
			setProductTitle(productNameFromUrl)
		}
	}, [currentIframeUrl])

    const onSelectCategory = async (selectItem:{value:string,_id:string,data:{}}) => {
        const {value,_id,data} = selectItem

        setCategoryActiveItem({_id,value,data,})
		const response:any = await BackEndApiClient.get(`${CONTENT_STUDIO_API_URL}/api/v1/product/product-type/?category=${value}`,{})
        setProductTypeActiveItem({})
        setProductTypeData(response.data.data)
    }
    const onSelectProductType = async(selectItem:{value:string,_id:string,data:{}}) => {
		const {_id,value,data} = selectItem

		const response:any = await BackEndApiClient.get(`${CONTENT_STUDIO_API_URL}/api/v1/product/products/?productType=${value}`,{})
		setProductActiveItem({})
		setProductsData(response.data.data)
        setProductTypeActiveItem({_id,value,data})
    }
	const onSelectProduct = async(selectItem:{value:string,_id:string,data:{}})=>{
		const {_id,value,data} = selectItem
		setProductActiveItem({_id,value,data})
		const response:any = await BackEndApiClient.get(`${CONTENT_STUDIO_API_URL}/api/v1/product/specifications/?_id=${_id}`,{})

		const responseSpec = response.data.data
		const brandSpecification = specifications.filter((item)=>item.label ==="Brand Name")

		const mergedSpecification = [...brandSpecification,...responseSpec]
		const updateSpecification =  mergedSpecification.map((item) => ({...item,_id: nanoid()}))
		setSpecifications(updateSpecification)

	}


    const checkDropDownState = (activeItem:{}, dropDownData:[]) => {
        if (!Object.keys(activeItem).length && !dropDownData.length)
            return "hidden"
        if (!Object.keys(activeItem).length) return "disabled"

        return "default"
    }


	//	Base on condition we are updating state.
	const updateGenerateButtonState = ():void =>{
		if (
			productName &&
			Object.keys(categoryActiveItem).length &&
			Object.keys(productTypeActiveItem).length &&
			Object.keys(productActiveItem).length
			){
				if (generateButtonState !== "loading" && generateButtonState!== "default") {
					setGenerateButtonState("default")
				}
				else if (
					!titleLoader &&
					!briefLoader &&
					!aboutLoader &&
					!pDescriptionLoader &&
					!metaTitleLoader &&
					!metaDescLoader
				) {
					setGenerateButtonState("default")
				}
			}
			else {
				setGenerateButtonState("disabled")
			}
	}

	useEffect(()=>{
		updateGenerateButtonState()
	},[
		productName,
		categoryActiveItem,
		productTypeActiveItem,
		productActiveItem,
		titleLoader ,
		briefLoader ,
		aboutLoader ,
		pDescriptionLoader ,
		metaTitleLoader ,
		metaDescLoader
		])

    const dropDownConfig = [
        {
            _id: "45689900",
            label: "Product Category",
            buttonPlaceholder: "Select category",
            searchProps: ["value"],
            activeItem: categoryActiveItem,
            selectCallback: onSelectCategory,
            data: categoryData,
            level: 1,
            state: "default",
        },
        {
            _id: "456892900",
            label: "Product Type",
            buttonPlaceholder: "Select Product type",
            searchProps: ["value"],
            activeItem: productTypeActiveItem,
            data: productTypeData,
            selectCallback: onSelectProductType,
            level: 2,
            state: checkDropDownState(categoryActiveItem, productTypeData),
        },
		{
            _id: "456892900",
            label: "Product",
            buttonPlaceholder: "Select Product",
            searchProps: ["value"],
            activeItem: productActiveItem,
            data: productsData,
            selectCallback:onSelectProduct,
            level: 2,
            state: checkDropDownState(productTypeActiveItem, productsData),
        },
    ]

    const productFormatter = (dropDownConfig) => {
        const data = dropDownConfig.data ?? []
        return data.map((item) => {
            return {
                _id: item._id,
                value: item.value,
                data: dropDownConfig,
            }
        })
    }
    const createNewSpecification = () => {
        const addNewSpecification = [
            ...specifications,
            {
                _id: nanoid(),
                label: "New Specification",
                value: "Enter specification value",
            },
        ]
        setSpecifications(addNewSpecification)
    }
    const updateSpecification = (updatedSpecification) => {
        const { _id } = updatedSpecification;
        setSpecifications(
            specifications.map((item) => {
                if (item._id === _id) {
                    return updatedSpecification
                }
                return item
            })
        )
    }

    const removeSpecification = (removeSpecification) => {
        const { _id } = removeSpecification
        specifications.find((item, index) => {
            if (item._id === _id) {
                specifications.splice(index, 1)
            }
        })
        setSpecifications(specifications)
    }
	const onClickSwitchToggle = (item,index) =>{
        const tempSwitchButtonConfig = [
            ...switchButtonConfig,
        ]
        tempSwitchButtonConfig[index] = {...item,value:!item.value}
        setSwitchButtonConfig(tempSwitchButtonConfig)
    }
	return (
		<React.Fragment>
				<div className="flex__container" ref={ref}>

					{showAlertFeedback.show ? (
						<AlertFeedback
							style={feedbackStyle}
							type={showAlertFeedback.type}
							alertFeedbackText={showAlertFeedback.message}
							suffix={true}
							setShowAlertFeedback={setShowAlertFeedback}
						/>
					) : null}
					  <ProductConfiguration
							productName={productName}
							setProductName={setProductName}
							switchButtonConfig={switchButtonConfig}
							specifications={specifications}
							setSpecifications={setSpecifications}
							updateSpecification={updateSpecification}
							createNewSpecification={createNewSpecification}
							removeSpecification={removeSpecification}
							dropDownConfig={dropDownConfig}
							productFormatter={productFormatter}
							isFormCollapse={isFormCollapse}
							setIsFormCollapse={setIsFormCollapse}
							onClickGenerateButton={onClickGenerateButton}
							generateButtonState={generateButtonState}
							onClickSwitchToggle={onClickSwitchToggle}

						/>
					<Container
						switchButtonConfig={switchButtonConfig}
						isContentGenerated={isContentGenerated}
						isFormOpen={isFormOpen}
						setIsFormOpen={setIsFormOpen}
						toggleMap={toggleMap}
						setMetaTitle={setMetaTitle}
						setMetaDescription={setMetaDescription}
						updateFaqs={updateFaqs}
						productTitle={productTitle}
						setProductTitle={setProductTitle}
						productTitleApi={productTitleApi}
						productBrief={productBrief}
						setProductBrief={setProductBrief}
						productBriefApi={productBriefApi}
						aboutProduct={aboutProduct}
						setAboutProduct={setAboutProduct}
						aboutProductApi={aboutProductApi}
						productDescription={productDescription}
						setProductDescription={setProductDescription}
						productDescriptionApi={productDescriptionApi}
						faqs={faqs}
						faqApi={faqApi}
						metaTitle={metaTitle}
						metaTitleApi={metaTitleApi}
						metaDescription={metaDescription}
						metaDescriptionApi={metaDescriptionApi}
						titleLoader={titleLoader}
						setTitleLoader={setTitleLoader}
						briefLoader={briefLoader}
						setBriefLoader={setBriefLoader}
						aboutLoader={aboutLoader}
						setAboutLoader={setAboutLoader}
						pDescriptionLoader={pDescriptionLoader}
						setPDescriptionLoader={setPDescriptionLoader}
						faqsLoader={faqsLoader}
						setFaqsLoader={setFaqsLoader}
						metaTitleLoader={metaTitleLoader}
						setMetaTitleLoader={setMetaTitle}
						metaDescLoader={metaDescLoader}
						setMetaDesLoader={setMetaDesLoader}
						brandName={brandName}
						titleVisible={titleVisible}
						setTitleVisible={setTitleVisible}
						briefVisible={briefVisible}
						setBriefVisible={setBriefVisible}
						aboutVisible={aboutVisible}
						setAboutVisible={setAboutVisible}
						pDescriptionVisible={pDescriptionVisible}
						setPDescriptionVisible={setPDescriptionVisible}
						faqsVisible={faqsVisible}
						setFaqsVisible={setFaqsVisible}
						metaTitleVisible={metaTitleVisible}
						setMetaTitleVisible={setMetaTitleVisible}
						metaDescVisible={metaDescVisible}
						setMetaDesVisible={setMetaDesVisible}
						mediaSrc={mediaSrc}
						publishButtonCallback={publishContent}
						//need to remove
						publishButton={publishButton}
						previewUrl={previewUrl}
						previewButtonType={previewButton.type}

						setTemplateVisible={setTemplateVisible}
						showAccessTokenPopUp={showAccessTokenPopUp}
						setShowAccessTokenPopUp={setShowAccessTokenPopUp}
						isShopifyCreditialsAdded={isShopifyCreditialsAdded}
						productName={productName}
					/>
				</div>

		</React.Fragment>
	)
}

export default ProductPage