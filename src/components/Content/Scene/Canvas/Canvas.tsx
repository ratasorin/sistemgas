import { NextPage } from "next";
import React, { useRef, useEffect } from "react";
import { Render } from "../Scene";
import { useAnimationState } from "../Car/Car";

interface Props {
  width: number;
  height: number;
  render: Render;
  start: boolean;
}

interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

const Canvas: NextPage<Props> = ({ width, height, render, start }) => {
  const canvasRef = useRef<Canvas>(null);
  const { finished, forceEnd } = useAnimationState();
  const frameID = useRef(-1);

  useEffect(() => {
    if (width && height) {
      const canvas = canvasRef.current as Canvas;
      const dpr = window.devicePixelRatio;
      render.initializeCanvas(canvas, dpr);
      const MIN_REFRESH_RATE_FPS = 60;
      const MIN_DELAY_MILLIS = Math.floor(1000 / MIN_REFRESH_RATE_FPS); // 1 second has 1000 millis
      let prevTime: number | undefined;

      /**
       * **frameID** is a unique number that every requestAnimationFrame call will return.
       * We will need it in the cleanup function to stop the animation once the component is unmounted
       */
      const loop = (time: number) => {
        let delta = Math.floor(time - (prevTime ?? 0));
        console.log({ delta });
        if (delta <= MIN_DELAY_MILLIS) {
          render.update();
          render.render();
        } else {
          while (delta > MIN_DELAY_MILLIS && delta <= 10 * MIN_DELAY_MILLIS) {
            render.update();
            delta -= MIN_DELAY_MILLIS;
          }
          render.render();
        }

        prevTime = time;
        frameID.current = window.requestAnimationFrame(loop);
      };

      if (start) window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(frameID.current);
    };
  }, [width, height, render]);

  useEffect(() => {
    if (width && height)
      if ((finished || forceEnd) && frameID) {
        render.end();
        window.cancelAnimationFrame(frameID.current);
      }
  }, [finished, forceEnd, width, height]);

  return (
    <canvas
      style={{ width, height }}
      ref={canvasRef}
      className="relative bg-transparent"
    ></canvas>
  );
};

export default Canvas;
