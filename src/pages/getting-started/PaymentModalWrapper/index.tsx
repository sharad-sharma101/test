import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext }  from "../../../auth/AuthContext"


import {
  AlertPopup,
  AlertPopupHeader,
  AlertPopupBody,
  AlertPopupFooter,
  useModal,
  Button,
} from "@attrybtech/attryb-ui";






import "react-loading-skeleton/dist/skeleton.css";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { BILLING_CARD_ORDER, BILLING_CYCLES } from "../../../utils/constants";
import { getProductPlans } from "../../../services/payments";
import Payments from "../../../components/payments/payments";
import { setPaymentModalVisible } from "../../../features/globalConfigs/global-slice";

interface PaymentModalWrapperType{
    sendPlanStatus:(e:boolean)=>void
}

const { VITE_SHOPIFY_APP_URL: SHOPIFY_APP_URL, VITE_PRODUCT_ID: PRODUCT_ID } =
  import.meta.env;

const PaymentModalWrapper = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {paymentModalVisible}=useAppSelector((store:RootState)=>store.globalConfig)

  const [userId, setUserId] = useState();
  const [user, setUser] = useState<any>();
  const navigate = useNavigate();
  const { modalState, modalRef, exitModal, showModal } = useModal();
  const modalCancelHandler: () => void = () => {
    exitModal();
  };
  const dispatch=useAppDispatch()
  const authContext: any = useContext(AuthContext);
  const {containerObjectInRedux}=useAppSelector((store:RootState)=>store.coreUserFeatures)
 

  const [monthlyPlans, setMonthlyPlans] = useState<Plan[]>([]);
  const [annualPlans, setAnnualPlans] = useState<Plan[]>([]);
  const [monthlyPlanPrices, setMonthlyPlanPrices] = useState({});




  const fetchPlans = async () => {
    try {
      // fetch plans based on the product
      const plans = await getProductPlans(PRODUCT_ID);

      const updatedMonthlyPlanPrices: { [key: string]: number } = {};
      const monthlyPlans = [];
      const annualPlans = [];
      // segregation of annual and monthly plans
      for (const plan of plans) {
        if (plan.billingCycle === BILLING_CYCLES.monthly) {
          updatedMonthlyPlanPrices[plan.planName] = plan.subscriptionAmount;
          monthlyPlans.push(plan);
        } else if (plan.billingCycle === BILLING_CYCLES.yearly) {
          const updatedPlan = { ...plan };
          updatedPlan.subscriptionAmount = plan.subscriptionAmount / 12;
          updatedPlan.discountedPrice = plan.subscriptionAmount;
          annualPlans.push(updatedPlan);
        }
      }

      const sortedAnnualPlans = sortPlans(annualPlans);
      const sortedMonthlyPlans = sortPlans(monthlyPlans);

      setMonthlyPlans(sortedMonthlyPlans);
      setAnnualPlans(sortedAnnualPlans);
      setMonthlyPlanPrices(updatedMonthlyPlanPrices);

    } catch (error) {
      // handle errors
    }
  };

  const sortPlans = (plans: Plan[]): Plan[] => {
    return plans.sort((a: Plan, b: Plan) => {
      const aIndex = BILLING_CARD_ORDER.indexOf(a.planName);
      const bIndex = BILLING_CARD_ORDER.indexOf(b.planName);
      return aIndex - bIndex;
    });
  };

  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");



  const { isCustomerSubscribed } = authContext; // Access isCustomerSubscribed from AuthContext

  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    setIsPaid(isCustomerSubscribed);
  }, [isCustomerSubscribed]);

  useEffect(() => {
    if (authContext?.userId) {
      setUser(authContext?.user);
      setUserId(authContext?.userId);
        
      if (!monthlyPlans.length && !annualPlans.length){
        fetchPlans();
    
    } 

}

  }, [authContext.userId]);




  function tooglePaymentModal() {
    dispatch(setPaymentModalVisible(false));
  }




  return (
    <>
        {paymentModalVisible && (
            <Payments
              handleBackAction={tooglePaymentModal}
              annualPlans={annualPlans}
              monthlyPlans={monthlyPlans}
              productId={PRODUCT_ID}
              monthlyPlanPrices={monthlyPlanPrices}
            />
          )}
    </>
  );
};

export default PaymentModalWrapper;
