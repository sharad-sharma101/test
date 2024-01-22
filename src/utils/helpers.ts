import { Version } from "../features/feature-versions/feature-version-slice"
import { Feature } from "../features/features-configurations/features-slice"
import {FEATURE_NAMES, PRODUCT_PAGE_USE_CASES, USE_CASE_DATA_VARIABLES ,REDIRECT_URL_KEY, CSS_UNITS, USECASE_ORDER, SEGMENT_ORDER} from "./constants"
const {
	VITE_PROXY_SERVER_BASE_URL:PROXY_SERVER_BASE_URL
} = import.meta.env
import { TRIGGER_EVENT } from "./constants"

const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/g
const percentageUnit = "%"

export const reloadAppBrowser = () => {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow) iframe.contentWindow.postMessage("reload", PROXY_SERVER_BASE_URL)
}

// found bugs in validation, retest this
export const validateDomain = (domain: string) => {
	const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(domain);
}

export const addProtocolToDomain = (domain: string) => {
	const httpOrHttpsRgx = /http(s)?:\/\//g
	const isHttpOrHttpsInDomain = httpOrHttpsRgx.test(domain)
	if (isHttpOrHttpsInDomain) return domain

	return `https://${domain}`
}

export const formatFeatureName = (featureName: string): string =>
	featureName
		.toLowerCase()
		.replaceAll("_", " ")
		.replaceAll("-", " ")
		.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
		.replace(" Vs ", " vs ")

export function convertStringToHml(html: string) {
	// wrap the ELEMNT around div
	const Element = document.createElement("div")
	// Set the HTML content with the given value
	Element.innerHTML = html
	return Element
}

export function getContentOfHtml(html: string) {
	// Create a new div element
	const htmlElement = convertStringToHml(html)
	return htmlElement.getElementsByClassName("personalization-use-case-content")[0].innerHTML
	// Retrieve the text property of the element
	// return tempDivElement.textContent || tempDivElement.innerText || "";
}

/**
 * refrence :- https://stackoverflow.com/questions/2664045/how-to-get-an-html-elements-style-values-in-javascript
 */

export function getStyle(html: string, styleProp: string) {
	// convertStringToHml wraps our current HTML to DIV
	const htmlElement = convertStringToHml(html).firstChild as HTMLElement
	if (!htmlElement) return ""
	const defaultView = document?.defaultView
	// W3C standard way:
	if (!(defaultView && defaultView.getComputedStyle)) return ""

	// sanitize property name to css notation
	// (hypen separated words eg. font-Size)
	const updatedStyleProp:any = styleProp.replace(/([A-Z])/g, "-$1")?.toLowerCase()

	return htmlElement.style[updatedStyleProp]
 }



export function removeUnitFromValue(value: string) {
	const unit = extractUnitFromValue(value)
	return value.toString().replace(unit, "") || value
}

export function extractUnitFromValue(value:string){
	return CSS_UNITS.filter((u:string)=> value.includes(u))[0] || ""
}

export function convertColorRGBToHex(color: string) {
	return RGBToHex(color)
}

function RGBToHex(rgb: string) {
	// Choose correct separator
	//let sep = rgb.indexOf(",") > -1 ? "," : " ";
	// Turn "rgb(r,g,b)" into [r,g,b]
	const parsedRGB: string[] = rgb.split(",")

	let r = (+parseInt(parsedRGB[0].replace("rgb(", ""))).toString(16),
		g = (+parseInt(parsedRGB[1])).toString(16),
		b = (+parseInt(parsedRGB[2])).toString(16)

	if (r.length == 1) r = "0" + r
	if (g.length == 1) g = "0" + g
	if (b.length == 1) b = "0" + b

	return "#" + r + g + b
}

export function extractFontsFromMessageEvent(callback: (event: MessageEvent<any>) => void) {
	messageEventHanlder(callback)
}

export function messageEventHanlder(callback: (event: MessageEvent<any>) => void) {
	window.addEventListener(
		"message",
		(event) => {
			try {
				if (event.data?.messageType) callback(event)
			} catch (error) {
				console.log(error)
			}
		},
		false
	)
}

