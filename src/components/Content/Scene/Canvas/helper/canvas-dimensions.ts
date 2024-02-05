export const getCanvasDimensions = (canvas: HTMLCanvasElement) => {
  return {
    width: Math.floor(Number(canvas.style.width.replace("px", ""))),
    height: Math.floor(Number(canvas.style.height.replace("px", ""))),
  };
};
