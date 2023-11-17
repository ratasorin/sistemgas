export type RelativePositions = "right" | "newline" | "start";
export type Styles =
  | "bold"
  | "italic"
  | "underline"
  | "bold italic"
  | "italic bold";

export class Text {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontPadding: { x: number; y: number };
  fontStyle: Styles | undefined;
  position: RelativePositions | undefined;

  constructor(
    payload: string,
    fontSize: number,
    fontColor: string,
    fontFamily: string,
    position?: RelativePositions,
    fontStyle?: Styles
  ) {
    this.payload = payload;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.fontPadding = { x: fontSize / 3, y: fontSize / 2.5 };
    this.position = position;
    this.fontStyle = fontStyle;
  }
}
