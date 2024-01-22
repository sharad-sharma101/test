// @ts-nocheck
import React from "react";
import "./blankState.css";
export default function ProductPageBlankState({
  styles,
  placeholder,
  paraStyles,
}) {
  return (
    <div style={styles} className="blank__container">
      <p style={paraStyles} className="blank__state-text">
        {" "}
        {placeholder}{" "}
      </p>
    </div>
  );
}
