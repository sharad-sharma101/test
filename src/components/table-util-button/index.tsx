// @ts-nocheck
import React, { useState, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";
import "./index.sass";

interface DropdownItem {
  _id: number;
  value: string;
  callbackfunction: (event: React.MouseEvent<HTMLButtonElement>, row_id: string, rowItem: any) => void;
}

interface Props {
  variant: string;
  rowItem?: any;
  dropdownItems?: DropdownItem[];
  openDropdownRowId: number | null;
  handleDropdown: (
    event: React.MouseEvent<HTMLButtonElement>,
    rowItem: any
  ) => void;
}

const TableUtilBtn = ({ variant, rowItem, dropdownItems, openDropdownRowId, handleDropdown }: Props) => {
  const [isBelowHalf, setIsBelowHalf] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const onButtonClickHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const buttonTop = buttonRect.top;

      setIsBelowHalf(buttonTop > 0.65 * screenHeight);
    }

  };

  const handleOptionClick = (
    callback: (event: React.MouseEvent<HTMLButtonElement>, row_id: string, rowItem: any) => void
  ) => {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      callback(event, rowItem?._id, rowItem);
    };
  };

  const ThreeDotsDropDown = () => (
    <img ref={buttonRef} src={"/attryb-ui/assets/icons/table/dots-vertical icon.svg"} alt="..." />
  );

  const Delete = () => (
    <img src={"/attryb-ui/assets/icons/table/trash-03 icon.svg"} alt="D" />
  );

  return (
    <div className="edit-util--wrapper">
      <div onClick={(event) => {
          onButtonClickHandler(event);
          handleDropdown(event, rowItem);
        }} className="table-util-btn--wrapper">
        <button className="util-btn" >
          {variant === "delete" ? <Delete /> : <ThreeDotsDropDown />}
        </button>
      </div>

      {openDropdownRowId === rowItem?._id && dropdownItems && dropdownItems.length > 0 && (
        <ClickAwayListener onClickAway={() => handleDropdown(new MouseEvent("click"), rowItem)}>
          <div className={`threedots-dropdown-container ${isBelowHalf ? 'upward' : 'downward'}`}>
            <div className="threedots-dropdown-options">
              <div className="threedots-dropdown-content">

                {dropdownItems.map((item) => (
                  <div
                    key={item._id}
                    className={"threedots-dropdown-option"} onClick={handleOptionClick(item.callbackfunction)}>
                    <p className="text-sm--md">{item.value}</p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default TableUtilBtn;
