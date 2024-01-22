import {useState} from 'react'
import { useParams } from "react-router-dom";
import QuantityInput from "../quantity-input";
//import parse from 'html-react-parser';
import "./index.sass";
import ContentWrapper from '../../content-wrapper';
import attrybLogo from "../../../assets/images/attryb-logo-small-active.svg"
import checkedIcon from "../../../assets/images/check-icon-2.svg";

import basicIcon from "../../../assets/images/flash.svg"
import growthIcon from "../../../assets/images/briefcase.svg"
import premiumIcon from "../../../assets/images/dimond.svg"
import { Button } from '@attrybtech/attryb-ui';
const PRICE_ID = "price_1NAaI7SJYhZ8gA2vdg6gkHYh"

interface Props {
	handleBuyClick: Function;
	plan: Plan;
	productId: string;
	index: number;
	discountedPrice?:{[key:string]:number}
}
export default function PricingCard({handleBuyClick, plan, productId , discountedPrice, index}:Props) {

	const [value, setValue] = useState(1);
	const [isLoading, setIsLoading] = useState(false)


	const checkedItem = [
		{
			text: <p className='text-md' >Up to <span className='text-md--sb'>250,000</span> Page Views</p>
		},
		{
			text: <p className='text-md'>Up to <span className='text-md--sb'>250,000</span> Page Views</p>
		},
		{
			text: <p className='text-md'>Up to <span className='text-md--sb'>250,000</span> Page Views</p>
		},
		{
			text: <p className='text-md'>Up to <span className='text-md--sb'>250,000</span> Page Views</p>
		},
		{
			text: <p className='text-md'>Access to All Use Cases</p>
		},
		{
			text: <p className='text-md'>Unlimited Custom Segments</p>
		},
	]

	function addCommasToNumber(num: number): string {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	  }

	function handleCardIcon (index : number) {
		if(index == 0 || index == 3)
		    return basicIcon 
		else if (index == 1 || index == 4) 
		    return growthIcon 
		else 
		    return premiumIcon
	}

	const handlePaymentClick = async () => {
		setIsLoading(true);
		await handleBuyClick(plan.stripePriceId, value, productId);

	  };

	return (
		// <div className="pricing-widget__header font-body">
		// 	<h4 className="pricing-widget__header__title weight-medium">{plan.planName}</h4>
		// 	<h1 id="Pro-bill" className="pricing-widget__header__price weight-bold">
		// 		${plan.subscriptionAmount}
		// 	</h1>
		// 	<p className="pricing-widget__header__info">
		// 		<span className="user_plan">/month/user</span>
		// 		&nbsp;&nbsp;
		// 		<span id="Pro-perMonth" className="user_bill">
		// 			billed monthly
		// 		</span>
		// 	</p>
		// 	<QuantityInput value={value} increment={increment} decrement={decrement} />
		// 	{/* <form action={`${BASE_URL}/create-checkout-session`} method="POST"> */}
		// 		{/* <input type="hidden" name="customerEmail" value="kireto4499@favilu.com" />
		// 		<input type="hidden" name="priceId" value="price_1NAaI7SJYhZ8gA2vdg6gkHYh" /> */}
		// 		<button
		// 			className="font-button weight-bold"
		// 			type="submit"
		// 			onClick={()=>handleBuyClick(plan.planId, value, productId)}
		// 		>
		// 			Buy Now
		// 		</button>
		// 	{/* </form> */}
		// </div>
		<ContentWrapper>
			<div className="pricing-card--container">
				<div className="pricing-card--header">
					<div className="pricing-card-icon--wrapper">
						<img src={handleCardIcon(index)} alt="" />
					</div>
					<div className="pricing-card-label">
						<p className='tex-xl--sb' >{plan.planName}</p>
					</div>
					<div className="pricing-perMonth">
						<p className='text-xl' >{discountedPrice ? `$${discountedPrice[plan.planName]}` : ''}</p>
					</div>
					<div className="pricing-card-price">
						<p className='display-lg--sb' >${Math.round(plan.subscriptionAmount)}<span className='text-md' >/month</span></p>
					</div>
					<div className="pricing-card-supporting-text">
						<p className='text-md' >{ plan.discountedPrice ? `$${addCommasToNumber(plan.discountedPrice)} Billed Annually` : ''}</p>
					</div>
				</div>
				<div className="pricing-card--content">
					{
						checkedItem.map((text) => (
							<div className='checked-item--wrapper'>
								<img src={checkedIcon} alt="" />
							    {text.text}
							</div>
						))
					}
				</div>
				<div className="pricing-card--footer">
					<div 
					>
					<Button style={{width:"100%",textAlign:"center",justifyContent:"center"}} size='lg' onClick={handlePaymentClick} state={isLoading&&"loading"}>
					Get started
					</Button>	
					</div>		

				</div>
			</div>
		</ContentWrapper>
	);
}
