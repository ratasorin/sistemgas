import { pillDimensionsAtom } from "components/Content/Scene/pill";
import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useState } from "react";

type Area = {
  width: number;
  height: number;
  left: number;
  top: number;
};

const MARGIN = 16; //px

const Bubbles = () => {
  const [areas, setAreas] = useState<[Area, Area] | undefined>();

  const computeAreas = useCallback(() => {
    const leftNavigation = document
      .getElementById("left-navigation-button")
      ?.getBoundingClientRect();
    const pillBox = document
      .getElementById("presentation-pill")
      ?.getBoundingClientRect();

    const softLeftBoundary =
      (leftNavigation?.left || 0) + (leftNavigation?.width || 0);
    const leftBoundary = leftNavigation?.left || 0;
    const softRightBoundary = window.innerWidth / 2;
    const rightBoundary = pillBox?.left || 0;

    const bottomLimit = pillBox?.top || 0;
    const softBottomLimit = (pillBox?.top || 0) + (pillBox?.height || 0);

    const R1 = {
      width: Math.abs(softLeftBoundary - rightBoundary),
      height: Math.abs(softBottomLimit - MARGIN),
      top: MARGIN,
      left: softLeftBoundary,
    } as Area;

    const R2 = {
      width: Math.abs(softLeftBoundary - softRightBoundary),
      height: Math.abs(bottomLimit - MARGIN),
      top: MARGIN,
      left: softLeftBoundary,
    };
    console.log({ R1, R2 });

    setAreas([R1, R2]);
  }, [setAreas]);

  useEffect(() => {
    window.addEventListener("resize", computeAreas);
    return () => window.removeEventListener("resize", computeAreas);
  }, []);

  console.log({ areas });

  return areas?.map((area, index) => (
    <div
      style={{
        position: "absolute",
        left: area.left,
        top: area.top,
        width: area.width,
        height: area.height,
        zIndex: 100,
        backgroundColor: `rgba(${index * 100}, 255, 255)`,
      }}
    ></div>
  ));
};

export default Bubbles;
