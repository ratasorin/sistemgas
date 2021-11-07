import { NextPage } from "next";
import image from "next/image";
import React, { useRef, useEffect, useState, useContext } from "react";
import {
  AnimationContext,
  AnimationProvider,
} from "../../context/animationContext";
import canvas from "./canvas.module.css";
import CanvasText, {
  FinalText,
  FontConfigurationsProps,
} from "./TextCustomizations";
import { DrawParameters } from "../Car/Draw";
// ignore
import CarRender from "../Car/Car.ts";

interface Props {
  width: number;
  height: number;
  toDraw: "car" | "text";
}

interface Render {
  render: () => void;
  update: () => void;
}
interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

const Canvas: NextPage<Props> = ({ width, height, toDraw }) => {
  const canvasRef = useRef<Canvas>(null);
  const [AnimationDetails, setAnimationDetails] = useContext(AnimationContext);

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

  // const fontSizeCustomizations: FontConfigurationsProps = {
  //   firstValueDefault: true,
  //   options: [50],
  // };
  // const fontColorCustomizations: FontConfigurationsProps = {
  //   firstValueDefault: true,
  //   options: ["black"],
  // };
  // const fontFamilyCustomizations: FontConfigurationsProps = {
  //   firstValueDefault: true,
  //   options: ["Arial", "Noto Sans Mono"],
  //   keywords: "alternativa",
  // };

  // const fontPadding: FontConfigurationsProps = {
  //   firstValueDefault: true,
  //   options: [20],
  // };
  // const title = new CanvasText(
  //   ["Solutia", "alternativa", "pentru", "furnizarea", "gazelor", "naturale"],
  //   fontSizeCustomizations,
  //   fontColorCustomizations,
  //   fontFamilyCustomizations,

  //   // TO DO : find better implementation for the padding
  //   fontPadding,

  //   [[200, 100], "right", "newline", "right", "right", "right"]
  // );
  useEffect(() => {
    if (width && height) {
      const image = new Image() as HTMLImageElement;
      image.src = "/gas_truck.svg";
      const canvas = canvasRef.current as Canvas;
      canvas.width = width;
      canvas.height = height;
      // const text = title.getFinalText(
      //   canvas.getContext("2d") as CanvasRenderingContext2D
      // ) as FinalText[];

      /**
       * **frameID** is will be a unique number that every requestAnimationFrame call will return.
       * We will need it in the cleanup function to stop the animation once the component is unmounted
       */
      let frameID: number;

      const draw: Render =
        toDraw === "car"
          ? new CarRender(canvas, image.width, image)
          : { render: () => {}, update: () => {} };

      /**
       * The **render** function paints the browser at a certain framerate
       * @param now **now** is the timestamp that requestAnimationFrame passes to the callback (that being
       * the **render** function). In other words is the current timestamp
       */
      const loop = (now: number) => {
        // the first time the render function is called, we have no time.start, meaning time.elapsed will be negative
        // and this is not a behavior we intent for it. So if this is the case, time.elapsed will have it's default value
        // which is equal to the time.duration value. This way we make sure that the first paint is instantaneous.
        time.start ? (time.elapsed = now - time.start) : time.elapsed;
        draw.update();
        if (time.elapsed >= time.duration) {
          time.start = now;
          draw.render();
        }
        frameID = window.requestAnimationFrame(loop);
      };

      window.requestAnimationFrame(loop);
    }

    // () => {
    //   // stopping the animation on umount
    //   window.cancelAnimationFrame(frameID);
    // };
  }, [width, height]);

  return <canvas ref={canvasRef} className={canvas.canvas}></canvas>;
};

export default Canvas;
