import { RelativePositions, Text } from "../text";

export type Coordinates = { x: number; y: number };
export type Positions =
  | RelativePositions
  | Coordinates
  | (RelativePositions | Coordinates)[];

export interface Dimensions {
  width: number;
  height: number;
}

export type TextWithCoordinates = Text & { coordinates: Coordinates };
type Line = {
  width: number;
  startIndex: number;
};

export const getTextDimensions = (
  text: Text[],
  context: CanvasRenderingContext2D
): Dimensions & { lines: Line[] } => {
  let biggestHeight = 0;
  let lineWidth = 0;
  let start = -1;
  const lines: Line[] = [];
  let { height, maxWidth, width } = text.reduce(
    (prev, text_, index) => {
      context.font = `${text_.fontStyle ? text_.fontStyle : ""} ${
        text_.fontSize
      }px ${text_.fontFamily}`;
      const metrics = context.measureText(
        (text_.position === "right" || text_.position === "newline") &&
          index < text.length
          ? `${text_.payload} `
          : (text_.payload as string)
      );
      const fontWidth = metrics.width;
      const fontHeight =
        Math.abs(metrics.actualBoundingBoxDescent) +
        Math.abs(metrics.actualBoundingBoxAscent);

      if (
        index > 0 &&
        (text[index - 1].position === "newline" ||
          text[index - 1].position === "start")
      ) {
        biggestHeight = 0;
      }

      if (fontHeight > biggestHeight) biggestHeight = fontHeight;

      const position = text_.position as RelativePositions;
      if (position === "start") {
        lineWidth += fontWidth;
        start = index;
        return {
          maxWidth: fontWidth,
          width: fontWidth,
          height: prev.height + biggestHeight + text_.fontPadding.y,
        };
      }
      if (position === "right") {
        const paddingX = index < text.length ? text_.fontPadding.x : 0;
        lineWidth += fontWidth + paddingX;
        return {
          maxWidth: prev.maxWidth,
          width: prev.width + fontWidth + paddingX,
          height: prev.height,
        };
      }

      if (position === "newline") {
        lines.push({ startIndex: start, width: lineWidth });
        lineWidth = fontWidth;
        start = index;
        if (text.slice(index + 1).find((t) => t.position === "newline")) {
          return {
            maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
            width: fontWidth + text_.fontPadding.x,
            height: prev.height + biggestHeight + text_.fontPadding.y,
          };
        } else
          return {
            maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
            width: fontWidth + text_.fontPadding.x,
            height: prev.height + biggestHeight,
          };
      }
      return prev;
    },
    {
      maxWidth: 0,
      width: 0,
      height: 0,
    }
  );

  lines.push({ startIndex: start, width: lineWidth });

  return {
    width: maxWidth > width ? maxWidth : width,
    height,
    lines,
  };
};
