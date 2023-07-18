export type Positions = "right" | "newline";
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
  fontPadding: number;
  fontStyle: Styles | undefined;
  position: Positions | undefined;

  constructor(
    payload: string,
    fontSize: number,
    fontColor: string,
    fontFamily: string,
    position?: Positions,
    fontStyle?: Styles
  ) {
    this.payload = payload;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.fontPadding = fontSize / 3;
    this.position = position;
    this.fontStyle = fontStyle;
  }
}
