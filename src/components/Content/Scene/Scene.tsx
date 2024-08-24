import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";
import { Positions } from "./Text/helpers/math/coordinates";
import TextRenderer from "./Text/Text";
import { Text } from "./Text/helpers/text";
import { useEffect, useMemo } from "react";
import CarRender, { useAnimationState } from "./Car/Car";
import { gsap } from "gsap";
import { createPortal } from "react-dom";

export interface Render {
  render: () => void;
  update: () => void;
  initializeCanvas: (canvas: HTMLCanvasElement, dpr: number) => void;
  dimensions?: (
    coordinates: Positions
  ) => { width: number; height: number } | Error;
  end: () => void;
}
const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

const fonts = {
  "text-xs": 12,
  "text-sm": 14,
  "text-base": 16,
  "text-lg": 18,
  "text-xl": 20,
  "text-2xl": 24,
  "text-3xl": 30,
  "text-4xl": 36,
  "text-5xl": 48,
  "text-6xl": 60,
  "text-7xl": 72,
  "text-8xl": 96,
  "text-9xl": 128,
} as const;

const getResponsiveFontSize = (screenWidth: number) => {
  let fontSize: number = fonts["text-lg"];
  if (screenWidth > screens["sm"] && screenWidth < screens["md"])
    fontSize = fonts["text-xl"];
  if (screenWidth > screens["md"] && screenWidth < screens["lg"])
    fontSize = fonts["text-2xl"];
  if (screenWidth > screens["lg"] && screenWidth < screens["xl"])
    fontSize = fonts["text-2xl"];
  if (screenWidth > screens["xl"] && screenWidth < screens["2xl"])
    fontSize = fonts["text-2xl"];
  if (screenWidth > screens["2xl"]) fontSize = fonts["text-2xl"];

  return fontSize;
};

const getResponsiveCarVelocity = (screenWidth: number) => {
  let speed: number = 5;
  if (screenWidth < screens["xl"]) speed = speed - 0.25;
  if (screenWidth < screens["lg"]) speed = speed - 0.5;
  if (screenWidth < screens["md"]) speed = speed - 1;
  if (screenWidth < screens["sm"]) speed = speed - 1.25;

  return speed;
};

const getResponsiveHeightFactor = (screenWidth: number) => {
  let heightFactor = 0.6;
  if (screenWidth < screens["xl"]) heightFactor = 0.55;
  if (screenWidth < screens["lg"]) heightFactor = 0.5;
  if (screenWidth < screens["md"]) heightFactor = 0.45;
  if (screenWidth < screens["sm"]) heightFactor = 0.4;

  return heightFactor;
};

const bringTextCanvasFront = () => {
  const textRendererDiv = document.getElementById("text__renderer")!;

  const rect = textRendererDiv.getBoundingClientRect();

  textRendererDiv.style.left = `${rect.left}px`;
  textRendererDiv.style.top = `${rect.top}px`;
  textRendererDiv.style.width = `${rect.width}px`;
  textRendererDiv.style.height = `${rect.height}px`;

  document.getElementById("root")!.appendChild(textRendererDiv);
};

const Scene: NextPage<{
  width: number;
  height: number;
  imageHeight: number;
  start: boolean;
}> = ({ width, height, imageHeight, start }) => {
  const { finished, forceEnd } = useAnimationState();

  const carVelocity = useMemo(() => {
    return getResponsiveCarVelocity(width);
  }, [width]);

  const heightFactor = useMemo(() => {
    return getResponsiveHeightFactor(width);
  }, [width]);

  const text = useMemo(() => {
    const fontSize = getResponsiveFontSize(width);

    return [
      new Text(
        "SISTEMGAS",
        Math.floor(2 * fontSize),
        "#172554",
        "Poppins",
        "start",
        "bold",
        { x: 0, y: 12 }
      ),
      new Text(
        "Solutia",
        Math.floor(fontSize),
        "#172554",
        "Poppins",
        "newline"
      ),
      new Text(
        "alternativa",
        fontSize,
        "#f97316",
        "Poppins",
        "right",
        "bold italic",
        {
          y: 2,
          x: 2,
        }
      ),
      new Text("pentru", Math.floor(fontSize), "#172554", "Poppins", "right"),
      new Text(
        "furnizarea",
        Math.floor(fontSize),
        "#172554",
        "Poppins",
        "newline"
      ),
      new Text("gazelor", Math.floor(fontSize), "#172554", "Poppins", "right"),
      new Text("naturale", Math.floor(fontSize), "#172554", "Poppins", "right"),
    ];
  }, [width]);

  const images = useMemo(() => {
    const gasTruck = new Image() as HTMLImageElement;
    gasTruck.src = "/gas_truck.svg";
    return { gasTruck };
  }, []);

  const textRenderer = useMemo(() => {
    if (images.gasTruck)
      return new TextRenderer(text, images.gasTruck, carVelocity, heightFactor);
  }, [text, images, carVelocity, heightFactor]);

  const carRenderer = useMemo(() => {
    if (images.gasTruck)
      return new CarRender(images.gasTruck, carVelocity, heightFactor);
  }, [images.gasTruck, carVelocity, heightFactor]);

  useEffect(() => {
    if (!textRenderer || !height || !imageHeight) return;

    const marginTop = 52; //px
    const destinationY =
      -(textRenderer.textBoxCoordinates?.y || 0) +
      textRenderer.padding.top +
      marginTop;

    if (forceEnd) {
      bringTextCanvasFront();

      // if the user forced the end, the text may not have been painted at all, so make sure one paint is done
      textRenderer.end();

      gsap.to(document.getElementById("text__renderer")!, {
        y: destinationY,
        duration: 0,
      });
    } else if (finished && imageHeight && height) {
      bringTextCanvasFront();
      gsap.to(document.getElementById("text__renderer"), {
        y: destinationY,
        duration: 4,
        ease: "expo.out",
      });
    }
  }, [finished, imageHeight, height, forceEnd]);

  if (!textRenderer || !carRenderer) return null;
  return (
    <div className="relative bottom-0 w-full flex-1 overflow-hidden z-10">
      <div
        id="text__renderer"
        className="absolute bottom-0 w-full h-full z-10 overflow-hidden"
      >
        <Canvas
          width={width}
          height={height}
          render={textRenderer}
          start={start}
        ></Canvas>
      </div>
      <div
        id="car__renderer"
        className="absolute bottom-0 w-full h-full z-20 overflow-hidden"
      >
        <Canvas
          width={width}
          height={height}
          render={carRenderer}
          start={start}
        ></Canvas>
      </div>
    </div>
  );
};

export default Scene;
