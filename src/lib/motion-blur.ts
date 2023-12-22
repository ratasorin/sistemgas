export const motionBlur = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("No element with id: ", elementId);
    return null;
  }
  const elementParent = element.parentNode;
  if (!elementParent) return null;

  ([...elementParent.children] as HTMLElement[]).forEach((child) => {
    const tempParent = child.parentNode!;

    child.style.animationPlayState = "paused";
    const shadow1 = child.cloneNode(true) as HTMLElement;
    shadow1.setAttribute("style", "opacity: 0.25");
    const shadow1Animation = shadow1.getElementsByTagName(
      "animateTransform"
    )[0] as SVGAnimateTransformElement;

    if (shadow1Animation) {
      shadow1Animation.setAttributeNS(
        null,
        "keySplines",
        "0.55 0 0.55 1; 0.55 0 0.55 1;"
      );
    }

    const shadow2 = child.cloneNode(true) as HTMLElement;
    shadow2.setAttribute("style", "opacity: 0.20");
    const shadow2Animation = shadow2.getElementsByTagName(
      "animateTransform"
    )[0] as SVGAnimateTransformElement;

    if (shadow2Animation) {
      shadow2Animation.setAttributeNS(
        null,
        "keySplines",
        "0.55 0.05 0.55 1; 0.55 0.05 0.55 1;"
      );
    }

    const shadow3 = child.cloneNode(true) as HTMLElement;
    shadow3.setAttribute("style", "opacity: 0.15");
    const shadow3Animation = shadow3.getElementsByTagName(
      "animateTransform"
    )[0] as SVGAnimateTransformElement;
    if (shadow3Animation) {
      shadow3Animation.setAttributeNS(
        null,
        "keySplines",
        "0.6 0 0.55 1; 0.6 0 0.55 1;"
      );
    }

    tempParent.appendChild(shadow1);
    tempParent.appendChild(shadow2);
    tempParent.appendChild(shadow3);
  });
};
