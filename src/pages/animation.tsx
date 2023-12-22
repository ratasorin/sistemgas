import Head from "next/head";
import React, { useCallback, useEffect, useRef } from "react";
import { motionBlur } from "lib/motion-blur";

const rotateElementAroundAnchorPoint = (
  elementId: string,
  keyframes: [number, number, number],
  enableMotionBlur: boolean = false
) => {
  const element = document.getElementById(elementId);
  const elementAnchorPoint = document.getElementById(
    `${elementId}_anchor_point`
  );
  const elementAnchorPointX = elementAnchorPoint?.getAttribute("cx");
  const elementAnchorPointY = elementAnchorPoint?.getAttribute("cy");

  if (!elementAnchorPointX || !elementAnchorPointY) return;

  const elementAnimation = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "animateTransform"
  );

  elementAnimation.setAttribute("id", elementId);
  elementAnimation.setAttributeNS(null, "attributeName", "transform");
  elementAnimation.setAttributeNS(null, "attributeType", "XML");
  elementAnimation.setAttributeNS(null, "type", "rotate");
  elementAnimation.setAttributeNS(null, "calcMode", "spline");
  elementAnimation.setAttributeNS(
    null,
    "values",
    // DO NOT ADD SPACES BETWEEN SEMICOLON AND NUMBER! SAFARI ISSUE: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/keyTimes
    `${keyframes[0]} ${elementAnchorPointX} ${elementAnchorPointY};${keyframes[1]} ${elementAnchorPointX} ${elementAnchorPointY};${keyframes[2]} ${elementAnchorPointX} ${elementAnchorPointY}`
  );
  elementAnimation.setAttributeNS(null, "keyTimes", "0; 0.5; 1");
  elementAnimation.setAttributeNS(
    null,
    "keySplines",
    "0.5 0 0.5 1; 0.5 0 0.5 1"
  );
  elementAnimation.setAttributeNS(null, "dur", "1.5s");
  elementAnimation.setAttributeNS(null, "repeatCount", "indefinite");

  element?.append(elementAnimation);

  if (enableMotionBlur) motionBlur(elementId);
};

const Animation = () => {
  const svgCreated = useRef(0);
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
    if (document && !svgCreated.current) {
      svgCreated.current = 1;
      getSVG().then((svg) => {
        if (!svg) return null;
        document.getElementById("employee-container")?.append(svg);

        rotateElementAroundAnchorPoint("hand", [-15, 15, -15], false);
        rotateElementAroundAnchorPoint("forearm", [0, 18, 0], false);
        rotateElementAroundAnchorPoint("right_arm", [0, 12, 0], true);

        return null;
      });
    }
  }, []);
  return (
    <>
      <div id="employee-container"></div>;
    </>
  );
};

export default Animation;
