import { NextPage } from "next";
import image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import canvas from "./canvas.module.css";

interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

const baseline = (
  canvas: Canvas,
  image: HTMLImageElement
): [number, number] => {
  const { width: cW, height: cH } = canvas;
  const { width: iW, height: iH } = image;
  const ratio = cH / iH;
  return [(cW - iW * ratio) / 2, iW * ratio];
};

const drawImage = (
  canvas: Canvas,
  image: HTMLImageElement,
  x: number
): void => {
  const [centerX, computedWidth] = baseline(canvas, image);
  const {
    height: canvasHeight,
    width: canvasWidth,
    context = canvas.getContext("2d") as CanvasRenderingContext2D,
  } = canvas;

  const { width: imageWidth, height: imageHeight } = image;

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  context.save();
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.fillText("Hello World", canvasWidth / 2, canvasHeight / 2);
  context.clearRect(-computedWidth + x, 0, imageWidth, canvasHeight);
  context.restore();

  context.drawImage(
    image,
    0,
    0,
    imageWidth,
    imageHeight,
    -centerX - computedWidth + x,
    0,
    canvasWidth,
    canvasHeight
  );
  context.fillStyle = "black";
  // context.fillRect(-computedWidth + x, 0, 10, canvasHeight);
};

// const update = () => {
//   const x = 0;
// };

interface Props {
  width: number;
  height: number;
}
const Canvas: NextPage<Props> = ({ width, height }) => {
  const canvasRef = useRef<Canvas>(null);

  /**
   * **time** is the way we are going to keep track of when we should re-draw an image. (control the framerate)
   * @member **elapsed** is the time between the **"start"** (that being the last repaint) and the current
   * timestamp. We initialize this with the same value as **duration** so we can have the first paint instantaneous.
   * @member  **start** is the timestamp of the most recent re-draw. The default value is -1 as we don't know when
   * the first paint will happen.
   * @member  **duration** is the time that should pass between two consecutive paints to achieve a
   * desired frame rate.
   */
  const time = {
    elapsed: 1000 / 144,
    start: -1,
    duration: 1000 / 144,
  };
  useEffect(() => {
    const image = new Image();
    image.src = "/gas_truck.svg";

    let x = 20;
    const canvas = canvasRef.current as Canvas;
    canvas.width = width;
    canvas.height = height;

    let frameID: number;

    /**
     * The **render** function paints the browser at a certain framerate
     * @param now **now** is the timestamp that requestAnimationFrame passes to the callback (that being
     * the **render** function). In other words is the current timestamp
     */
    const render = (now: number) => {
      x += 4;
      time.start ? (time.elapsed = now - time.start) : time.elapsed;
      if (time.elapsed >= time.duration) {
        time.start = now;
        drawImage(canvas, image, x);
      }
      frameID = window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);
    () => {
      window.cancelAnimationFrame(frameID);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} className={canvas.canvas}></canvas>;
};

export default Canvas;
