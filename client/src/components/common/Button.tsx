import React from "react";
import '../../styles/LightButton.scss';

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
  styleName:string;
}

const Button: React.FC<Props> = ({ 
    onClick, 
    children,
    styleName,
  }) => { 
  return (
    <button id="positionConnect"
      onClick={onClick}
      className={styleName}
    >
    {children}
    </button>
  );
}

export default Button;