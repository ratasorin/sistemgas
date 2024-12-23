let currentElementHovered: HTMLElement | undefined = undefined;
let lastElementHovered: HTMLElement | undefined = undefined;

let hoverOverElementCountdown: NodeJS.Timer | null = null;
let hoverOutCountdown: NodeJS.Timer | null = null;

export type Effect = ((currentElementHovered: Element) => void) | null;
export type Cleanup = ((lastElementHovered: Element) => void) | null;
export const updateLastElementHovered = (
  element: HTMLElement,
  callbacks: {
    effect: Effect;
    cleanup: Cleanup;
  }
) => {
  const { cleanup, effect } = callbacks;

  console.log({
    hoverOutCountdown,
    hoverOverElementCountdown,
    element,
    currentElementHovered,
    lastElementHovered,
  });

  if (hoverOverElementCountdown) clearTimeout(hoverOverElementCountdown);
  if (hoverOutCountdown) clearTimeout(hoverOutCountdown);

  currentElementHovered = element;

  hoverOverElementCountdown = setTimeout(() => {
    if (!currentElementHovered) return;

    if (
      lastElementHovered !== currentElementHovered &&
      cleanup &&
      lastElementHovered
    )
      cleanup(lastElementHovered);

    if (effect) effect(currentElementHovered);

    if (effect || cleanup) lastElementHovered = currentElementHovered;
  }, 200);
};

export const shouldExit = (
  element: HTMLElement,
  effect: ((element: Element) => void) | null
) => {
  hoverOutCountdown = setTimeout(() => {
    if (effect && lastElementHovered) effect(lastElementHovered);
  }, 600);
};
