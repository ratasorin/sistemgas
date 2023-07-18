import { useAppSelector } from "hooks/redux";
import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";
import { Positions } from "./Text/helpers/math/coordinates";
import TextRenderer from "./Text/Text";
import { Text } from "./Text/helpers/text";
import { useMemo } from "react";
import CarRender from "./Car/Car";

export interface Render {
  render: () => void;
  update: () => void;
  initializeCanvas: (canvas: HTMLCanvasElement) => void;
  dimensions?: (
    coordinates: Positions
  ) => { width: number; height: number } | Error;
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

const Scene: NextPage<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const blur = useAppSelector(({ blur }) => blur);

  const text = useMemo(() => {
    let fontSize: number = fonts["text-lg"];
    if (width > screens["sm"] && width < screens["md"])
      fontSize = fonts["text-xl"];
    if (width > screens["md"] && width < screens["lg"])
      fontSize = fonts["text-3xl"];
    if (width > screens["lg"] && width < screens["xl"])
      fontSize = fonts["text-5xl"];
    if (width > screens["xl"] && width < screens["2xl"])
      fontSize = fonts["text-7xl"];
    if (width > screens["2xl"]) fontSize = fonts["text-7xl"];
    return [
      new Text("Solutia", fontSize, "#172554", "monospace"),
      new Text(
        "alternativa",
        fontSize,
        "#f97316",
        "monospace",
        "right",
        "italic bold"
      ),
      new Text("pentru", fontSize, "#172554", "monospace", "newline"),
      new Text("furnizarea", fontSize, "#172554", "monospace", "right"),
      new Text("gazelor", fontSize, "#172554", "monospace", "right"),
      new Text("naturale", fontSize, "#172554", "monospace", "right"),
    ];
  }, [width]);

  const image = useMemo(() => {
    const image = new Image() as HTMLImageElement;
    image.src = "/gas_truck.svg";
    return image;
  }, []);

  return (
    <div className="relative w-full flex-1 overflow-hidden z-10">
      <div className="absolute w-full h-full z-20 overflow-hidden">
        <Canvas
          width={width}
          height={height}
          render={new TextRenderer(text, image)}
        ></Canvas>
      </div>
      {blur ? (
        <div className="absolute w-full h-full overflow-hidden blur-sm z-0">
          <Canvas
            width={width}
            height={height}
            render={new CarRender(image.width, image)}
          ></Canvas>
        </div>
      ) : (
        <div className="absolute w-full h-full z-20 overflow-hidden">
          <Canvas
            width={width}
            height={height}
            render={new CarRender(image.width, image)}
          ></Canvas>
        </div>
      )}
    </div>
  );
};

export default Scene;
