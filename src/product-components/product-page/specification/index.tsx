// import "./productSpecifications.css";
// @ts-nocheck
import "./index.scss";
import { useState, useEffect } from "react";
import editIcon from "../../../product-page-assets/edit-grey-4.svg";
import trashIcon from "../../../product-page-assets/trash_red.svg";
export const LabelInput = (props) => {
  const {
    specificationIndex,
    exitLabelEdit,
    name,
    updateSpecificationValue,
    fucusOut,
  } = { ...props };

  const syncValueInput = (e) => {
    let value = e.target.value;
    updateSpecificationValue(specificationIndex, e);
  };

  const keyPressHandler = (e) => {
    if (e.key !== "Enter") return;
    exitLabelEdit();
  };
  const handleFocus = (event) => event.target.select();
  return (
    <input
      className="LabelInput"
      type="text"
      name="name"
      value={name}
      onChange={syncValueInput}
      onKeyPress={keyPressHandler}
      autoFocus
      autoComplete="off"
      placeholder="New Specification"
      onKeyDown={fucusOut}
      onFocus={handleFocus}
    />
  );
};

const Specification = (props) => {
  const {
    id,
    index,
    name,
    value,
    allowLabelEdit,
    allowCardRemoval,
    componentActiveState,
    removeInputFields, // :fn
    updateSpecificationValue, // :fn
    resetCardsActiveStateExcept, // :fn
  } = {
    ...props,
  };

  const [labelActiveState, setLabelActiveState] = useState(false);

  const syncValueInput = (e, index) => {
    let text = e.target.value;
    updateSpecificationValue(index, e);
  };

  const editSpecificationLabel = () => {
    let flag = true;
    setLabelActiveState(flag);
  };

  const exitLabelEdit = () => {
    let flag = false;
    setLabelActiveState(flag);
  };

  const resetOtherCardsActiveState = (event) => {
    // event.preventDefault();
    exitLabelEdit();
    resetCardsActiveStateExcept(id);
  };

  const outFocus = (e) => {
    // e.preventDefault();
    if (e.keyCode === 27) {
      e.preventDefault();
      resetCardsActiveStateExcept();
      document.getElementById(e.target.id).blur();
    }
  };

  return (
    <div className="Specification" data-comp-active={componentActiveState}>
      <div className="spec-card">
        {/* Card is allowed to be removed and is in active state */}
        {/* Only then show trash icon */}
        {allowCardRemoval && componentActiveState && (
          <div
            className="spec-card__remove"
            onClick={(e) => {
              removeInputFields(e, id);
            }}
          >
            <img src={trashIcon} alt="background-pattern-right" />
          </div>
        )}
        <div className="row spec-card__label">
          {/* If name is being edited then show name in edit mode */}
          {/* else render name as text only */}
          {componentActiveState && labelActiveState ? (
            <LabelInput
              name={name}
              exitLabelEdit={exitLabelEdit}
              updateSpecificationValue={updateSpecificationValue}
              specificationIndex={index}
              fucusOut={outFocus}
            ></LabelInput>
          ) : (
            <span>{name}</span>
          )}

          {/* Label is allowed to be edited and name is not actively being edited right now */}
          {/* Only then show edit icon */}
          {allowLabelEdit && !labelActiveState && componentActiveState && (
            <div
              className="spec-card__label-edit"
              onClick={editSpecificationLabel}
            >
              <img src={editIcon} alt="edit icon" />
            </div>
          )}
        </div>
        <div className="row spec-card__value">
          <input
            className="spec-card__input"
            type="text"
            name="value"
            value={value}
            placeholder="Enter specification value"
            onChange={(event) => {
              syncValueInput(event, index);
            }}
            onFocus={resetOtherCardsActiveState}
            autoComplete="off"
            onKeyDown={outFocus}
            id={id}
            autoFocus={componentActiveState ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default Specification;
