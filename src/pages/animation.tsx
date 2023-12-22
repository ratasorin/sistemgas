import React, { useCallback, useEffect } from "react";

const Animation = () => {
  const getSVG = useCallback(async () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "sistemgas-employee.svg", false);
    // Following line is just to be on the safe side;
    // not needed if your server delivers SVG with correct MIME type
    xhr.overrideMimeType("image/svg+xml");
    const svg: Promise<HTMLElement | null> = new Promise((resolve) => {
      xhr.onload = () => {
        if (xhr.responseXML) resolve(xhr.responseXML.documentElement);
        else resolve(null);
      };
    });

    xhr.send("");

    return svg;
  }, []);
  useEffect(() => {
    if (document)
      getSVG().then((svg) => {
        if (!svg) return null;
        document.getElementById("employee-container")?.append(svg);
        const anchorPoint = document.getElementById("anchor_point");
        const anchorPointX = anchorPoint?.getAttribute("cx");
        const anchorPointY = anchorPoint?.getAttribute("cy");

        if (!anchorPointX || !anchorPointY) return;

        console.log({ anchorPointX, anchorPointY });

        /**
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 60 70"
                    to="360 60 70"
                    dur="10s"
                    repeatCount="indefinite" 
                />
        */
        const forearmAnimation = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animateTransform"
        );
        forearmAnimation.setAttributeNS(null, "attributeName", "transform");
        forearmAnimation.setAttributeNS(null, "attributeType", "XML");
        forearmAnimation.setAttributeNS(null, "type", "rotate");
        forearmAnimation.setAttributeNS(null, "calcMode", "spline");
        forearmAnimation.setAttributeNS(
          null,
          "values",
          // DO NOT ADD SPACES BETWEEN SEMICOLON AND NUMBER! SAFARI ISSUE: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/keyTimes
          `0 ${anchorPointX} ${anchorPointY}; 25 ${anchorPointX} ${anchorPointY}; 0 ${anchorPointX} ${anchorPointY}`
        );
        forearmAnimation.setAttributeNS(null, "keyTimes", "0; 0.5; 1");
        forearmAnimation.setAttributeNS(
          null,
          "keySplines",
          "0.5 0 0.5 1; 0.5 0 0.5 1"
        );
        forearmAnimation.setAttributeNS(null, "dur", "1.5s");
        forearmAnimation.setAttributeNS(null, "repeatCount", "indefinite");

        const forearm = document.getElementById("forearm");
        forearm?.append(forearmAnimation);

        return null;
      });
  }, []);
  return <div id="employee-container"></div>;
};

export default Animation;
