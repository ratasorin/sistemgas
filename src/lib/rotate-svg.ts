import { motionBlur } from "./motion-blur";

export const rotateElementAroundAnchorPoint = (
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
