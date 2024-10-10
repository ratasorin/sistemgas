import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";
import { Positions } from "./Text/helpers/math/coordinates";
import TextRenderer from "./Text/Text";
import { Text } from "./Text/helpers/text";
import { useEffect, useMemo } from "react";
import CarRender, { useAnimationState } from "./Car/Car";
import { gsap } from "gsap";
import { END_TRANSITION_DURATION } from "../helper/animated-background";

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
  sm: 350,
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
  console.log({ screenWidth });
  let fontSize: number = fonts["text-lg"];
  if (screenWidth >= screens["sm"] && screenWidth < screens["md"])
    fontSize = fonts["text-xl"];
  if (screenWidth >= screens["md"] && screenWidth < screens["lg"])
    fontSize = fonts["text-2xl"];
  if (screenWidth >= screens["lg"] && screenWidth < screens["xl"])
    fontSize = fonts["text-2xl"];
  if (screenWidth >= screens["xl"] && screenWidth < screens["2xl"])
    fontSize = fonts["text-2xl"];
  if (screenWidth >= screens["2xl"]) fontSize = fonts["text-2xl"];

  return fontSize;
};

const getResponsiveCarVelocity = (screenWidth: number) => {
  let speed: number = 6;
  if (screenWidth < screens["xl"]) speed = speed - 0.1;
  if (screenWidth < screens["lg"]) speed = speed - 0.2;
  if (screenWidth < screens["md"]) speed = speed - 0.3;
  if (screenWidth < screens["sm"]) speed = speed - 0.4;

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
  const graphicsContainer = document.getElementById("root");

  if (!graphicsContainer || !textRendererDiv) return;

  const rect = textRendererDiv.getBoundingClientRect();
  const mt4 = 16; // px
  const graphicsContainerTop = graphicsContainer.scrollTop + mt4; // adding a margin because the container of text__renderer had a margin of 16px that the graphicsContainer ("root") will not have

  textRendererDiv.style.left = `${rect.left}px`;
  textRendererDiv.style.top = `${graphicsContainerTop}px`;

  graphicsContainer.appendChild(textRendererDiv);
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
      //   {payload: "SISTEMGAS", fontSize: }
      //   "SISTEMGAS",
      //   Math.floor(2 * fontSize),
      //   "#0a2375 #173dba",
      //   "Poppins",
      //   "start",
      //   "700",
      //   { x: 0, y: 12 }
      // ),
      // new Text(
      //   "Solutia",
      //   Math.floor(fontSize),
      //   "#4b557c",
      //   "Poppins",
      //   "newline"
      // ),
      // new Text(
      //   "alternativa",
      //   fontSize,
      //   "#fc944a #eb500b",
      //   "Poppins",
      //   "right",
      //   "600",
      //   {
      //     y: 2,
      //     x: 2,
      //   }
      // ),
      // new Text("pentru", Math.floor(fontSize), "#4b557c", "Poppins", "right"),
      // new Text(
      //   "furnizarea",
      //   Math.floor(fontSize),

      //   "#4b557c",
      //   "Poppins",
      //   "newline"
      // ),
      // new Text("gazelor", Math.floor(fontSize), "#4b557c", "Poppins", "right"),
      // new Text("naturale", Math.floor(fontSize), "#4b557c", "Poppins", "right"),

      new Text({
        payload: "SISTEMGAS este furnizorul: ",
        fontColor: "#0a2375",
        fontFamily: "Poppins",
        fontSize: 14,
        fontStyle: "700",
        position: "start",
      }),

      new Text({
        payload: "rapid si eficient ",
        fontColor: "#fc944a #eb500b",
        fontFamily: "Poppins",
        fontSize: 14,
        fontStyle: "700",
        position: "start",
      }),
    ];
  }, [width]);

  const images = useMemo(() => {
    const gasTruck = new Image() as HTMLImageElement;
    gasTruck.src = "/gas_truck.svg";
    return { gasTruck };
  }, []);

  const textRenderer = useMemo(() => {
    if (images.gasTruck)
      return new TextRenderer(text, images.gasTruck, carVelocity);
  }, [text, images, carVelocity]);

  const carRenderer = useMemo(() => {
    if (images.gasTruck)
      return new CarRender(images.gasTruck, carVelocity, heightFactor);
  }, [images.gasTruck, carVelocity, heightFactor]);

  const carCanvasDimensions = useMemo(() => {
    const ratio = (0.4 * height) / images.gasTruck.height;
    const width = ratio * images.gasTruck.width;

    return { width, height: 0.4 * height };
  }, [images, width, height]);

  useEffect(() => {
    if (!textRenderer || !height || !imageHeight) return;

    const sistemgasSvgBox = document
      .getElementById("Layer_2")
      ?.getBoundingClientRect();

    const graphicsContainer = document.getElementById("root");

    const mt4 = 16; // px
    const remainingSpace =
      (graphicsContainer?.scrollHeight || 0) -
      (sistemgasSvgBox?.height || 0) -
      mt4;
    console.log({ remainingSpace });

    const destinationY =
      (remainingSpace - (textRenderer.textBox?.height || 0)) / 2;

    console.log({ destinationY, height: textRenderer.textBox?.height });

    if (forceEnd) {
      bringTextCanvasFront();

      // if the user forced the end, the text may not have been painted at all, so make sure one paint is done
      textRenderer.end();

      gsap.to(document.getElementById("text__renderer")!, {
        y: destinationY,
        duration: 0,
      });
    } else if (finished && imageHeight && height) {
      requestAnimationFrame(() => {
        bringTextCanvasFront();
        gsap.to(document.getElementById("text__renderer"), {
          y: destinationY,
          duration: END_TRANSITION_DURATION / 1000,
          ease: "expo.out",
        });
      });
    }
  }, [finished, imageHeight, height, forceEnd]);

  if (!textRenderer || !carRenderer) return null;
  return (
    <div className="absolute bottom-0 w-full h-full overflow-hidden z-10">
      <div
        id="text__renderer"
        className="absolute bottom-0 w-full h-full z-0 overflow-hidden"
      >
        <Canvas
          width={textRenderer.textBox?.width || 0}
          height={textRenderer.textBox?.height || 0}
          render={textRenderer}
          start={start}
        ></Canvas>
      </div>
      <div
        id="car__renderer"
        className="absolute bottom-0 w-full h-full z-20 overflow-hidden"
      >
        <Canvas
          width={carCanvasDimensions.width}
          height={carCanvasDimensions.height}
          render={carRenderer}
          start={start}
          style={{
            position: "absolute",
            bottom: 0,
            transform: "translateY(calc(-1/11*100vh))",
          }}
        ></Canvas>
      </div>
    </div>
  );
};

export default Scene;
