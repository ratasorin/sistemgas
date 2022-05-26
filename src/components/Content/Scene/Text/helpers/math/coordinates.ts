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

export const firstWordPosition = (
  text: CustomizedText,
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

export const getTextPosition = (
  text: CustomizedText | CustomizedText[],
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): Text | Text[] => {
  if (!Array.isArray(text))
    return {
      ...text,
      position: firstWordPosition(text, context, canvas),
    };
  return text.reduce(
    (prev, currText) => {
      const lastText = prev[prev.length - 1];
      const measurements = context.measureText(lastText.payload);
      const width =
        Math.abs(measurements.actualBoundingBoxLeft) +
        Math.abs(measurements.actualBoundingBoxRight);
      const height =
        Math.abs(measurements.actualBoundingBoxDescent) +
        Math.abs(measurements.actualBoundingBoxAscent);
      if (currText.position === "start") return prev;
      if (currText.position === "right")
        return [
          ...prev,
          {
            ...currText,
            position: {
              x: lastText.position.x + currText.fontPadding + width,
              y: lastText.position.y,
            },
          } as Text,
        ];
      if (currText.position === "newline")
        return [
          ...prev,
          {
            ...currText,
            position: {
              x: lastText.position.x,
              y: lastText.position.y + height,
            },
          } as Text,
        ];
      return prev;
    },
    [
      {
        ...text[0],
        position: firstWordPosition(text[0], context, canvas),
      } as Text,
    ]
  ) as Text[];
};

// class Position {
//   /**
//    * **coordinates** is a tuple array containing two numbers, the X and Y position of the last text displayed.
//    * These values will help us determine the position of the current text we want to display, based on a relative
//    * relationship with the last one.
//    */
//   static coordinates: Coordinates[] = [];

//   /**
//    * **textLength** is another tuple array containing the width and height of the last text displayed. Because
//    * the X and Y are considered without the width and the height of the last text, we have to add them to get the
//    * new text's X and Y.
//    */
//   static textLength: [width: number, height: number][] = [];

//   /**
//    * **newlineCoordinates** represents the x and y coordinates of the last absolute positioned element or of the
//    * last newlined element
//    */
//   static newlineCoordinates: Coordinates;

//   lastIndex: number;
//   /**
//    *  This constructor returns
//    * @param initialText The **current** text we want to display
//    * @param x The horizontal location on the canvas we want our text to be positioned at
//    * @param y The vertical location on the canvas we want our text to be positioned at
//    */
//   constructor(text: TextToCoordinates, context: CanvasRenderingContext2D) {
//     this.lastIndex = Position.coordinates.length
//       ? Position.coordinates.length - 1
//       : 0;
//     context.font = text.fontSize + "px " + `${text.fontFamily}`;

//     if (typeof text.position === "string") {
//       const currX = Position.coordinates[this.lastIndex].x;
//       const currY = Position.coordinates[this.lastIndex].y;
//       const currWidth = Position.textLength[this.lastIndex][0];
//       const currHeight = Position.textLength[this.lastIndex][1];

//       switch (text.position) {
//         case "right": {
//           Position.coordinates.push({ x: currWidth + currX, y: currY });
//           Position.textLength.push([
//             width + text.fontPaddings,
//             height + text.fontPaddings,
//           ]);
//           return;
//         }

//         case "newline": {
//           const x = Position.newlineCoordinates.x;
//           const y = currY + currHeight;
//           Position.newlineCoordinates = { x, y };
//           Position.coordinates.push({ x, y });
//           Position.textLength.push([
//             width + text.fontPaddings,
//             height + text.fontPaddings,
//           ]);
//         }
//       }
//     } else {
//       Position.newlineCoordinates = { x: text.position.x, y: text.position.y };
//       Position.coordinates.push({ x: text.position.x, y: text.position.y });
//       Position.textLength.push([
//         width + text.fontPaddings,
//         height + text.fontPaddings,
//       ]);
//     }
//   }

//   get XY(): Coordinates[] {
//     return Position.coordinates;
//   }
// }
