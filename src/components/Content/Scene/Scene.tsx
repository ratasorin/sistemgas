import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";
import { Positions } from "./Text/helpers/math/coordinates";
import TextRenderer from "./Text/Text";
import { Text } from "./Text/helpers/text";
import { useEffect, useMemo } from "react";
import CarRender, { useAnimationState } from "./Car/Car";
import { gsap } from "gsap";

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
  "text-base": 17,
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
  let fontSize: number = fonts["text-base"];
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

const Scene: NextPage<{
  width: number;
  height: number;
  imageHeight: number;
}> = ({ width, height, imageHeight }) => {
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
        "SistemgaS:",
        Math.floor(fontSize + 0.4 * fontSize),
        "#172554",
        "monospace",
        "start",
        "italic bold"
      ),
      new Text(
        "Solutia",
        Math.floor(fontSize),
        "#172554",
        "monospace",
        "newline"
      ),
      new Text(
        "alternativa",
        fontSize,
        "#f97316",
        "monospace",
        "right",
        "italic bold"
      ),
      new Text(
        "pentru",
        Math.floor(fontSize),
        "#172554",
        "monospace",
        "newline"
      ),
      new Text(
        "furnizarea",
        Math.floor(fontSize),
        "#172554",
        "monospace",
        "right"
      ),
      new Text(
        "gazelor",
        Math.floor(fontSize),
        "#172554",
        "monospace",
        "right"
      ),
      new Text(
        "naturale",
        Math.floor(fontSize),
        "#172554",
        "monospace",
        "right"
      ),
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

    console.log({
      height,
      imageHeight,
      textRenderer,
      y:
        height -
        imageHeight -
        (textRenderer.textBox?.height ||
          0 + 2 * textRenderer.averageWordPadding * 3) -
        75,
    });
    if (forceEnd) {
      gsap.to(textRenderer.textBoxCoordinates!, {
        y:
          height -
          imageHeight -
          (textRenderer.textBox?.height ||
            0 + 2 * textRenderer.averageWordPadding * 3) -
          75,
        onUpdate: () => {
          textRenderer.end();
        },
        duration: 0,
      });
    } else if (finished && imageHeight && height) {
      gsap.to(textRenderer.textBoxCoordinates!, {
        y:
          height -
          imageHeight -
          (textRenderer.textBox?.height ||
            0 + 2 * textRenderer.averageWordPadding * 3) -
          75,
        onUpdate: () => {
          textRenderer.render();
        },
        duration: 4,
        ease: "expo.out",
      });
    }
  }, [finished, imageHeight, height, forceEnd]);

  if (!textRenderer || !carRenderer) return null;
  return (
    <div className="relative w-full flex-1 overflow-hidden z-10">
      <div className="absolute w-full h-full z-10 overflow-hidden">
        <Canvas width={width} height={height} render={textRenderer}></Canvas>
      </div>
      <div className="absolute w-full h-full z-20 overflow-hidden">
        <Canvas width={width} height={height} render={carRenderer}></Canvas>
      </div>
    </div>
  );
};

export default Scene;
