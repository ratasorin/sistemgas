import React, { useEffect } from "react";
import EmbedSvg, { useSvg } from "lib/embed-svg";
import { rotateElementAroundAnchorPoint } from "lib/rotate-svg";

const EMPLOYEE_SVG_ID = "employee-svg";

const Animation = () => {
  const svg = useSvg(EMPLOYEE_SVG_ID);

  useEffect(() => {
    if (svg) {
      rotateElementAroundAnchorPoint("hand", [-15, 15, -15], false);
      rotateElementAroundAnchorPoint("forearm", [0, 18, 0], false);
      rotateElementAroundAnchorPoint("right_arm", [0, 12, 0], true);
    }
  }, [svg]);

  return (
    <EmbedSvg
      elementId={EMPLOYEE_SVG_ID}
      svgName="sistemgas-employee.svg"
    ></EmbedSvg>
  );
};

export default Animation;
