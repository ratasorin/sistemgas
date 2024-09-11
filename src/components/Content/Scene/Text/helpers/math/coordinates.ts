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

export const getFirstWordPosition = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions,
  carDisplayHeight: number
) => {
  const textDimensions = getTextDimensions(text, context);
  const coordinates = {
    x: canvasDimensions.width / 2 - textDimensions.width / 2,
    y:
      (canvasDimensions.height -
        carDisplayHeight +
        (2 / 7) * canvasDimensions.height +
        textDimensions.height) /
        2 +
      (1 / 10) * carDisplayHeight,
  } as Coordinates;
  return coordinates;
};

export const textWithAbsoluteCoordinates = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions,
  carDisplayHeight: number
): TextWithCoordinates[] => {
  const firstWordCoordinates = getFirstWordPosition(
    text,
    context,
    canvasDimensions,
    carDisplayHeight
  );

  const textDimensions = getTextDimensions(text, context);
  const trueFirstWordCoordinates = { ...firstWordCoordinates };

  firstWordCoordinates.x =
    firstWordCoordinates.x +
    (textDimensions.width / 2 - textDimensions.lines[0].width / 2);

  return text.reduce(
    (prev, currText, index) => {
      // if no relative position was provided, this is the first text
      if (currText.position === "start" || !currText.position) return prev;

      const lastText = prev.text[prev.text.length - 1];
      context.font = `${lastText.fontStyle ? lastText.fontStyle : ""} ${
        lastText.fontSize
      }px ${lastText.fontFamily}`;
      const measurements = context.measureText(
        (lastText.position === "right" || lastText.position === "newline") &&
          index < text.length
          ? `${lastText.payload} `
          : (lastText.payload as string)
      );
      const width = measurements.width;
      const height =
        Math.abs(measurements.actualBoundingBoxDescent) +
        Math.abs(measurements.actualBoundingBoxAscent);

      if (currText.position === "right")
        return {
          ...prev,
          text: [
            ...prev.text,
            {
              ...currText,
              coordinates: {
                x: lastText.coordinates.x + width + lastText.fontPadding.x,
                y: lastText.coordinates.y,
              },
            },
          ],
        };
      if (currText.position === "newline") {
        return {
          ...prev,
          start: {
            x: prev.start.x,
            y: prev.start.y + height + lastText.fontPadding.y,
          },
          prevText: currText,
          text: [
            ...prev.text,
            {
              ...currText,
              coordinates: {
                x:
                  prev.trueStartX +
                  (textDimensions.width / 2 -
                    (textDimensions.lines.find((l) => l.startIndex === index)
                      ?.width || 0) /
                      2),
                y: prev.start.y + height + lastText.fontPadding.y,
              },
            },
          ],
        };
      }

      return { ...prev, prevText: currText };
    },
    {
      text: [
        {
          ...text[0],
          coordinates: firstWordCoordinates,
        },
      ],
      start: firstWordCoordinates,
      trueStartX: trueFirstWordCoordinates.x,
    }
  ).text;
};
