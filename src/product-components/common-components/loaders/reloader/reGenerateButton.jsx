import React from "react";
import { refresh } from "../../../../product-page-assets";
function ReGenerateButtons({
  visibility = false,
  isLoading = false,
  callBack,
}) {
  return (
    <>
      {isLoading ? (
        <div className="product__title-refresh">
          <div className="loader"></div>
        </div>
      ) : (
        (visibility || isLoading) && (
          <div className="product__title-refresh">
            <img src={refresh} alt="refresh-icon" onClick={callBack} />
          </div>
        )
      )}
    </>
  );
}

export default ReGenerateButtons;
