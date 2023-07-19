import { NextPage } from "next";
import React, { useRef, useEffect } from "react";
import { Render } from "../Scene";

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
      const loop = () => {
        render.update();
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
