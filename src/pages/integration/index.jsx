import React from "react";
import "./index.css";
import { Button } from "@attrybtech/attryb-ui";

const Integration = () => {
  return (
    <div className="page-container-wrapper">
      <div className="thank-you-page">
        <div className="attryb-logo-image-wrapper">
          <img
            src="https://attryb.com/assets/attrybNavLog.svg"
            alt=""
            width="100%"
            height="100%"
          />
        </div>
        <div className="page-main-heading">Hi Personalization Dev!</div>
        <div className="page-paragraph">
          <p>Welcome to attryb</p>
          <p>
            If you already register earlier, then just login to your account. If
            not, create new one
          </p>
        </div>
        <div className="page-button-wrapper">
          <Button variant="subtle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A61FF"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-plus-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span className="button-text">Create new Attryb account</span>
          </Button>
          <Button variant="subtle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A61FF"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-key"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
            <span className="button-text">Login to my Attryb account</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Integration;
