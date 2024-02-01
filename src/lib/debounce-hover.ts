const elementsHovered: HTMLElement[] = [];
let lastElementHovered: HTMLElement | undefined = undefined;

let hoverOverElementCountdown: NodeJS.Timer | null = null;
let hoverOutCountdown: NodeJS.Timer | null = null;

export const updateLastElementHovered = (
  element: HTMLElement,
  effect: ((currentElementHovered: Element) => void) | null,
  cleanup: ((lastElementHovered: Element) => void) | null
) => {
  if (hoverOverElementCountdown) clearTimeout(hoverOverElementCountdown);
  if (hoverOutCountdown) clearTimeout(hoverOutCountdown);

  const elementIndexInStack = elementsHovered.findIndex((el) => el === element);
  if (elementIndexInStack !== -1) {
    elementsHovered.splice(elementIndexInStack, 1);
  }
  elementsHovered.push(element);

  hoverOverElementCountdown = setTimeout(() => {
    const currentElementHovered = elementsHovered[elementsHovered.length - 1];

    if (!currentElementHovered) return;

    if (cleanup && lastElementHovered) cleanup(lastElementHovered);

    if (effect) effect(currentElementHovered);

    if (effect || cleanup) lastElementHovered = currentElementHovered;
  }, 200);
};

export const shouldExit = (
  element: HTMLElement,
  effect: ((element: Element) => void) | null
) => {
  const elementIndexInStack = elementsHovered.findIndex((el) => el === element);
  if (elementIndexInStack !== -1) {
    elementsHovered.splice(elementIndexInStack, 1);
  }
  if (elementsHovered.length === 0) {
    hoverOutCountdown = setTimeout(() => {
      if (effect && lastElementHovered) effect(lastElementHovered);
    }, 200);
  }
};
