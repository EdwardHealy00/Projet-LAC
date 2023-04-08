import React from "react";
import "../../fonts.scss";
import "./LandingButton.scss";
import PropTypes from "prop-types";

type LandingButtonProps = {
    text: String;
    onClick: () => void;
};

const LandingButton = ({text, onClick}: LandingButtonProps) => {
    return <div className="nav-container">
        <button onClick={onClick} className="hover-underline-animation">{text}</button>
    </div>;
}

LandingButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
export default LandingButton;
