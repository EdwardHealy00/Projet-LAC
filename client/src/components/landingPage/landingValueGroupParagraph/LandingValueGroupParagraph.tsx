import React from "react";
import PropTypes from "prop-types";
import './LandingValueGroupParagraph.scss';

type LandingValueGroupParagraphProps = {
    content: String;
    title: String;
};

const LandingValueGroupParagraph = ({content, title}: LandingValueGroupParagraphProps) => {
    return <div className="value-group-paragraph-container">
        <span className="value-group-title">{title}</span>
        <hr className="value-group-separator"></hr>
        <p className="value-group-content">
            {content}
        </p>
    </div>;
}

LandingValueGroupParagraph.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default LandingValueGroupParagraph;
