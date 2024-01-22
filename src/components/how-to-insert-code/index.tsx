import React, { useState } from 'react'
import "./index.sass"


const InsertCode = () => {

    const [page, setpage] = useState("one")
  return (
    <div className='wrapper'>
      <div className="container">
        <h1 className='container-heading'>Insert Code</h1>

        <div className="how-to-insert-code">
            <div className="box-header">
                <div className={`option-code ${page === "one" ? "show" : ""} `} onClick={() => setpage("one")}>CUSTOM CODE</div>
                <div className={`option-code ${page === "two" ? "show" : ""} `}  onClick={() => setpage("two")}>SHOPIFY</div>
            </div>
            <div className="box-body">
                <div className={`paragraph ${page === "one" ? "show" : ""} `}>
                    <p>
                    To install attryb, you need to insert the attryb JavaScript code in the {`<head>`} section of each page of your website.
                    {/* {`<script type="text/javascript"
                    src="https://onsite.optimonk.com/script.js?account=201785"
                    async></script>`} */}
                    </p><p>
                    Do you feel intimidated by the thought of handling code?
                    </p>
                </div>
                <div className={`paragraph ${page === "two" ? "show" : ""} `}>  
                  <p>                
                    In order to display the campaigns you need to install the attryb plugin on your Shopify site.
                  </p><p>
                    You can find more details about the app on the following link: https://apps.shopify.com/optimonk
                  </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default InsertCode
