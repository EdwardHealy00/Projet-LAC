import React, {CSSProperties} from "react";
import "./ColoredTag.scss";

type ColoredTagProps = {
    tag: String;
    backgroundColor: CSSProperties['backgroundColor'];
}

const ColoredTag = ({tag, backgroundColor}: ColoredTagProps) => {
    return <div className="colored-tag-container">
        <div className="over-square">
            <span>{tag}</span>
        </div>
        <div style={{backgroundColor}} className="under-square">
            <span>{tag}</span>
        </div>
    </div>
}

export default ColoredTag;
