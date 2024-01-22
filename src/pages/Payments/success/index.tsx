import "./index.sass"
import {useEffect , useState} from "react"
import { Button } from '@attrybtech/attryb-ui'
import thankYouImage from "../../../assets/images/thank-you.svg"
import { useNavigate } from "react-router-dom"
import Footer from "../../../components/footer";

export default function PaymentSuccess() {
  const delay = 5000; 
  const [count, setCount] = useState(delay/1000);
  const navigate = useNavigate();
   
  useEffect(() => {

      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
  
      if(count === 0){
      clearInterval(intervalId);
      navigate('/getting-started'); }
  
      return () => {
        clearInterval(intervalId);
      };
  }, [count , navigate])

  return (
    <>
    <div className="payment-thank-you-wrapper confirm-product-integration-connnect">
    <div className="payment-thank-you-container">
      <div className="payment-page-body">
        <div className="payment-page-header">
          <div className="payment-image-wrapper">
            <img src={thankYouImage} alt=""  />
          </div>
          <div className="heading-wrapper">
              <h1 className="main-heading display-xxl--b">Thank You!</h1>    
              <h3 className="body-sub-heading display-xs">You will be redirected in {count} seconds</h3>
          </div>
          {/* <h3 className="payment-body-footer text-md--md">You will be redirect to dashboard shortly or click here to go to dashboard</h3> */}
        </div>
      </div>
      <div>
      <Button style={{width:"11.43rem",height:"3.25rem", textAlign:"center",justifyContent:"center", backgroundColor: "var(--color-primary-standard)", borderColor:"var(--color-primary-standard)"}} onClick={() => navigate('/getting-started') } >
          Go To Dashboard
      </Button>
      </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
