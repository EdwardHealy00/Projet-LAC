import React, {CSSProperties} from "react";
import "./ColoredTag.scss";

type ColoredTagProps = {
    tag: String;
    backgroundColor: CSSProperties['backgroundColor'];
}

const ColoredTag = ({tag, backgroundColor}: ColoredTagProps) => {
    return <div className="colored-tag-container">
        <div style={{backgroundColor}} className="over-square">
            <div>{tag}</div>
        </div>
        <div className="under-square">
            <div>{tag}</div>
        </div>
    </div>
}

export default ColoredTag;
