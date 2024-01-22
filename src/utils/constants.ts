export const PRODUCT_PAGE_USE_CASES = ["Scarcity_Signals", "Location_Based_Widget", "Product_Recommendation"]
export const UNIVERSAL_USE_CASES = ["First_Time_vs_Repeat_User", "Free_Shipping"]

export const FEATURE_NAMES = {
	firstTimeVsRepeatUser: "First_Time_vs_Repeat_User",
	locationBasedWidget: "Location_Based_Widget",
	scarcitySignals: "Scarcity_Signals",
	freeShipping: "Free_Shipping",
}

export const USECASE_TYPES = {
	productPage:"product-page",
	universal:"universal",
	notApplicable:"not-applicable"
}

export const SIDEBAR_DATA = {
	"Onboarding":  "/getting-started",
	"Campaigns": "/my-campaigns",
    "Use Cases": "/use-cases",
    "Audiences": "",
	"Find Visitors": "/audiences/find-visitors",
	"Segments": "/segments/all",
  	"Template Library": "/template-library",
	"Pages": "#",
	"Brand Kit": "#",
	"Analytics": "#",
}

export const USE_CASE_DATA_VARIABLES = {
	[FEATURE_NAMES.firstTimeVsRepeatUser]:["${variable}"],
	[FEATURE_NAMES.locationBasedWidget]:["${location}","${users_count}"],
	[FEATURE_NAMES.scarcitySignals]:["${number_of_product_left_in_stock}"],
	[FEATURE_NAMES.freeShipping]:["${amount_left_to_get_free_shipping}"],
}

export const CLIENT_URL_BROWSER_STROAGE_KEY = "clientUrl"
export const CLIENT_EMAIL_KEY = "clientDemoEmail"

export const USER_BROWSER_STROAGE_KEY = "AttrybIdentity"

export const PRODUCT_NAME = "Personalization"
export const REDIRECT_URL_KEY = "redirect_uri"

export const PLATFORMS = {
	shopify:"SHOPIFY"
}

export const PROFILE_STATUS = {
	loading:"loading",
	signIn:"signIn",
	signOut: "signOut"
}
 
export const CSS_UNITS = ["px", "vw", "vh", "rem", "%", "em"]

export const SHOPIFY_PRODUCT_IDENTIFIER = "/products/"

export const CONFIGURATION_TYPES = {
	trigger:"triggers",
	placement:"placement",
	pages:"pages",
	schedule: "schedule",
	frequency: "frequency",
	display: "display",
	overlap: "overlap",
	discountObject:"discountObject",
}

export const INTENTS = {
    buy:"buy",
    checkout:"checkout"
}

export const BILLING_CYCLES ={
	monthly:"Monthly",
	yearly:"Yearly"
}

export const BILLING_CARD_ORDER = ["Starter", "Growth", "Pro"];

export const USER_ROLE ={
	Admin: "Admin",
	Editor: "Editor",
	Viewer: "Viewer",
	Designer: "Designer"
}

export const variantStatus={
	finish:"finish"
}

export let TRIGGER_DEFINATION = {
	"type": "Event" ,
	"device": "desktopAndMobile", 
	"data":{

		"expression":{
			"variable": "" ,
			"operator": ""  ,
			"value":{ 
			"max": "",
			"min": ""
			},
			"type":""
	},

		"event":{
		"event": "" ,
		"target":{
			"type":"",
			"element":"",
		},
	}
}  
}  

export const TRIGGER_EVENT = {
	load : 'load' ,
	mouseout: "mouseout",
	mouseover: "mouseover",
	click: "click",
	time_on_site: "time_on_site",
	User_Inactive_for: "user_inactive",
	time_of_visit: "time_of_visit",
	scroll: "scroll"
}
export const DELAY_TYPE =  {
	show: "show",
	delay:"delay"
}
export const FREQUENCY_OPTIONS = {
	none:"none",
	frequencyCount:"frequencyCount"
}

