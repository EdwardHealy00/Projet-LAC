import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import "./approval/Approval.scss";

interface OverflowTooltipProps {
  children: NonNullable<React.ReactNode>;
}

const OverflowTooltip: React.FC<OverflowTooltipProps> = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textElementRef && textElementRef.current) {
      setIsOverflowing(
        textElementRef.current.scrollHeight >
          textElementRef.current.clientHeight ||
          textElementRef.current.scrollWidth >
            textElementRef.current.clientWidth
      );
    }
  }, []);

  return (
    <Tooltip
      title={children}
      disableHoverListener={!isOverflowing}
      placement="top"
      arrow
    >
      <div className="title-field" ref={textElementRef}>
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
