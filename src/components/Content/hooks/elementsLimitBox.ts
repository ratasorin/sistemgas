import { atom } from "jotai";

type ElementsForMeasure = "navbar" | "building" | "pill";
type PropertiesToBeMeasured = {
  maxWidth: number; // this could also be a regular width, for elements that don't change it
  maxHeight: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};
type ElementsMeasurement = Record<ElementsForMeasure, PropertiesToBeMeasured>;

const elementsLimitBox = atom<ElementsMeasurement | undefined>(undefined);
