import React,{ useEffect, useState } from "react";
import Pricing from "./pricing";
import { INTENTS } from "../../utils/constants";
import { createCheckoutSession } from "../../services/payments";
import { redirectToAuth, getCurrentUser } from "../../auth/utils";

interface Props{
	handleBackAction:()=>void
	annualPlans:Plan[]
	monthlyPlans:Plan[]
	monthlyPlanPrices:{
		[key:string]:number
	}
	productId:string
}

const Payments:React.FC<Props> = ({handleBackAction, annualPlans=[], monthlyPlans=[], monthlyPlanPrices, productId}) => {	

	const [user, setUser] = useState<any>({});
    const query = new URLSearchParams(window.location.search);

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		const user = await getCurrentUser();
		setUser(user);
	};

	async function handleBuyClick(priceId:string, quantity:string, productId:string) {
		let intent = INTENTS.checkout
		// let query = `priceId=${priceId}&quantity=${quantity}&intent=${intent}&productId=${productId}`
		// redirectToAuth(query)
		await checkoutSession(priceId, quantity, productId)
		// if (!user) {
		// 	redirectToAuth(`${CLIENT_BASE_URL}/cs/pricing?authenticated=true`);
		// 	return;
		// }

        // await checkoutSession(priceId, quantity)
	}

    async function checkoutSession(priceId:string, quantity:string, productId:string) {
        const customerEmail = user?.attributes?.email || '';
	
        const sessionUrl = await createCheckoutSession(customerEmail, priceId, quantity, productId)
        if(!sessionUrl) return;
        window.location.href = sessionUrl
    }

	return (
		<>
			<Pricing handleBuyClick={handleBuyClick} handleBackAction={handleBackAction} annualPlans={annualPlans} monthlyPlans={monthlyPlans} productId={productId} monthlyPlanPrices={monthlyPlanPrices} />
		</>
	);
}

export default Payments