import { NextPage } from "next";
import image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import canvas from "./canvas.module.css";

interface Canvas {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  xDestination: number;
}

const drawImage = (
  { context, width, height, xDestination }: Canvas,
  image: HTMLImageElement
): void => {
  context.clearRect(0, 0, width, height);
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    width,
    height
  );
  context.fillRect(image.width / 4, 0, 10, height);
  context.fillRect(image.width / 2, 0, 10, height);
};

// const update = () => {
//   const x = 0;
// };

interface Props {
  width: number;
  height: number;
}
const Canvas: NextPage<Props> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const canvas = canvasRef.current as HTMLCanvasElement;

    canvas.width = width;
    canvas.height = height;

    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;

    let frameID: number;

    /**
     * The **render** function paints the browser at a certain framerate
     * @param now **now** is the timestamp that requestAnimationFrame passes to the callback (that being
     * the **render** function). In other words is the current timestamp
     */
    const render = (now: number) => {
      time.start ? (time.elapsed = now - time.start) : time.elapsed;
      if (time.elapsed >= time.duration) {
        time.start = now;
        drawImage(
          {
            context,
            width: canvas.width,
            height: canvas.height,
            xDestination: x,
          },
          image
        );
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
