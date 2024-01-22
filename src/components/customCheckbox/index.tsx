import React, { useEffect, useState } from "react";
import "./index.sass";

interface props {
  checked?: boolean,
  handleChecked: ((e: React.ChangeEvent<HTMLInputElement>, val: string | undefined) => void) | undefined,
  name?: string,
  varient?: string
}

const CustomCheckbox = ({checked, handleChecked, name, varient='default'}:props) => {
  return (
    <div className="custom-checkbox-container">
      <input type="checkbox" className="custom-checkbox" data-varient={varient} checked={checked} name={name} onChange={(e) => {
          e.stopPropagation();
          if (handleChecked) {
            handleChecked(e, name);
          }
        }} />
      <div className="custom-checkbox-label"></div>
    </div>
  );
};

export default CustomCheckbox;