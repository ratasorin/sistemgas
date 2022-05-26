export type Coordinates = { x: number; y: number };
export type RelativePositions = "start" | "right" | "newline";
export type Positions =
  | RelativePositions
  | Coordinates
  | (RelativePositions | Coordinates)[];

interface TextToCoordinates {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  position: Coordinates | RelativePositions;
  fontPaddings: number;
}

class Position {
  /**
   * **coordinates** is a tuple array containing two numbers, the X and Y position of the last text displayed.
   * These values will help us determine the position of the current text we want to display, based on a relative
   * relationship with the last one.
   */
  static coordinates: Coordinates[] = [];

  /**
   * **textLength** is another tuple array containing the width and height of the last text displayed. Because
   * the X and Y are considered without the width and the height of the last text, we have to add them to get the
   * new text's X and Y.
   */
  static textLength: [width: number, height: number][] = [];

  /**
   * **newlineCoordinates** represents the x and y coordinates of the last absolute positioned element or of the
   * last newlined element
   */
  static newlineCoordinates: Coordinates;

  lastIndex: number;
  /**
   *  This constructor returns
   * @param initialText The **current** text we want to display
   * @param x The horizontal location on the canvas we want our text to be positioned at
   * @param y The vertical location on the canvas we want our text to be positioned at
   */
  constructor(text: TextToCoordinates, context: CanvasRenderingContext2D) {
    this.lastIndex = Position.coordinates.length
      ? Position.coordinates.length - 1
      : 0;
    context.font = text.fontSize + "px " + `${text.fontFamily}`;
    const measurements = context.measureText(text.payload);
    const width =
      Math.abs(measurements.actualBoundingBoxLeft) +
      Math.abs(measurements.actualBoundingBoxRight);
    const height =
      Math.abs(measurements.actualBoundingBoxDescent) +
      Math.abs(measurements.actualBoundingBoxAscent);

    if (typeof text.position === "string") {
      const currX = Position.coordinates[this.lastIndex].x;
      const currY = Position.coordinates[this.lastIndex].y;
      const currWidth = Position.textLength[this.lastIndex][0];
      const currHeight = Position.textLength[this.lastIndex][1];

      switch (text.position) {
        case "right": {
          Position.coordinates.push({ x: currWidth + currX, y: currY });
          Position.textLength.push([
            width + text.fontPaddings,
            height + text.fontPaddings,
          ]);
          return;
        }

        case "newline": {
          const x = Position.newlineCoordinates.x;
          const y = currY + currHeight;
          Position.newlineCoordinates = { x, y };
          Position.coordinates.push({ x, y });
          Position.textLength.push([
            width + text.fontPaddings,
            height + text.fontPaddings,
          ]);
        }
      }
    } else {
      Position.newlineCoordinates = { x: text.position.x, y: text.position.y };
      Position.coordinates.push({ x: text.position.x, y: text.position.y });
      Position.textLength.push([
        width + text.fontPaddings,
        height + text.fontPaddings,
      ]);
    }
  }

  get XY(): Coordinates[] {
    return Position.coordinates;
  }
}
