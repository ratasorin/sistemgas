import { NextPage } from "next";
import React, { useRef, useEffect, useContext } from "react";
import CarRender from "../Car/Car";
import TextRenderer from "../Text/Text";
// import type { FontConfigurationsProps } from "../Text/TextCustomizations";
// import CanvasText from "../Text/TextCustomizations
import { Render } from "../Scene";
import { Text } from "../Text/helpers/text";

interface Props {
  width: number;
  height: number;
  render: Render;
}

interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

const Canvas: NextPage<Props> = ({ width, height, render }) => {
  const canvasRef = useRef<Canvas>(null);
  // const { setShouldBlur } = useContext(BlurContext);
  /**
   * **time** is the way we are going to keep track of when we should re-draw an image. (control the framerate)
   * @member **elapsed** is the time between the **"start"** (that being the last repaint) and the current
   * timestamp. We initialize this with the same value as **duration** so we can have the first paint instantaneous.
   * @mem ber  **start** is the timestamp of the most recent re-draw. The default value is -1 as we don't know when
   * the first paint will happen.
   * @member  **duration** is the time that should pass between two consecutive paints to achieve a
   * desired frame rate.
   */
  const time = {
    elapsed: 1000 / 60,
    start: 1000 / 60,
    duration: 1000 / 60,
  };

  useEffect(() => {
    if (width && height) {
      const canvas = canvasRef.current as Canvas;
      [canvas.width, canvas.height] = [width, height];
      render.initializeCanvas(canvas);
      /**
       * **frameID** is a unique number that every requestAnimationFrame call will return.
       * We will need it in the cleanup function to stop the animation once the component is unmounted
       */
      let frameID: number;

      if (render.dimensions)
        console.log({
          dimensions: render.dimensions([
            { x: 200, y: canvas.height / 2 },
            "right",
            "newline",
            "right",
            "newline",
          ]),
          canvas: { width, height },
        });
      /**
       * The **render** function paints the browser at a certain framerate
       * @param now **now** is the timestamp that requestAnimationFrame passes to the callback (that being
       * the **render** function). In other words is the current timestamp
       */
      const loop = (now: number) => {
        time.elapsed = now - time.start;
        render.update();
        if (time.elapsed >= time.duration) {
          time.start = now;
          render.update();
        }
        render.render();
        frameID = window.requestAnimationFrame(loop);
      };

      window.requestAnimationFrame(loop);
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="relative w-full h-full bg-transparent"
    ></canvas>
  );
};

export default Canvas;
