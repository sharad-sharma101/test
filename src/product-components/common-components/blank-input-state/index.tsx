// @ts-nocheck
import React from "react";
import "./index.css";
export default function BlankInputState({ callBack, styles }) {
  return (
    <div
      className="blank-input"
      style={styles}
      onClick={() => {
        callBack(true);
      }}
    >
      <img src="https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_edit-writing-content-editing-512.png" />
      <div className="blank-input__text">
        Nothing to show yet. Click the regenerate icon or hit ‘Generate Content’
        to show the content.
      </div>
    </div>
  );
}
