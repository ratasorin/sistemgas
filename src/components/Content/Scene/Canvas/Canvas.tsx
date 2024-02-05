import { NextPage } from "next";
import React, { useRef, useEffect } from "react";
import { Render } from "../Scene";
import { useAnimationState } from "../Car/Car";

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
  const { finished } = useAnimationState();
  const frameID = useRef(-1);

  useEffect(() => {
    if (width && height) {
      const canvas = canvasRef.current as Canvas;
      const dpr = window.devicePixelRatio;
      render.initializeCanvas(canvas, dpr);
      /**
       * **frameID** is a unique number that every requestAnimationFrame call will return.
       * We will need it in the cleanup function to stop the animation once the component is unmounted
       */
      const loop = () => {
        render.update();
        render.render();
        frameID.current = window.requestAnimationFrame(loop);
      };

      window.requestAnimationFrame(loop);
    }

    return () => {
      if (frameID) window.cancelAnimationFrame(frameID.current);
    };
  }, [width, height]);

  useEffect(() => {
    if (finished && frameID) {
      window.cancelAnimationFrame(frameID.current);
    }
  }, [finished]);

  return (
    <canvas
      style={{ width, height }}
      ref={canvasRef}
      className="relative bg-transparent"
    ></canvas>
  );
};

export default Canvas;
