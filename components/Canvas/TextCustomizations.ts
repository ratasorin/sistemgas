export interface FinalText {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  coordinates: [number, number];
}

/**
 * The **positions** type allows a user to input either a single position, a single pair of coordinates,
 * multiple positions, multiple coordinates or a combination of positions and coordinates
 */
type positions =
  | relativePositions
  | coordinates
  | (relativePositions | coordinates)[];

interface TextToBuild {
  payload: string | string[];
  fontSize: FontConfigurations;
  fontColor: FontConfigurations;
  fontFamily: FontConfigurations;
  positions: positions;
}

interface TextToCoordinates {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  position: [number, number] | string;
  padding?: number;
}

function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.some((v) => typeof v !== "string")) {
    return false;
  }

  return true;
}

function isTextArray(value: unknown): value is TextToBuild[] {
  if (!Array.isArray(value)) {
    return false;
  }
  return true;
}

class Position {
  /**
   * **coordinates** is a tuple array containing two numbers, the X and Y position of the last text displayed.
   * These values will help us determine the position of the current text we want to display, based on a relative
   * relationship with the last one.
   */
  static coordinates: [x: number, y: number][] = [];

  /**
   * **textLength** is another tuple array containing the width and height of the last text displayed. Because
   * the X and Y are considered without the width and the height of the last text, we have to add them to get the
   * new text's X and Y.
   */
  static textLength: [width: number, height: number][] = [];
  lastIndex: number;
  /**
   *  This constructor returns
   * @param initialText The **current** text we want to display
   * @param x The horizontal location on the canvas we want our text to be positioned at
   * @param y The vertical location on the canvas we want our text to be positioned at
   */
  constructor(text: TextToCoordinates, context: CanvasRenderingContext2D) {
    this.lastIndex = 0;
    context.font = text.fontSize + "px " + `${text.fontFamily}`;
    const measurements = context.measureText(text.payload);
    const width =
      Math.abs(measurements.actualBoundingBoxLeft) +
      Math.abs(measurements.actualBoundingBoxRight);
    const height =
      Math.abs(measurements.actualBoundingBoxDescent) +
      Math.abs(measurements.actualBoundingBoxAscent);

    if (typeof text.position === "string") {
      const currX = Position.coordinates[this.lastIndex][0];
      const currY = Position.coordinates[this.lastIndex][1];
      const currWidth = Position.textLength[this.lastIndex][0];
      const currHeight = Position.textLength[this.lastIndex][1];

      switch (text.position) {
        case "left": {
          Position.coordinates.push([
            currX - width - (text.padding || 0),
            currY,
          ]);
          return;
        }
        case "right": {
          Position.coordinates.push([
            currWidth + currX + (text.padding || 0),
            currY,
          ]);
          return;
        }
        case "top": {
          Position.coordinates.push([
            currX,
            currY - height - (text.padding || 0),
          ]);
          return;
        }
        case "bottom":
          {
            Position.coordinates.push([
              currX,
              currY + currHeight + (text.padding || 0),
            ]);
          }
          return;
      }
    } else {
      Position.coordinates.push([text.position[0], text.position[1]]);
    }
    Position.textLength.push([width, height]);
  }

  get XY(): [number, number][] {
    return Position.coordinates;
  }
}

class FontConfigurations {
  options = [] as (string | number)[];
  keywords: string[] | string | undefined;
  defaultValue: string | number;
  index = 0;
  /**
   * @param firstValueDefault Is a boolean used in deciding if the value used after all the options are exhausted
   * is the first value inputted or the last.
   *
   * @param options Is an array of T type values used for customizing text.
   */
  constructor(fontConfigs: FontConfigurationsProps) {
    this.options = fontConfigs.options;
    fontConfigs.firstValueDefault
      ? (this.defaultValue = this.options[this.index])
      : (this.defaultValue = this.options[this.options.length]);

    this.keywords = fontConfigs.keywords;
  }

  find(word: string) {
    if (!this.keywords) return false;
    if (typeof this.keywords === "string" && this.keywords === word) {
      return true;
    }
    if (isStringArray(this.keywords)) {
      return this.keywords.find((keyword) => keyword === word) === undefined
        ? false
        : true;
    }
  }

  change(word: string): void {
    if (this.find(word)) {
      this.index++;
    }
  }

  get current() {
    if (this.index === this.options.length) return this.defaultValue;
    return this.options[this.index];
  }
}
type relativePositions = "top" | "bottom" | "left" | "right";
type coordinates = [number, number];

export default class CanvasText {
  text: TextToBuild | TextToBuild[];
  constructor(
    payload: string[] | string,
    fontSize: FontConfigurationsProps,
    color: FontConfigurationsProps,
    fontFamily: FontConfigurationsProps,
    positions: positions
  ) {
    if (typeof payload === "string")
      this.text = {
        payload,
        fontSize: new FontConfigurations(fontSize),
        fontColor: new FontConfigurations(color),
        fontFamily: new FontConfigurations(fontFamily),
        positions,
      };
    else {
      this.text = payload.map((payload_, index) => {
        return {
          payload: payload_,
          fontSize: new FontConfigurations(fontSize),
          fontColor: new FontConfigurations(color),
          fontFamily: new FontConfigurations(fontFamily),
          positions: positions[index] || "right",
        } as TextToBuild;
      });
    }
  }
  getFinalText(context: CanvasRenderingContext2D): FinalText | FinalText[] {
    if (isTextArray(this.text)) {
      return this.text.map((text, index) => {
        text.fontSize.change(text.payload as string);
        text.fontColor.change(text.payload as string);
        text.fontFamily.change(text.payload as string);
        return {
          payload: text.payload as string,
          fontSize: text.fontSize.current as number,
          fontColor: text.fontColor.current as string,
          fontFamily: text.fontFamily.current as string,
          coordinates: new Position(
            {
              payload: text.payload,
              fontSize: text.fontSize.current,
              fontColor: text.fontColor.current,
              fontFamily: text.fontFamily.current,
              position: text.positions,
            } as TextToCoordinates,
            context
          ).XY[index],
        };
      });
    } else
      return {
        payload: this.text.payload as string,
        fontSize: this.text.fontSize.current as number,
        fontColor: this.text.fontColor.current as string,
        fontFamily: this.text.fontFamily.current as string,
        coordinates: new Position(
          {
            payload: this.text.payload,
            fontSize: this.text.fontSize.current,
            fontColor: this.text.fontColor.current,
            fontFamily: this.text.fontFamily.current,
            position: this.text.positions,
          } as TextToCoordinates,
          context
        ).XY[0],
      };
  }
}

interface FontConfigurationsProps {
  firstValueDefault: boolean;
  options: (string | number)[];
  keywords?: string | string[];
}