export const OVERLAP_INSTRUCTION = [
	{
		heading : "Show in Sequence after a Countdown Period",
		subheading: [
			"This option ensures that a widget makes its appearance on the screen, provided there aren't other floating widgets being displayed at that time.",
			"If another floating widget is being shown, this particular widget gets displayed after a Cooldown Period once the previous widget has been closed."
		],
		gifLink: "cooldown",
		selected: 'QUEUE'
	},
	{
		heading : "Don’t show during current session",
		subheading: [
			"The Use Case is displayed on the screen if no other floating Use Case is displayed at the same time.",
			"However, if another floating widget is on display or falls within the Cooldown Period, then this particular widget will not be shown during the ongoing browsing session."
		],
		gifLink: "no-show",
		selected: 'NOT_IN_CURRENT_SESSION'
	},
	{
		heading : "Show",
		subheading: ["No matter what, this widget will appear, regardless of other floating widgets being shown on the screen at the same time (Not Advisable)"],
		gifLink: "show",
		selected: 'FORCE_OVERLAP'
	}
]
export const OVERLAP_VARIABLE = {
	show : "FORCE_OVERLAP" , 
	queue : "QUEUE",
	NotInCurrentSession : "NOT_IN_CURRENT_SESSION"
}
export const AUDIENCE_VARIABLE = {
	allaudience : "allaudience" , 
	visitors : "visitors",
	customers : "customers",
	users : "users",
}
export const USER_PROFILE_VIEW = {
	summery : "summery" , 
	eventActivity : "event-activity",
	metaData : "meta-data",
	landingPages : "landing-pages",
	products : "products"
}

export const PROPERTY_DROPDOWN = [
	{_id:1,data:["type"],value:"Type",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:2,data:["no_of_session"],value:"Sessions",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:3,data:["last_seen"],value:"Last Seen",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:4,data:["order_count"],value:"Number of Orders",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:5,data:["total_spent"],value:"Order Value",item:{
		type:"list",
		name:"Value_Dropdown"
	}},

	{_id:6,data:["total_products_added"],value:"Products Added",item:{
		type:"list",
		name:"Value_Dropdown"
	}},

	,{id:88,data:["total_products_viewed"],value:"Produts Viewed",item:{
		type:"list",
		name:"Value_Dropdown"
	}},

	{_id:7,data:["ip_location_city_name"],value:"City",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:8,data:["ip_location_country_name"],value:"Country",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:9,data:["browser_name"],value:"Browser",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:10,data:["device"],value:"Device",dropdowns:[]},

	{_id:10,data:["os"],value:"OS",item:{
		type:"list",
		name:"Operator_DropDown"
	}},

]

