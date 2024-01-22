import React from "react";
import './index.sass'

interface RadioButtonProps {
  value: string;
  label?: string;
  content?: string;
  checked?: boolean;
  // onlyInpurt
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ value, label, content, checked, onChange }) => {
  const uniqueId = `radio-${value}`;

  return (
    <div className="radio-container" key={value}>
      <label className="radio-container-row" htmlFor={uniqueId}>
        <div className="radio-input-circle-wrapper">
          <input
          id={uniqueId}
          className="radio-input-circle"
          type="radio"
          name="radio-options"
          value={value}
          checked={checked}
          onChange={onChange}
        />
        </div>
        <div className="radio-option-content">
          <div className="radio-option-label text-md--md">
            {label}
          </div>
          <div className="radio-option-description text-xs">
            {content}
          </div>
        </div>
      </label>
    </div>
  );
};

export default RadioButton;
