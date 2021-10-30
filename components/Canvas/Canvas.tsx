import { NextPage } from "next";
import image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import canvas from "./canvas.module.css";
import CanvasText, { FinalText } from "./TextCustomizations";

interface Props {
  width: number;
  height: number;
}
interface TextProps {
  payload: string;
  fontSize: number;
}

interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

interface CanvasImage {
  image: HTMLImageElement;
  width: number;
  height: number;
  displayX: number;
  displayY?: 0;
  displayWidth: number;
  displayHeight: number;
  draw: () => void;
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

  const title = new CanvasText(
    ["Solutii", "alternative", "cock"],
    { firstValueDefault: true, options: [30] },
    { firstValueDefault: true, options: ["black"] },
    {
      firstValueDefault: true,
      options: ["Arial", "Noto Sans Mono"],
      keywords: ["alternative"],
    },
    [[0, 0], "right", "bottom"]
  );

  useEffect(() => {
    if (width && height) {
      console.log("refresh");
      const image = new Image() as HTMLImageElement;
      image.src = "/gas_truck.svg";
      const canvas = canvasRef.current as Canvas;
      canvas.width = width;
      canvas.height = height;

      const { context = canvas.getContext("2d") as CanvasRenderingContext2D } =
        canvas;

      const [fW, sW, tW] = title.getFinalText(context) as FinalText[];
      console.log(fW, sW, tW);

      const canvasImage: CanvasImage = {
        image: image,
        width: image.width,
        height: image.height,
        displayWidth: (image.width * width) / image.height,
        displayHeight: height,
        displayX: -width,
        draw: (): void => {
          // resetting canvas to overlap the objects rather than cropping them out
          context.globalCompositeOperation = "source-over";
          // drawing the car
          context.drawImage(
            canvasImage.image,
            0,
            0,
            canvasImage.width,
            canvasImage.height,
            canvasImage.displayX + x,
            0,
            canvasImage.displayWidth,
            canvasImage.displayHeight
          );
        },
      };

      /**
       * **x** will be used to update the position of the "car" on the canvas.
       */
      let x = 0;

      /**
       * **frameID** is will be a unique number that every requestAnimationFrame call will return.
       * We will need it in the cleanup function to stop the animation once the component is unmounted
       */
      let frameID: number;

      /**
       * The **render** function paints the browser at a certain framerate
       * @param now **now** is the timestamp that requestAnimationFrame passes to the callback (that being
       * the **render** function). In other words is the current timestamp
       */
      const render = (now: number) => {
        x += 4;

        // the first time the render function is called, we have no time.start, meaning time.elapsed will be negative
        // and this is not a behavior we intent for it. So if this is the case, time.elapsed will have it's default value
        // which is equal to the time.duration value. This way we make sure that the first paint is instantaneous.
        time.start ? (time.elapsed = now - time.start) : time.elapsed;

        if (time.elapsed >= time.duration) {
          time.start = now;
          //  draw([fW, sW, tW], canvasImage, canvas, context);
        }
        frameID = window.requestAnimationFrame(render);
      };

      window.requestAnimationFrame(render);
    }

    // () => {
    //   // stopping the animation on umount
    //   window.cancelAnimationFrame(frameID);
    // };
  }, [width, height]);

  return <canvas ref={canvasRef} className={canvas.canvas}></canvas>;
};

export default Canvas;
