import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";
import { Positions } from "./Text/helpers/math/coordinates";
import TextRenderer from "./Text/Text";
import { Text } from "./Text/helpers/text";
import { useEffect, useMemo, useRef, useState } from "react";
import CarRender, { useAnimationState } from "./Car/Car";
import { gsap } from "gsap";
import { END_TRANSITION_DURATION } from "../helper/animated-background";
import Pill, { startSlideshowAtom } from "./pill";
import scene_styles from "./styles.module.css";
import { useSetAtom } from "jotai";

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
  const graphicsContainer = document.getElementById("main-text");

  if (!graphicsContainer || !textRendererDiv) return;

  const rect = textRendererDiv.getBoundingClientRect();

  const y = rect.top - graphicsContainer.getBoundingClientRect().top;

  textRendererDiv.style.top = `${y}px`;

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

  const images = useMemo(() => {
    const gasTruck = new Image() as HTMLImageElement;
    gasTruck.src = "/gas_truck.svg";
    return { gasTruck };
  }, []);

  const carRenderer = useMemo(() => {
    if (images.gasTruck)
      return new CarRender(images.gasTruck, carVelocity, heightFactor);
  }, [images.gasTruck, carVelocity, heightFactor]);

  const carCanvasDimensions = useMemo(() => {
    const ratio = (0.4 * height) / images.gasTruck.height;
    const width = ratio * images.gasTruck.width;

    return { width, height: 0.4 * height };
  }, [images, width, height]);

  const setStartSlideshow = useSetAtom(startSlideshowAtom);
  const canvasTextIsFront = useRef(false);

  useEffect(() => {
    if (!height || !imageHeight) return;

    if (forceEnd) {
      // the settimeout is needed to ensure the pill gets dimensions after setting it's width to: animation-finished
      setTimeout(() => {
        const textRendererDiv = document.getElementById("text__renderer")!;
        if (!textRendererDiv) return;

        const desiredLocation =
          (document
            .getElementById("pill-placeholder-scroll")
            ?.getBoundingClientRect().top || 0) - 2;
        const currentLocation = textRendererDiv.getBoundingClientRect().top;

        const deltaY = desiredLocation - currentLocation;

        if (!canvasTextIsFront.current) {
          bringTextCanvasFront();
          canvasTextIsFront.current = true;
          gsap.to(textRendererDiv, {
            y: deltaY,
            duration: 0,
          });
          setStartSlideshow(true);
        } else {
          textRendererDiv.style.top = `${
            Number(textRendererDiv.style.top.replace("px", "")) + deltaY
          }px`;
        }
      }, 50);
    } else if (finished && imageHeight && height) {
      requestAnimationFrame(() => {
        const textRendererDiv = document.getElementById("text__renderer")!;
        const graphicsContainer = document.getElementById("main-text");

        if (!graphicsContainer || !textRendererDiv) return;

        const desiredLocation =
          (document
            .getElementById("pill-placeholder-scroll")
            ?.getBoundingClientRect().top || 0) - 2;
        const currentLocation = textRendererDiv.getBoundingClientRect().top;

        const deltaY = desiredLocation - currentLocation;

        if (!canvasTextIsFront.current) {
          bringTextCanvasFront();
          canvasTextIsFront.current = true;
          gsap
            .to(document.getElementById("text__renderer"), {
              y: deltaY,
              duration: END_TRANSITION_DURATION / 1000,
              ease: "expo.out",
            })
            .then(() => setStartSlideshow(true));
        } else {
          textRendererDiv.style.top = `${
            Number(textRendererDiv.style.top.replace("px", "")) + deltaY
          }px`;
        }
      });
    }
  }, [finished, imageHeight, height, forceEnd]);

  const [x, setX] = useState(0);

  useEffect(() => {
    let id: number | undefined = undefined;
    const callback = () => {
      if (carRenderer?.ended) {
        if (id) window.cancelAnimationFrame(id);
        return;
      }
      setX((carRenderer?.car?.position || 0) - 200);
      id = window.requestAnimationFrame(callback);
    };

    id = window.requestAnimationFrame(callback);

    return () => {
      if (id) window.cancelAnimationFrame(id);
    };
  }, [setX, carRenderer]);

  if (!carRenderer) return null;
  return (
    <div className="absolute bottom-0 w-full h-full overflow-hidden z-10">
      <div
        id="text__renderer"
        className={`absolute top-[60vh] z-10 h-max ${scene_styles["centered"]}`}
      >
        <Pill x={x} />
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
