export function scrollElementBy(
  element: HTMLElement,
  moveBy: number,
  animationTime: number = 500
) {
  let startTime: number | undefined;
  const startScrollLeft = element.scrollLeft;
  
  let COOL_DOWN = 20; // ms
  let accumulatedCoolDown = 0;

  window.requestAnimationFrame(function step(currentTime) {
    if (!startTime) startTime = currentTime;

    const elapsedTime = currentTime - startTime;
    accumulatedCoolDown += elapsedTime;

    if (accumulatedCoolDown < COOL_DOWN) {
      window.requestAnimationFrame(step);
      return;
    }

    const progress = Math.min(elapsedTime / animationTime, 1); // Ensures it doesn't exceed 1
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out function

    // Compute the new scroll position
    const newScrollLeft = startScrollLeft + moveBy * easedProgress;
    element.scrollLeft = newScrollLeft;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  });
}
