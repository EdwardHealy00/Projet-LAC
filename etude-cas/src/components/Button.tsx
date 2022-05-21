import React from "react";
import '../styles/LightButton.css';

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
    <button
      onClick={onClick}
      className={styleName}
    >
    {children}
    </button>
  );
}

export default Button;