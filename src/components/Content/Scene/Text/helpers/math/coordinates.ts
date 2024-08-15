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

export const getTextDimensions = (
  text: Text[],
  context: CanvasRenderingContext2D
): Dimensions => {
  console.log({ text });

  let biggestHeight = 0;
  const { height, maxWidth, width } = text.reduce(
    (prev, text_, index) => {
      context.font = `${text_.fontStyle ? text_.fontStyle : ""} ${
        text_.fontSize
      }px ${text_.fontFamily}`;
      const metrics = context.measureText(text_.payload as string);
      const fontWidth = metrics.width;
      const fontHeight =
        Math.abs(metrics.actualBoundingBoxDescent) +
        Math.abs(metrics.actualBoundingBoxAscent);

      if (
        index > 0 &&
        (text[index - 1].position === "newline" ||
          text[index - 1].position === "start")
      )
        biggestHeight = 0;

      if (fontHeight > biggestHeight) biggestHeight = fontHeight;

      console.log({ height: prev.height });

      const position = text_.position as RelativePositions;
      if (position === "start")
        return {
          maxWidth: fontWidth,
          width: fontWidth,
          height: prev.height + biggestHeight + text_.fontPadding.y,
        };
      if (position === "right")
        return {
          maxWidth: prev.maxWidth,
          width: prev.width + fontWidth + text_.fontPadding.x,
          height: prev.height,
        };

      if (position === "newline") {
        if (text.slice(index + 1).find((t) => t.position === "newline")) {
          return {
            maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
            width: fontWidth,
            height: prev.height + biggestHeight + text_.fontPadding.y,
          };
        } else
          return {
            maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
            width: fontWidth,
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

  console.log({ height });

  return {
    width: maxWidth > width ? maxWidth : width,
    height,
  };
};

export const getFirstWordPosition = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions,
  carHeightFactor: number,
  carDisplayHeight: number
) => {
  const textDimensions = getTextDimensions(text, context);
  const coordinates = {
    x: canvasDimensions.width / 2 - textDimensions.width / 2,
    y:
      canvasDimensions.height / (0.95 + carHeightFactor) -
      carDisplayHeight / (0.95 + carHeightFactor) +
      (carDisplayHeight - textDimensions.height) / 2,
  } as Coordinates;
  return coordinates;
};

export const textWithAbsoluteCoordinates = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions,
  carHeightFactor: number,
  carDisplayHeight: number
): TextWithCoordinates[] => {
  const firstWordCoordinates = getFirstWordPosition(
    text,
    context,
    canvasDimensions,
    carHeightFactor,
    carDisplayHeight
  );
  return text.reduce(
    (prev, currText, index) => {
      // if no relative position was provided, this is the first text
      if (currText.position === "start" || !currText.position) return prev;

      const lastText = prev.text[prev.text.length - 1];
      context.font = `${lastText.fontStyle ? lastText.fontStyle : ""} ${
        lastText.fontSize
      }px ${lastText.fontFamily}`;
      const measurements = context.measureText(lastText.payload);
      const width = measurements.width;
      const height =
        Math.abs(measurements.actualBoundingBoxDescent) +
        Math.abs(measurements.actualBoundingBoxAscent);

      console.log(lastText.payload, height);

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
                x: prev.start.x,
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
    }
  ).text;
};
