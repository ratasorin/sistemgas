export type RelativePositions = "right" | "newline" | "start";
export type FontDecoration = "italic" | "underline";
export type FontSize =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "bold";

export type Styles = `${FontSize} ${FontDecoration}` | FontSize;

export class Text {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontPadding: { x: number; y: number };
  fontStyle: Styles | undefined;
  position: RelativePositions | undefined;

  constructor(settings: {
    payload: string;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    position?: RelativePositions;
    fontStyle?: Styles;
    fontPadding?: { x: number; y: number };
  }) {
    this.payload = settings.payload;
    this.fontSize = settings.fontSize;
    this.fontColor = settings.fontColor;
    this.fontFamily = settings.fontFamily;
    this.fontPadding = {
      x: settings.fontPadding?.x || 0,
      y:
        Math.ceil(settings.fontSize / 3.5) +
        (settings.fontPadding ? settings.fontPadding?.y : 0),
    };
    this.position = settings.position;
    this.fontStyle = settings.fontStyle;
  }
}