export function enableElementSelector(message: {
	messageType?: string
	data: {
		feature: Feature | null,
		status?:string
	}
}) {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow) iframe.contentWindow.postMessage(message, PROXY_SERVER_BASE_URL)
}

export function disableElementSelector(message: {
	messageType?: string
	data: {
		feature: Feature | null
		xPath: string
	}
}) {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow) iframe.contentWindow.postMessage(message, PROXY_SERVER_BASE_URL)
}

// email validation
export function validateEmail(email: string) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	)
}

export function isProductPageFeature(featureName: string): boolean {
	return PRODUCT_PAGE_USE_CASES.includes(featureName)
}

export function postCssChangesInRealTime(
	selectedFeature: Feature,
	cssProperty: string,
	cssValue: string
) {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow)
		iframe.contentWindow.postMessage(
			{
				data: {
					_id: selectedFeature?._id,
					cssProperty,
					cssValue,
					featureName: selectedFeature.name,
				},
				messageType: "real-time-changes",
			},
			PROXY_SERVER_BASE_URL
		)
}

export function revertFeature(data: {
	feature: Feature
	meta?: { [key: string]: string }
	css: Version
}) {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow)
		iframe.contentWindow.postMessage(
			{
				data: data,
				messageType: "revert-feature",
			},
			PROXY_SERVER_BASE_URL
		)
}

export function updateContentOfFeature(data: {
	_id: string
	content: string
	meta?: { [key: string]: string },
	productData:ProductInfo
}) {
	const iframe = document.getElementById("app-browser-frame") as HTMLIFrameElement
	if (iframe?.contentWindow)
		iframe.contentWindow.postMessage(
			{
				data: data,
				messageType: "update-feature-content",
			},
			PROXY_SERVER_BASE_URL
		)
}

export function objectKeys(object: { [key: string | number]: string }): string[] {
	return Object.keys(object)
}

export function formatFeatureContent(
	content: string,
	value: number | string,
	unit?: string
): string {
	if (
		(content.includes(USE_CASE_DATA_VARIABLES[FEATURE_NAMES.firstTimeVsRepeatUser][0]) ||
			content.includes(USE_CASE_DATA_VARIABLES[FEATURE_NAMES.freeShipping][0])) &&
		value
	) {
		return content.replace(/\${(.*?)}/g, concatenateUnitInWithMetaField(value, unit || ""))
	}
	return content
}

export function containsSpecialChars(str: string = ""): {
	test: boolean
	match: string
} {
	const test = specialChars.test(str)
	const match = str.match(specialChars)
	if (!match?.length) return { test, match: "" }

	return { test, match: match[0] }
}

export function concatenateUnitInWithMetaField(name: number | string, unit: string): string {
	// const match = unit.match(specialChars)
	// if (!match?.length) return name.toString()

	if (unit === percentageUnit) return `${name}${unit}`

	return `${unit}${name}`
}


export const getCookieByName = (name: any) => {
	var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
	if (match) return match[2]
}

export function getProductIdFromHtml(html:string):string{
	const productIdIdentifier = `var meta = {"product":{"id":`
	let idxOfProdId = html?.indexOf(productIdIdentifier) + 28
	if(idxOfProdId > 28){
		const productId = html.slice(idxOfProdId)?.split(",")
	if(productId.length) return productId[0]
	}
	return ""
}

