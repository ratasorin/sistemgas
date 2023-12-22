export const motionBlur = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("No element with id: ", elementId);
    return null;
  }
  const elementParent = element.parentNode;
  if (!elementParent) return null;

  const shadow1 = element.cloneNode(true) as HTMLElement;
  shadow1.setAttribute(
    "style",
    "opacity: 0.25; position: relative; z-index: 1;"
  );
  const shadow1Animation = [
    ...shadow1.getElementsByTagName("animateTransform"),
  ].find((elem) => elem.getAttribute("id") === elementId);

  if (shadow1Animation) {
    shadow1Animation.setAttributeNS(
      null,
      "keySplines",
      "0.55 0 0.55 1; 0.55 0 0.55 1;"
    );
  }

  const shadow2 = element.cloneNode(true) as HTMLElement;
  shadow2.setAttribute(
    "style",
    "opacity: 0.25; position: relative; z-index: 1;"
  );
  const shadow2Animation = [
    ...shadow2.getElementsByTagName("animateTransform"),
  ].find((elem) => elem.getAttribute("id") === elementId);

  if (shadow2Animation) {
    shadow2Animation.setAttributeNS(
      null,
      "keySplines",
      "0.55 0.05 0.55 1; 0.55 0.05 0.55 1;"
    );
  }

  const shadow3 = element.cloneNode(true) as HTMLElement;
  shadow3.setAttribute(
    "style",
    "opacity: 0.25; position: relative; z-index: 1;"
  );
  const shadow3Animation = [
    ...shadow3.getElementsByTagName("animateTransform"),
  ].find((elem) => elem.getAttribute("id") === elementId);

  if (shadow3Animation) {
    shadow3Animation.setAttributeNS(
      null,
      "keySplines",
      "0.6 0 0.55 1; 0.6 0 0.55 1;"
    );
  }

  elementParent.insertBefore(shadow1, elementParent.firstChild);
  elementParent.insertBefore(shadow2, elementParent.firstChild);
  elementParent.insertBefore(shadow3, elementParent.firstChild);
};
