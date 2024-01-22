// @ts-nocheck
import React from "react";
import "./index.css";
export default function LoaderOverlay() {
  return (
    <div className="loading__screen__main__container">
      <div className="loading__screen__main__container-box">
        <div className="loading__screen-box--animation-div"></div>
        <div className="loading__screen-box--text">Loading...</div>
      </div>
    </div>
  );
}
