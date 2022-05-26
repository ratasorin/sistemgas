import { CustomizedText } from "../customize";

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

export const getTextDimensions = (
  text: CustomizedText | CustomizedText[],
  context: CanvasRenderingContext2D
): Dimensions => {
  console.log({ text });
  if (!Array.isArray(text)) {
    if (Array.isArray(text.position))
      throw new Error(
        "You cannot provide an array of positions for a single word"
      );
    context.font = `${text.fontSize}px ${text.fontFamily}`;
    const { fontBoundingBoxDescent, fontBoundingBoxAscent, width } =
      context.measureText(text.payload as string);

    return {
      width,
      height: fontBoundingBoxAscent + fontBoundingBoxDescent,
    };
  } else {
    const { height, maxWidth, width } = text.reduce(
      (prev, text_, index) => {
        context.font = `${text_.fontSize}px ${text_.fontFamily}`;
        const metrics = context.measureText(text_.payload as string);
        const fontWidth = metrics.width;
        const fontHeight =
          metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

        if (index === 0)
          return {
            maxWidth: fontWidth,
            width: fontWidth,
            height: prev.height + fontHeight,
          };
        const position = text_.position as RelativePositions;
        if (position === "right")
          return {
            maxWidth: prev.maxWidth,
            width: prev.width + fontWidth,
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
  }
};

export const getFirstWordPosition = (
  text: CustomizedText | CustomizedText[],
  context: CanvasRenderingContext2D,
  canvasDimensions: Dimensions
) => {
  const textDimensions = getTextDimensions(text, context);
  const coordinates = {
    x: canvasDimensions.width / 2 - textDimensions.width / 2,
    y: canvasDimensions.height / 2 - textDimensions.height / 2,
  } as Coordinates;
  console.log({ textDimensions });
  return coordinates;
};

export interface Text {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontPadding: number;
  position: Coordinates;
}

interface Reducer {
  text: Text[];
  start: Coordinates;
}

export const getTextPosition = (
  text: CustomizedText | CustomizedText[],
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): Text | Text[] => {
  console.log({ text });
  if (!Array.isArray(text))
    return {
      ...text,
      position: getFirstWordPosition(text, context, canvas),
    };

  const firstWordPosition = getFirstWordPosition(text, context, canvas);
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
      if (currText.position === "start") return prev;
      if (currText.position === "right")
        return {
          ...prev,
          text: [
            ...prev.text,
            {
              ...currText,
              position: {
                x: lastText.position.x + currText.fontPadding + width,
                y: lastText.position.y,
              },
            } as Text,
          ],
        };
      if (currText.position === "newline")
        return {
          start: {
            x: prev.start.x,
            y: prev.start.y + height,
          },
          text: [
            ...prev.text,
            {
              ...currText,
              position: {
                x: prev.start.x,
                y: prev.start.y + height,
              },
            } as Text,
          ],
        };
      return prev;
    },
    {
      text: [
        {
          ...text[0],
          position: firstWordPosition,
        } as Text,
      ],
      start: firstWordPosition,
    }
  ).text;
};
