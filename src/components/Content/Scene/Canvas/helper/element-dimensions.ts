export const getElementDimensions = (element: HTMLElement) => {
  return {
    width: Math.floor(Number(element.style.width.replace("px", ""))),
    height: Math.floor(Number(element.style.height.replace("px", ""))),
  };
};