export function capitalizeFirstLetter(s = "") {
	return s.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export const nFormatter = (val = "") => {
	if (val === "" || val === undefined) return "N/A";
	if (parseInt(val) < 1000) return val;
	return val?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function convertToUTC(dateString: string): string {
	const localDate = new Date(dateString);
	const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
	return utcDate.toISOString();
  }

export function extractCompanyNameFromDomain(domain:string) {
	// Remove www. if present
	domain = domain.replace(/^www\./i, '');
  
	// Extract the company name using regex
	const regex = /^(?:[^.]+\.)?([^.\s]+)\.(?:[a-z]{2,}|co\.[a-z]{2})$/i;
	const matches = domain.match(regex);
  
	if (matches && matches.length > 1) {
	  return matches[1];
	}
  
	// Return null if no match found
	return "";
  }

export function checkStatusOfTriggerArray(triggerArray : any){
	
    let updatedState = true ;

	[...triggerArray]?.map((ele:any) => {
        ele.map((e:any)=>{
          if(e.data.event.event === '') {
              updatedState = false
          } else if(e.data.event.event === TRIGGER_EVENT.load || e.data.event.event ===TRIGGER_EVENT.mouseout){
              if(e.data.expression.variable === '')  updatedState = false
          } else if( e.data.event.event === TRIGGER_EVENT.mouseover || e.data.event.event ===TRIGGER_EVENT.click ){
              if(e.data.expression.variable === '' || e.data.expression?.operator === '' || e.data.event?.target?.element === '')
                  updatedState = false;
          } else if(e.data.event.event === TRIGGER_EVENT.time_on_site || e.data.event.event ===TRIGGER_EVENT.User_Inactive_for || e.data.event.event ===TRIGGER_EVENT.time_of_visit || e.data.event.event ===TRIGGER_EVENT.scroll ) {
              if(e.data.expression.variable === '' || e.data.expression?.operator === '' || e.data.expression?.value?.max === '')
              updatedState = false
          }
        })
    }) 

	return updatedState
}

export function parseStringToHtml(htmlString: string){
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html')
    return doc
}

export function convertDomToString(domObject: Document) {
	if(domObject) {
	const serializer = new XMLSerializer();
	const htmlString = serializer.serializeToString(domObject);
	return htmlString;
	}
  }

export function transformData(originalData: any[], startDate: string, endDate: string): any[] {
	  const start = new Date(startDate);
	  const end = new Date(endDate);
	  const groupedData = new Map<string, number>();
	  const dateIndexMap = new Map<string, number>();
	
	  // Initialize dates from start to end with 0 impressions
	  const currentDate = new Date(start);
	  let index = 0;
	  while (currentDate <= end) {
		const dateStr = currentDate.toISOString().split('T')[0];
		groupedData.set(dateStr, 0);
		dateIndexMap.set(dateStr, index);
		currentDate.setDate(currentDate.getDate() + 1);
		index++;
	  }
	
	  // Group and sum impressions from the original data
	  for (const item of originalData) {
		const dateStr = item.original_timestamp.split('T')[0];
		const impressions = 1;
	
		if (groupedData.has(dateStr)) {
		  groupedData.set(dateStr, groupedData.get(dateStr)! + impressions);
		}
	  }
	
	  // Convert the grouped data into an array of objects with index as x
	  const transformedData: any[] = Array.from(groupedData, ([date, impressions]) => ({
		x: dateIndexMap.get(date)!,
		y: impressions,
	  }));
	  //const newArray = transformedData.map((obj: any , index: number) => {return {obj.x = index+1}})
	  return transformedData;
}

export function convertConvertData (impressionData: any[] , ClickData: any[] , startDate: string , endDate: string) {
    let conversionData: { x: number; y: number }[] = []
	impressionData.map((ele: any , index: number) => {	
		const newEntry = {
			x: index+1 , 
			y: (ClickData[index].y / (ele.y=== 0 ? 1 : ele.y )) * 100
		}
		conversionData.push(newEntry)
	})
	return conversionData;
}
  export const getTimeInMinutes = (timeInSeconds:number) => {
	try {
		const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	const milliseconds = Math.round((timeInSeconds - Math.floor(timeInSeconds)) * 1000);
	return `${minutes}m ${seconds}s`;
	} catch (error) {
		return `-`
	}
  };
  export const convertTimeToUtcZone = (time: string) => {
	try {
	  const localTime = new Date(time);
	  const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
	  };
	  const localTimeString = localTime.toLocaleString(undefined, options);
  
	  const parts = localTimeString.split(', ');
	  const date = parts[0].split(" ");//date[1] is date date[0] is month parts 
	  const year = parts[1];
	  const timeString = parts[2]; // Include time zone in the result
	  const fullTimeString=date[1]+" "+date[0]+" "+year+", "+timeString
  
	  return [date, year, timeString,fullTimeString];
	} catch (error) {
	  return ['-', '-', '-',"-"];
	}
  };



  // function to formate session events data

export const groupEventsBySession=(events:any) =>{

	const groupedEvents:any = {};
  
   
  
	// Iterate through each event and group them by context_session_id
  
	for (const event of events) {
  
	  const sessionId = event.context_session_id;
  
	  let eventTitle = event?.event_text;


  
   
  
	  const newEvent = {
  
		title: eventTitle,
  
		id: event?.id,
		event,
  
		time: event?.original_timestamp,
		properties:{
  
		  eventproperties:[] }
  
	  }
  
   
  
	  if (!groupedEvents[sessionId]) {
  
		// Initialize the group if it doesn't exist
  
		groupedEvents[sessionId] = {
  
		  sessionId: sessionId,
  
		  Date: event.original_timestamp,
  
		  startTime: event.original_timestamp,
  
		  endTime: event.original_timestamp,
  
		  duration: 0,
  
		  properties:[],
  
		  events: [newEvent],
  
		};
  
	  } else {
  
		// Update the group with the latest date and add the event
  
		const group = groupedEvents[sessionId];
  
		group.startTime = event.original_timestamp;
  
		group.events.push(newEvent);
  
	  }
  
	}
  
   
  
	// Calculate the duration for each group
  
	for (const sessionId in groupedEvents) {
  
	  const group = groupedEvents[sessionId];
  
	  const startDate:Date = new Date(group.startTime);
  
	  const lastDate:Date = new Date(group.endTime);
  
	  group.duration = (lastDate.getTime() - startDate.getTime()) / 1000; // in seconds
  
	}
  
   
  
	// Convert the grouped events into an array
  
	const result = Object.values(groupedEvents);
  
   
  
	return result;
  
  }


  export  const  capitalizeFirstLetterText=(input: string):string=> {
	if (!input)  return ''      
	return input.charAt(0).toUpperCase() + input.slice(1);
  }

  export function giveDateAndTimeOfLast30Day () {
	// Create a new Date object for today
	const today = new Date();

	// Subtract 30 days from the current date
	const pastDate = new Date(today);
	pastDate.setDate(today.getDate() - 30);

	// Function to zero-pad single-digit numbers
	const zeroPad = (num: any) => (num < 10 ? '0' : '') + num;

	// Format the date and time
	const year = pastDate.getFullYear();
	const month = zeroPad(pastDate.getMonth() + 1); // Months are zero-based, so add 1
	const day = zeroPad(pastDate.getDate());
	const hours = zeroPad(pastDate.getHours());
	const minutes = zeroPad(pastDate.getMinutes());
	const seconds = zeroPad(pastDate.getSeconds());

	const formattedDate = `${year}-${month}-${day}`;
	const formattedTime = `${hours}:${minutes}:${seconds}`;

    return [formattedDate , formattedTime]
  }

  export function calculateAverageOrderValue (orders: any[] , startDate: string , endDate: string) {
	const start = new Date(startDate);
	  const end = new Date(endDate);
	  const groupedData = new Map<string, number>();
	  const dateIndexMap = new Map<string, number>();
	  let totalAmount = 0;
	  // Initialize dates from start to end with 0 impressions
	  const currentDate = new Date(start);
	  let index = 0;
	  while (currentDate <= end) {
		const dateStr = currentDate.toISOString().split('T')[0];
		groupedData.set(dateStr, 0);
		dateIndexMap.set(dateStr, index);
		currentDate.setDate(currentDate.getDate() + 1);
		index++;
	  }
	
	  // Group and sum impressions from the original data
	  let currency = ""
	  for (const item of orders) {
		const dateStr = item.order_date.split('T')[0];
		const str = item['Average Order Value'];
		currency  = str.split(' ')[0]
		const impressions = parseFloat(str.split(' ')[1]);
		totalAmount += impressions
	
		if (groupedData.has(dateStr)) {
		  groupedData.set(dateStr, groupedData.get(dateStr)! + impressions);
		}
	  }
	
	  // Convert the grouped data into an array of objects with index as x
	  const transformedData: any[] = Array.from(groupedData, ([date, impressions]) => ({
		x: dateIndexMap.get(date)!,
		y: impressions,
	  }));
	  let averageOrderValue  = 0
	  if(transformedData.length > 0)
	        averageOrderValue = totalAmount / transformedData.length
	  //const newArray = transformedData.map((obj: any , index: number) => {return {obj.x = index+1}})
	  return [transformedData , averageOrderValue.toFixed(2) , currency ];
  }





  export const getTransformedLocationData=(items:any)=>{
	let myObj:any={}
	let arr=[]
	const unknownObj= {sessionId:"Unknown",events:[]}
	let arrOfLocation:any=[]
	for(let el of items){

		let location=el.ip_location_city_name+", "+el.ip_location_country_name
		if(el.ip_location_city_name==null){
			location="Unknown"  
		}
		if(myObj[location]===undefined){
			myObj[location]=1
			arrOfLocation.push({sessionId:location,events:[]})
		} 

	}
		for(let el of arrOfLocation){
			for(let device of items){

				let location=device.ip_location_city_name+", "+device.ip_location_country_name

			
				if(device.ip_location_city_name==null){
					location="Unknown"  
				}
				let currentDevice=""
				if(device?.device&&device?.os){
					currentDevice=`${device?.device+", "+device?.os}`
				}else if(device?.device){
					currentDevice=device.device||"Unknown"
				}else{
					currentDevice="Unknown"
				}
			
				if(el.sessionId===location){
					el.events.push({id:Math.random()*2323232,title:currentDevice,time:device?.time,data:[{title:"Browser",value:device?.browser_name||"-"},{title:"Confidence Score",value:device?.round||"-"},{title:"Screen Height",value:device?.context_screen_height?device?.context_screen_height+" "+"Px":"-"},{title:"Screen Width",value:device?.context_screen_width?device?.context_screen_width+" "+"Px":"-"}
					,{title:"Device OS",value:device?.os||"-"}]})
				  
				}else{
				
				}
	
			}
		}
		let finalUpdated=[]
        for(let i=0;i<=arrOfLocation.length-1;i++){
                finalUpdated.push({...arrOfLocation[i],events:arrOfLocation[i].events.reverse()})
        }
        return finalUpdated
}

export function formatCurrency(currency: number | string ) {
	try{
			if(!currency || typeof(currency) != 'string' || !(currency.includes(" "))) return "-"
			const currencyArray = currency.split(" ")
			if(currencyArray[1]){
			const currencySymbol  = currencyArray[0]
			const amount = Number(currencyArray[1])
			if (amount === 0) return "-";
			
			const roundedAmount = Number(amount).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return `${currencySymbol} ${roundedAmount}`;}
		else {
			return "-"
		}
	} catch (err) {
		return "-"
	}
}

export function formatNumber(num: number | string , isDecimal: boolean = true ) {
	try {
		let amount = Number(num);
		if ( !amount || amount === 0 ) return "-";
		
	    if(isDecimal) {
			const roundedAmount = amount.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	        return roundedAmount;
		} else {
			const roundedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	        return roundedAmount;
		}
		
  } catch (err) {
	return "-"
  }
  }
  export function formatPercentage(str: string ) {
	try {
        let trimStr = str.replace("%" , " ")
		let amount = Number(trimStr)
		if ( !amount || amount === 0 || isNaN(amount)) return "-";
		const roundedAmount = amount.toFixed(1);
	    return `${roundedAmount}%`;		
  } catch (err) {
	return "-"
  }
  }
  export function getSegmentObject(selectedArray: any[] , id: string){
	let selectedObj;
	selectedArray.map((ele:any) => {
		if(id === ele?._id) selectedObj = ele;
	})
	return selectedObj
  }


  export function sortArrayByViewOrder(array:any) {

	const viewOrder = [USECASE_ORDER.banner, USECASE_ORDER.section, USECASE_ORDER.toaster, USECASE_ORDER.popup];

	array.sort((a: any, b: any) => viewOrder.indexOf(a?.viewStructure) - viewOrder.indexOf(b?.viewStructure));

	return array;

}

export function sortArrayByType(array:any) {

	const typeOrder = [SEGMENT_ORDER.visitors, SEGMENT_ORDER.users, SEGMENT_ORDER.customers, SEGMENT_ORDER.custom];

	array.sort((a: any, b: any) => typeOrder.indexOf(a?.type) - typeOrder.indexOf(b?.type));

	return array;

}