import { TextToBuild } from "./helpers/parse";

/**
 * To customize the behavior of the font used for every text, the developer can choose to
 * pass a boolean **firstValueDefault** that indicates weather the first value passed to the options array should be
 * used as the default (meaning after all the options are exhausted, the text will have the first value),
 * or the last value should be the default one.
 *
 * The **options** array contains the customizations for the text that will be provided in the constructor.
 *
 * The **keywords** array contains the keywords that indicate where the font option should be changed. In case it is left
 * empty, we assume the user wants to change the options after every word.
 */

export interface FinalText {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  coordinates: Coordinates;
}

/**
 * The **positions** type allows a user to input either a single position, a single pair of coordinates,
 * multiple positions, multiple coordinates or a combination of positions and coordinates
 */

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

export default class CanvasText {
  text: TextToBuild | TextToBuild[];
  /**
   * To use customized text on the canvas, one can use this class to build unique combinations of proprieties
   * and payloads.
   * @param payload Can be a string or a string array with the text we want to display. The text's font,
   * color, size and positions can be customized to meet the developer wishes.
   * @param fontSize Is a **FontConfigurationsProps** type, that specifies the behaviour
   * of the font size based on the payload.
   * @param color
   * @param fontFamily
   * @param positions
   */
  constructor(
    payload: string[] | string,
    fontSize: FontConfigurationsProps,
    color: FontConfigurationsProps,
    fontFamily: FontConfigurationsProps,
    positions: Positions
  ) {
    console.log({
      payload,
      fontSize,
      color,
      fontFamily,
      positions,
    });
  }
  getFinalText(
    context: CanvasRenderingContext2D,
    initialPosition: Coordinates
  ): FinalText | FinalText[] {
    if (isTextArray(this.text)) {
      return this.text.map((text, index) => {
        text.fontSize.change(text.payload as string);
        text.fontColor.change(text.payload as string);
        text.fontFamily.change(text.payload as string);

        const { x, y } = new Position(
          {
            payload: text.payload,
            fontSize: text.fontSize.current,
            fontColor: text.fontColor.current,
            fontFamily: text.fontFamily.current,
            fontPaddings: text.fontPaddings.current,
            position: text.positions,
          } as TextToCoordinates,
          context
        ).XY[index];
        return {
          payload: text.payload as string,
          fontSize: text.fontSize.current as number,
          fontColor: text.fontColor.current as string,
          fontFamily: text.fontFamily.current as string,
          coordinates: {
            x,
            y,
          },
        };
      });
    } else {
      const { x, y } = new Position(
        {
          payload: this.text.payload,
          fontSize: this.text.fontSize.current,
          fontColor: this.text.fontColor.current,
          fontFamily: this.text.fontFamily.current,
          fontPaddings: this.text.fontPaddings.current,
          position: this.pos,
        } as TextToCoordinates,
        context
      ).XY[0];
      return {
        payload: this.text.payload as string,
        fontSize: this.text.fontSize.current as number,
        fontColor: this.text.fontColor.current as string,
        fontFamily: this.text.fontFamily.current as string,
        coordinates: {
          x,
          y,
        },
      };
    }
  }
}
