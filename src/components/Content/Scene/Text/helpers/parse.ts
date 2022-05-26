import { FontConfigurations, FontConfigurationsProps } from "./fonts/config";
import { Positions } from "./math/coordinates";

export interface TextToBuild {
  payload: string | string[];
  fontSize: FontConfigurations;
  fontColor: FontConfigurations;
  fontFamily: FontConfigurations;
  fontPaddings: FontConfigurations;
  positions: Positions;
}

export interface Customizations {
  payload: string[] | string;
  fontSize: FontConfigurationsProps;
  color: FontConfigurationsProps;
  fontFamily: FontConfigurationsProps;
  positions: Positions;
}

export const textToBuild = ({
  color,
  fontFamily,
  fontSize,
  payload,
  positions,
}: Customizations) => {
  if (typeof payload === "string")
    return {
      payload,
      fontSize: new FontConfigurations(fontSize),
      fontColor: new FontConfigurations(color),
      fontFamily: new FontConfigurations(fontFamily),
      fontPaddings: new FontConfigurations({
        firstValueDefault: true,
        options: [Number(fontSize.options[0]) / 3],
      }),
      positions,
    } as TextToBuild;
  else {
    if (!Array.isArray(positions))
      throw new Error(
        "It seems like you mismatched the number of words and their positions. Make sure that the text position array has just as many elements as the words array"
      );
    return payload.map((payload_, index) => {
      return {
        payload: payload_,
        fontSize: new FontConfigurations(fontSize),
        fontColor: new FontConfigurations(color),
        fontFamily: new FontConfigurations(fontFamily),
        fontPaddings: new FontConfigurations({
          firstValueDefault: true,
          options: [Number(fontSize.options[0]) / 3],
        }),
        positions: positions[index] || "right",
      } as TextToBuild;
    });
  }
};

export interface ParsedText {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  positions: Positions;
}

export const parse = (textToBuild: TextToBuild | TextToBuild[]) => {
  if (Array.isArray(textToBuild)) {
    return textToBuild.map((text, index) => {
      text.fontSize.change(text.payload as string);
      text.fontColor.change(text.payload as string);
      text.fontFamily.change(text.payload as string);
      return {
        payload: text.payload,
        fontSize: text.fontSize.current,
        fontColor: text.fontColor.current,
        fontFamily: text.fontFamily.current,
        positions: text.positions,
      } as ParsedText;
    });
  } else {
    return {
      payload: textToBuild.payload as string,
      fontSize: textToBuild.fontSize.current as number,
      fontColor: textToBuild.fontColor.current as string,
      fontFamily: textToBuild.fontFamily.current as string,
      positions: textToBuild.positions,
    } as ParsedText;
  }
};
