declare type Container = {
  settings: any;
	_id: string;
	accountId: string;
	userId?: string;
	isEnabled: boolean;
	domainName: string;
	containerName?: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

declare type EnableStatusResponse = {
	status: number;
	success: boolean;
	data: {
	  success: boolean;
	  message: string;
	  status: boolean;
	};
  };


interface ProductInfo{
	totalProductsSold:string
	location:string
	productsLeftInStock:string
}

declare type ProfileStatus = "loading" | "signIn" | "signOut"

interface Sidebar{
	children:React.ReactNode
	headerChild?:React.ReactNode
	aligned?:string
	navState?:string
	type?:string
}

interface ProgressStep{
	id: string
	body: string
	prefix: string
	suffix: string
}

interface ProgressSteps{
	steps:{
		id: string
		body: string
		prefix: string
		suffix: string
	}[]
	activeStep:ProgressStep
}

interface UseCase{
	_id: string
	name: string
	description: string
}

interface UseCaseCard{
    icon?:string,
    heading:string,
    para:string,
    active:boolean,
}

interface metric{
	label: string,
	value:string,
	_id: string,
	name: string
}

interface Template{
	_id: string;
	snapshot: string;
	name:string;
	script: ReactNode;
	viewStructure: string;
	css: ReactNode;
	html: string;
	reference?: string
	metrics: metric[],
	tags: [
		_id: string,
		label: string
	],
	isDynamic?: boolean
}
interface TemplatesView{
	userTemplates: Template[]
	masterTemplates: Template[]
	handleSelectTemplate: (id: string) => void
	selectedTemplateId: string
	handleEditClick: (template: Template) => void
	handlePreviwe: (template: Template) => void
	showMyTemplate?: Boolean
}

interface TemplateCard{
	template:Template
	active:boolean
	handleSelectTemplate: (id: string) => void
	handleEditClick: (template: Template) => void
	handlePreviwe: (template: Template) => void
}


interface Response {
	status: number,
	success: boolean,
	data: any,
	message: string|null,
	error: any,
}

interface PagesConfig {
	page:any
	handlePageChange:(page:any)=>void
	setPageChecked: any 
	isPageChecked: any
}

interface Trigger{
	trigger:any;
	setSelectedObject:any;
	label:string;
	activeItem: string
	readOnlyMode:boolean
}
interface AppHeader{
	children:any
}

interface Placement{
	placement: any, 
	handlePlacementSelection:any, 
	selectedPlacements:any, 
	idx: any
}

interface Plan {
	currency:  string
	planId: string
	planName: string
	productId: string
	stripePriceId: string
	subscriptionAmount: number
	billingCycle: string
	discountedPrice?: number
	orignalPrice?: any
}

interface Page {
	name: string
	page: string
	pattern: string
	type: string
	_id: string
	img: string
}

interface PagesState {
   [key: string] : boolean
}


interface PlacementPageProps{
	currentTemplate:Template
}

interface User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	customMessage: string;
	status: boolean;
	accountId: string;
	containerId: string;
	revoke: boolean
}
interface DatePicker {
  handleChangeEvent: (str: string) => void;
  defaultDate?: string;
  minimumDate?: string;
  addMinDate?: boolean;
}

interface EndDatePicker {
  handleChangeEvent: (str: string) => void;
  defaultDate?: string;
  minimumDate?: string;
  disableDate?: boolean;
  setDisableDate?: (val: boolean) => void;
}

interface SchedulePage {
  allSelectedTrigger: object[][];
  pagesData: object[];
  isPageSelected: object;
  triggersData: any;
}
  
interface  TextInput{
	placeholder?: string
	state?:string
	label?:string
	value: string | number
	error?: { message: string }
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	required?:boolean
}

interface ctaDataProps{
	route:string,
	title:string
}

interface iconVariantProfileBoxProps{
	img:string
}

interface badgesDataProps{
	_id:string,
	tag:string,
	type:boolean
}

interface EventPropertyProps{
	title:string,
	value:any,
	withLine?:boolean
}
interface ProfileInfoBoxProps{
	title:string,
	text:string|ReactNode,
	iconVariant?:iconVariantProfileBoxProps={
		img:string
	},
	badgesData?:badgesDataProps[]

}

interface SessionDataProps{
	lastSession:boolean,
	sessionId:string,
	duration:number,
	Date:string,
	currentSelectedEvent:any,
	events:any[],
	sendCurrentEvent:(e:any)=>void,
	accordian:boolean
}
interface SingleEventProps{
	selectedEvent:any,
	lastEvent:boolean,
	time:string,
	title;string,
	onClick:(e:any)=>void,_id:string,
	event:any,
	accordian:boolean,
	data:any
}

interface AccordionWrapperProps{
	title:string,
	children:React.ReactNode
}

interface SelectListItem {
    _id: string
    value: string
    data?: Record<string, unknown>
}