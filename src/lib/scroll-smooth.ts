/*
   @param moveBy: the amount to scroll by
   @param time: the exact amount of time the scrolling will take (in milliseconds)
*/
export function scrollElementBy(
  element: HTMLElement,
  moveBy: number,
  animationTime: number = 500
) {
  let prevTime: number | undefined;
  let elapsedTime = 0;
  const speed = +(moveBy / animationTime).toFixed(2);

  let COOL_DOWN = 20; // ms
  let accumulatedCoolDown = 0;
  let right = 0;

  window.requestAnimationFrame(function step(currentTime) {
    if (!prevTime) prevTime = currentTime;

    const delta_T = currentTime - prevTime;

    elapsedTime += delta_T;
    accumulatedCoolDown += delta_T;

    if (accumulatedCoolDown < COOL_DOWN) {
      prevTime = currentTime;
      window.requestAnimationFrame(step);
      return;
    }

    const scrollBy = +(accumulatedCoolDown * speed).toFixed(2);
    accumulatedCoolDown = 0;
    right += scrollBy;

    element.scrollLeft = right;

    if (elapsedTime <= animationTime) {
      prevTime = currentTime;
      window.requestAnimationFrame(step);
    }
  });
}
