import DarkLoaderButtonIcon from '../../../../public/attryb-ui/assets/icons/loader/button-loader-dark.svg'
import LightLoaderButtonIcon from '../../../../public/attryb-ui/assets/icons/loader/button-loader-light.svg'
import React from 'react';
import "./index.sass";

type Props = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: string;
  isLoading?: boolean;
};

const AppButton = ({ label, onClick, variant = "primary-solid", isLoading=false }: Props) => {

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      onClick(event);
    }
  };

  const getLoaderSVG = () => {
    if (variant === "primary-solid") {
      return (
        <div className='app-button__loader'>
            <img src={LightLoaderButtonIcon} alt="Loading" />
        </div>
      );
    } else {
      return (
        <div className='app-button__loader'>
            <img src={DarkLoaderButtonIcon} alt="Loading" />
        </div>
      );
    }
  };

  const getLabelLoad = () => {
    return (
      <div className='app-button__loader'>
        {label}
      </div>
    )
  }

  return (
    <button className={`app-button text-sm--sb ${variant} ${isLoading ? 'btn-loading' : ''}`} onClick={handleClick}>
      {isLoading ? getLoaderSVG() : getLabelLoad()}
    </button>
  );
};

export default AppButton;