export const Value_Dropdown = [
	{_id:1,data:["total"],value:"Total",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
	{_id:2,data:["average"],value:"Average",item:{
		type:"list",
		name:"Operator_DropDown"
	}},
]

export const Operator_DropDown = [
	{_id:1,data:[">"],value:"Greater Than"},
	{_id:2,data:["="],value:"Equal To"},
	{_id:3,data:["<"],value:"Less Than"},
	{_id:3,data:["users"],value:"Users"},
	{_id:3,data:["users"],value:"Customer"},
	{_id:3,data:["users"],value:"Visitors"},
	{_id:3,data:["users"],value:"All"},
]


// [{
// 	property:"type",
// 	dropdown2:[{
		
// 		_id:13,
// 		value:""
// 		data:{}
// 	}],
// 	typeOfInput:{typeOf:"number",  }
// }
// ]


export const FiltersDropDown=[
	//type
	{
		_id:1,
		value:"Type",
		text1:"IS",
		type:"string",
		data:{
			property:"type",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"input",
		
			data:[
			{
				_id:234,
				value:"All",
				data:{
					property:"all"
				}
			},
			{
				_id:2,
				value:"Anonymous Visitors",
				data:{
					property:"visitor"
				}
			},
			{
				_id:1,
				value:"Users",
				data:{
					property:"user"
				}
			},
			{
				_id:3,
				value:"Customer",
				data:{
					property:"customer"
				}
			},
			] 
		},
		text2:"",
		input:"none"

	},
	// no_of_seesion
	{
		_id:2,
		value:"Number of Sessions",
		text1:"IS",
		type:"number",
		data:{
			property:"no_of_sessions",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"integer"

	},
	//last seen
	{
		_id:3,
		value:"Last Seen",
		text1:"IS",
		type:"date",
		data:{
			property:"last_seen",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"dateInput"

	},
	//no of orders
	{
		_id:4,
		value:"No of Orders",
		text1:"IS",
		type:"number",
		data:{
			property:"order_count",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"integer"

	},
	//order value
	{
		_id:5,
		value:"Order Value",
		text1:"IS",
		type:"number",
		data:{
			property:"orders",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"value",
		
			data:[{
				_id:1,
				value:"Total",
				data:{
					property:"total"
				}
			},
			{
				_id:2,
				value:"Average",
				data:{
					property:"average"
				}
			},] 
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		dropDown4:{
			type:"single",
			placeholder:"Select",
			variant:"",

			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"currency",
		input:"integer"

	},
	//product added
	{
		_id:109561176,
		value:"Products Viewed",
		text1:"IS",
		type:"number",
		data:{
			property:"total_products_viewed",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"value",
		
			data:[{
				_id:1,
				value:"Total",
				data:{
					property:"total"
				}
			},
			{
				_id:2,
				value:"Average",
				data:{
					property:"average"
				}
			},] 
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"integer"

	},
	//product viewed
	{
		
		_id:6,
		value:"Products Added",
		text1:"IS",
		type:"number",
		data:{
			property:"total_products_added",
		},
		dropDown2:{
			type:"single",
			placeholder:"Select",
			variant:"value",
		
			data:[{
				_id:1,
				value:"Total",
				data:{
					property:"total"
				}
			},
			{
				_id:2,
				value:"Average",
				data:{
					property:"average"
				}
			},] 
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"operator",
		
			data:[{
				_id:1,
				value:"Greater Than",
				data:{
					property:">"
				}
			},
			{
				_id:2,
				value:"Less Than",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Equal To",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"integer"

	},
	//city
	{
		_id:1061176,
		value:"City",
		text1:"IS",
		type:"string",
		data:{
			property:"cities",
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"input",
		
			data:[{
				_id:1,
				value:"India",
				data:{
					property:"user"
				}
			},
			{
				_id:2,
				value:"Us",
				data:{
					property:"visitor"
				}
			},
			{
				_id:3,
				value:"Uk",
				data:{
					property:"customer"
				}
			},
			{
				_id:4,
				value:"China",
				data:{
					property:"all"
				}
			}] 
		},
		text2:"",
		input:"none"

	},
	//country
	{
		_id:60,
		value:"Country",
		text1:"IS",
		type:"string",
		data:{
			property:"country",
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"value",
		
			data:[{
				_id:1,
				value:"India",
				data:{
					property:"india"
				}
			},
			{
				_id:2,
				value:"US",
				data:{
					property:"us"
				}
			},] 
		},
		text2:"",
		input:"none"

	},
	//browser
	{
		_id:7,
		value:"Browser",
		text1:"IS",
		type:"string",
		data:{
			property:"browser_name",
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"input",
		
			data:[{
				_id:1,
				value:"Google Chrome",
				data:{
					property:""
				}
			},
			{
				_id:2,
				value:"Safari",
				data:{
					property:"<"
				}
			},
			{
				_id:3,
				value:"Brave",
				data:{
					property:"="
				}
			},] 
		},
		text2:"",
		input:"none"

	},
	//device
	{
		_id:8,
		value:"Device",
		text1:"IS",
		type:"string",
		data:{
			property:"device",
		},
		dropDown3:{
			type:"single",
			placeholder:"Select",
			variant:"input",
		
			data:[{
				_id:1,
				value:"Laptop",
				data:{
					property:"total"
				}
			},
			{
				_id:2,
				value:"Tablet",
				data:{
					property:"average"
				}
			},] 
		},
		text2:"",
		input:"none"

	},
	//os
	{
		_id:9,
		value:"OS",
		text1:"IS",
		type:"string",
		data:{
			property:"os",
		},
		dropDown3:{
			type:"multi",
			placeholder:"Select",
			variant:"input",

		
			data:[{
				_id:1,
				value:"Android",
				data:{
					_id:1,
					property:"android"
				}
			},
			{
				_id:2,
				value:"Mac",
				data:{
					_id:1,
					property:"<"
				}
			},
			{
				_id:3,
				value:"Windows",
				data:{
					_id:1,
					property:"="
				}
			},] 
		},
		text2:"",
		input:"none"

	},
	
	

]

export const SEGMENT_ORDER = {
	visitors : "visitors",
	users : "users",
	customers : "customers",
	custom : "custom"
}
export const USECASE_ORDER = {
	banner : "banner",
	section : "section",
	toaster : "toaster",
	popup : "popup",
}