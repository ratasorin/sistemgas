function scrollElementBy(
  element,
  moveBy,
  animationTime = 500
) {
  let prevTime;
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

const element = document.getElementById("sistemgas-hq");

[...document.querySelectorAll(".cls-57")].map(el => el.getBoundingClientRect()) 
