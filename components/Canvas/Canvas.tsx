import { NextPage } from "next";
import image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import canvas from "./canvas.module.css";

function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.some((v) => typeof v !== "string")) {
    return false;
  }

  return true;
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

class CanvasTextPositions {
  /**
   * **lastCoordinates** is a tuple containing two numbers, the X and Y position of the last text displayed.
   * These values will help us determine the position of the current text we want to display, based on a relative
   * relationship with the last one.
   */
  static lastCoordinates: [number, number];

  /**
   * **lastTextLength** is another tuple containing the width and height of the last text displayed. Because
   * the X and Y are considered without the width and the height of the last text, we have to add them to get the
   * new text's X and Y.
   */
  static lastTextLength: [number, number];

  /**
   *  This constructor returns
   * @param initialText The **current** text we want to display
   * @param x The horizontal location on the canvas we want our text to be positioned at
   * @param y The vertical location on the canvas we want our text to be positioned at
   */
  constructor(text: Text, x: number, y: number) {}
  constructor(initialText: Text, position: string) {}
}

class FontConfigurations<T> {
  options = [] as T[];
  keywords: string[] | string | undefined;
  defaultValue: T;
  index = 0;
  /**
   * @param firstValueDefault Is a boolean used in deciding if the value used after all the options are exhausted
   * is the first value inputted or the last.
   *
   * @param options Is an array of T type values used for customizing text.
   */
  constructor(
    firstValueDefault: boolean,
    options: T[],
    keywords?: string | string[]
  ) {
    this.options = options;
    firstValueDefault
      ? (this.defaultValue = this.options[this.index])
      : (this.defaultValue = this.options[this.options.length]);

    this.keywords = keywords;
  }

  find(word: string) {
    console.log(word, this.keywords);
    if (!this.keywords) return false;
    if (typeof this.keywords === "string" && this.keywords === word) {
      return true;
    }
    if (isStringArray(this.keywords)) {
      return this.keywords.find((keyword) => keyword === word) === undefined
        ? false
        : true;
    }
  }

  change(word: string): void {
    if (this.find(word)) {
      this.index++;
    }
  }

  get current() {
    if (this.index === this.options.length) return this.defaultValue;
    return this.options[this.index];
  }
}

interface Text {
  payload: string | string[];
  fontSize: FontConfigurations<number>;
  color: FontConfigurations<string>;
  fontFamily: FontConfigurations<string>;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface textProps {
  payload: string | string[];
  fontSize: number;
  color: string;
  fontFamily: string;
  x?: number | number[];
  y?: number | number[];
}
class CanvasText implements Text {
  payload: string | string[];
  fontSize: FontConfigurations<number>;
  color: FontConfigurations<string>;
  fontFamily: FontConfigurations<string>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  constructor(
    payload: string[] | string,
    fontSize: FontConfigurations<number>,
    color: FontConfigurations<string>,
    fontFamily: FontConfigurations<string>
  ) {
    this.payload = payload;
    this.fontSize = fontSize;
    this.color = color;
    this.fontFamily = fontFamily;
  }
  get width() {
    text;
  }
  toDraw(): textProps | textProps[] {
    if (typeof this.payload === "string") {
      return {
        payload: this.payload,
        fontSize: this.fontSize.current,
        color: this.color.current,
        fontFamily: this.fontFamily.current,
      };
    } else {
      return this.payload.map((text) => {
        this.fontSize.change(text);
        const fontSize = this.fontSize.current;

        this.color.change(text);
        const color = this.color.current;

        this.fontFamily.change(text);
        const fontFamily = this.fontFamily.current;
        return {
          payload: text,
          fontSize,
          color,
          fontFamily,
        };
      });
    }
  }
}

const draw = (canvas: Canvas, image: HTMLImageElement, x: number): void => {
  const {
    height: canvasHeight,
    width: canvasWidth,
    context = canvas.getContext("2d") as CanvasRenderingContext2D,
  } = canvas;

  const canvasImage: CanvasImage = {
    image: image,
    width: image.width,
    height: image.height,
    displayWidth: (image.width * canvasWidth) / image.height,
    displayHeight: canvasHeight,
    displayX: -canvasWidth,
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

  // we clear the last image we draw on the canvas, so we don't get a cluttered canvas
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // the rectangle will cover everything to the right of displayX, and it will move along side the car.
  //  context.fillRect(-canvasWidth + x + 50, 0, imageWidth, canvasHeight);

  // drawing the text, but if the text overlaps with the rectangle, it will be opacity 0. This will give the
  // impression that the car is revealing the text
  context.globalCompositeOperation = "source-out";

  context.fillStyle = "black";
  context.font = "100px Arial";
  context.fillText("Hello World", canvasWidth / 2, canvasHeight / 2);
};

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
    const title = new CanvasText(
      ["Solutii", "alternative"],
      new FontConfigurations(true, [30]),
      new FontConfigurations(true, ["black"]),
      new FontConfigurations(true, ["Arial", "Noto Sans Mono"], "alternative")
    );

    const [fW, sW] = title.toDraw() as textProps[];
    console.log(fW, sW);
    const image = new Image() as HTMLImageElement;
    image.src = "/gas_truck.svg";
    const canvas = canvasRef.current as Canvas;
    canvas.width = width;
    canvas.height = height;
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
        draw(canvas, image, x);
      }
      frameID = window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);

    () => {
      // stopping the animation on umount
      window.cancelAnimationFrame(frameID);
    };
  }, [width, height]);

  return <canvas ref={canvasRef} className={canvas.canvas}></canvas>;
};

export default Canvas;
