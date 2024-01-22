// @ts-nocheck
import React from "react";
// import { greenClose, removeIcon } from "../../../assets/index";

import "./index.css";
const AlertFeedback = ({
  type,
  setShowAlertFeedback,
  prefix,
  suffix,
  btnLabel,
  alertFeedbackText,
  style,
}) => {
  const iconsType = {
    "alert-feedback--success": "greenClose",
    "alert-feedback--danger": "removeIcon",
    "alert-feedback--warning": "",
  };
  return (
    <>
      <div
        className={`alert-feedback ${type} ${
          !!btnLabel ? "alert-feedback--action-min-h" : ""
        }`}
        style={style}
      >
        <div className="alert-feedback__left">
          {prefix && <div className="alert-feedback__prefix">{prefix}</div>}

          {alertFeedbackText && (
            <div className="alert-feedback__text">{alertFeedbackText}</div>
          )}
        </div>
        <div className="alert-feedback__right">
          {suffix && (
            <div className="alert-feedback__suffix">
              <img
                src={iconsType[type]}
                onClick={() => {
                  setShowAlertFeedback({ show: false });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default AlertFeedback;
