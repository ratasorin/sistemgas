import { NextPage } from "next";
import React, { useRef, useEffect, useContext } from "react";
import CarRender from "../Car/Car";
import TextRenderer from "../Text/Text";
// import type { FontConfigurationsProps } from "../Text/TextCustomizations";
// import CanvasText from "../Text/TextCustomizations
import { Render } from "../Scene";
import { FontConfigurationsProps } from "../Text/helpers/fonts/config";
import { customize, textToBuild } from "../Text/helpers/customize";

interface Props {
  width: number;
  height: number;
  toDraw: "car" | "text";
}

interface Canvas extends HTMLCanvasElement {
  context: CanvasRenderingContext2D;
}

const Canvas: NextPage<Props> = ({ width, height, toDraw }) => {
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
    start: -1,
    duration: 1000 / 60,
  };

  useEffect(() => {
    if (width && height) {
      const image = new Image() as HTMLImageElement;
      image.onload = () => {
        const canvas = canvasRef.current as Canvas;
        [canvas.width, canvas.height] = [width, height];
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        /**
         * **frameID** is will be a unique number that every requestAnimationFrame call will return.
         * We will need it in the cleanup function to stop the animation once the component is unmounted
         */
        let frameID: number;

        // Customizing the presentation title
        const fontSizeCustomizations: FontConfigurationsProps = {
          firstValueDefault: true,
          options: [64],
        };
        const fontColorCustomizations: FontConfigurationsProps = {
          firstValueDefault: true,
          options: ["black"],
        };
        const fontFamilyCustomizations: FontConfigurationsProps = {
          firstValueDefault: true,
          options: ["Arial", "Noto Sans Mono"],
          keywords: "alternativa",
        };

        /**
         * The **presentationTitle** will be revealed on the canvas by the car. The payload is fully customizable,
         * as are the font family, size and color, as well as the positioning of the text (which can be customized both
         * in absolute units or relative to other text).
         */
        const customizations = customize({
          color: fontColorCustomizations,
          fontFamily: fontFamilyCustomizations,
          fontSize: fontSizeCustomizations,
          payload: ["Solutia", "pentru", "furnizarea", "gazelor", "naturale"],
          positions: ["start", "right", "newline", "right", "right"],
        });
        const draw: Render =
          toDraw === "car"
            ? new CarRender(canvas, image.width, image, context)
            : new TextRenderer(customizations, canvas, context);

        if (draw.dimensions)
          console.log({
            dimensions: draw.dimensions([
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
          // the first time the render function is called, we have no time.start, meaning time.elapsed will be negative
          // and this is not a behavior we intent for it. So if this is the case, time.elapsed will have it's default value
          // which is equal to the time.duration value. This way we make sure that the first paint is instantaneous.
          time.start ? (time.elapsed = now - time.start) : time.elapsed;
          draw.update();
          // draw.blur ? setShouldBlur(draw.blur) : 0;
          if (time.elapsed >= time.duration) {
            time.start = now;
            draw.update();
          }
          draw.render();
          frameID = window.requestAnimationFrame(loop);
        };

        window.requestAnimationFrame(loop);
      };
      image.src = "/gas_truck.svg";
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className='relative w-full h-full bg-transparent border-black border-8'></canvas>
  );
};

export default Canvas;
