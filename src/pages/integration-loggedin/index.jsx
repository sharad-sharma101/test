import React from "react";

const IntegrationLoggedin = () => {
  return (
    <div classname="wrapper">
      <div classname="container py-4 text-center">


        <img
          src="https://cdn-app.optimonk.com/img/monk-hi-user.7c96daaa.svg"
          classname="waving-img mx-auto"
        />

        <div classname="welcome-title mb-2">
          <span>Hi cavaja!</span>
        </div>

        <div classname="welcome-intro">
          <span>Do you want to connect your store with this account?</span>
        </div>

        <div classname="connect-box mx-auto font-size-1 mt-6 d-flex align-items-center">
          <div classname="d-flex mb-6">
            <div classname="connect-platform-box ml-auto">
              <img
                src="https://cdn-app.optimonk.com/img/shopify.80135510.svg"
                classname="mx-auto"
                style="height: 3.75rem"
              />
              <div classname="mt-4 mx-2 font-weight-500">
                72c7e4.myshopify.com
              </div>
            </div>
            <img
              src="https://cdn-app.optimonk.com/img/arrow-horizontal-swap.24a25afb.svg"
              classname="mx-auto"
            />
            <div classname="connect-platform-box mr-auto">
              <img
                src="https://cdn-app.optimonk.com/img/logo-mini.bae7e039.svg"
                classname="mx-auto"
                style="height: 3.75rem"
              />
              <div classname="mt-4 mx-2">
                <span classname="d-block font-weight-500">hamehac 509</span>
                <span classname="d-block account-email">
                  cavaja5222@favilu.com
                </span>
              </div>
            </div>
          </div>
          <div classname="d-flex align-content-center justify-content-center mb-6">
            <button
              data-v-55893723=""
              type="button"
              tag="button"
              classname="btn btn-primary design-system"
            >
              <span
                data-v-55893723=""
                classname="d-inline-flex justify-content-center align-items-center"
              >
                Connect
              </span>
            </button>
          </div>
          <div classname="connect-another d-flex justify-content-center">
            <span classname="cursor-pointer brand-link-underline">
              I would like to connect with another OptiMonk account
            </span>
          </div>
        </div>


        
      </div>
    </div>
  );
};

export default IntegrationLoggedin;
