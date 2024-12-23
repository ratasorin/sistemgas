import { pillDimensionsAtom } from "components/Content/Scene/pill";
import { useAtomValue } from "jotai";
import React, { useCallback, useState } from "react";

type Area = {
  width: number;
  height: number;
};

const Bubbles = () => {
  const pillsWidth = useAtomValue(pillDimensionsAtom);
  const [areas, setAreas] = useState<[Area, Area, Area] | undefined>();

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
    const rightBoundary = window.innerWidth / 2;

    const bottomLimit = pillBox?.top;
    const softBottomLimit;

    const R1 = {} as Area;
  }, [setAreas]);

  return <div>Bubbles</div>;
};

export default Bubbles;
