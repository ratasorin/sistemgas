import { Text } from "../text";

export type Coordinates = { x: number; y: number };
export type RelativePositions = "start" | "right" | "newline";
export type Positions =
  | RelativePositions
  | Coordinates
  | (RelativePositions | Coordinates)[];

interface Dimensions {
  width: number;
  height: number;
}

export type TextWithCoordinates = Text & { coordinates: Coordinates };

export const getTextDimensions = (
  text: Text[],
  context: CanvasRenderingContext2D
): Dimensions => {
  console.log({ text });

  const { height, maxWidth, width } = text.reduce(
    (prev, text_) => {
      context.font = `${text_.fontSize}px ${text_.fontFamily}`;
      const metrics = context.measureText(text_.payload as string);
      const fontWidth = metrics.width;
      const fontHeight =
        metrics.actualBoundingBoxAscent + metrics.fontBoundingBoxDescent;

      const position = text_.position as RelativePositions;
      if (position === "start")
        return {
          maxWidth: fontWidth,
          width: fontWidth,
          height: prev.height + fontHeight,
        };
      if (position === "right")
        return {
          maxWidth: prev.maxWidth,
          width: prev.width + fontWidth + text_.fontPadding,
          height: prev.height,
        };

      if (position === "newline")
        return {
          maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
          width: fontWidth,
          height: prev.height + fontHeight,
        };

      return prev;
    },
    {
      maxWidth: 0,
      width: 0,
      height: 0,
    }
  );

  return {
    width: maxWidth > width ? maxWidth : width,
    height,
  };
};

export const getFirstWordPosition = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions
) => {
  const textDimensions = getTextDimensions(text, context);
  const coordinates = {
    x: canvasDimensions.width / 2 - textDimensions.width / 2,
    y: canvasDimensions.height / 2 - textDimensions.height / 2,
  } as Coordinates;
  console.log(
    { textDimensions },
    {
      canvasWidth: canvasDimensions.width,
      canvasHeight: canvasDimensions.height,
    }
  );
  return coordinates;
};

export const textWithAbsoluteCoordinates = (
  text: Text[],
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): TextWithCoordinates[] => {
  const firstWordCoordinates = getFirstWordPosition(text, context, canvas);
  return text.reduce(
    (prev, currText) => {
      const lastText = prev.text[prev.text.length - 1];
      const measurements = context.measureText(lastText.payload);
      const width =
        Math.abs(measurements.actualBoundingBoxLeft) +
        Math.abs(measurements.actualBoundingBoxRight);
      const height =
        Math.abs(measurements.actualBoundingBoxDescent) +
        Math.abs(measurements.actualBoundingBoxAscent);

      // if no relative position was provided, this is the first text
      if (!currText.position) return prev;
      if (currText.position === "right")
        return {
          ...prev,
          text: [
            ...prev.text,
            {
              ...currText,
              coordinates: {
                x: lastText.coordinates.x + width + currText.fontPadding,
                y: lastText.coordinates.y,
              },
            },
          ],
        };
      if (currText.position === "newline")
        return {
          start: {
            x: prev.start.x,
            y: 0,
          },
          text: [
            ...prev.text,
            {
              ...currText,
              coordinates: {
                x: prev.start.x,
                y: prev.start.y + height + currText.fontPadding,
              },
            },
          ],
        };
      return prev;
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
