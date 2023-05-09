import React from "react";
import './CircleIcon.scss';

interface CircleIconProps {
    color: string;
    href: string;
}

const CircleIcon = ({ color, href }: CircleIconProps) => {
    return (
        <div className="circle-icon" style={{ backgroundColor: color, color: "white" }}>
            <img src={href} alt="icon" />
        </div>
    );
}

export default CircleIcon;
