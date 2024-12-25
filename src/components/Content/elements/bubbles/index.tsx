import { Position } from "@xyflow/react";
import { sistemgasHQStartXAtom } from "components/Content/Content";
import { useGoAroundElement } from "components/Content/hooks/goAroundElements";
import {
  pillDimensionsAtom,
  startSlideshowAtom,
} from "components/Content/Scene/pill";
import { Coordinates } from "components/Content/Scene/Text/helpers/math/coordinates";
import { atom, useAtomValue } from "jotai";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Area = {
  width: number;
  height: number;
  left: number;
  top: number;
};

const MARGIN = 16; //px
const TEXT_ID = "main-text-1";

const Bubbles = () => {
  const sistemgasHQStartX = useAtomValue(sistemgasHQStartXAtom);
  const pills = useAtomValue(pillDimensionsAtom);
  const largestPillWidth = useMemo(
    () =>
      Object.values(pills).reduce(
        (prev, { width }) => (width > prev ? width : prev),
        0
      ),
    [pills]
  );

  useEffect(() => {
    console.log({ pills, largestPillWidth });
  }, [pills, largestPillWidth]);

  const [areas, setAreas] = useState<[Area, Area] | undefined>();
  const startSlideshow = useAtomValue(startSlideshowAtom);

  const computeAreas = useCallback(() => {
    const leftNavigation = document
      .getElementById("left-navigation-button")
      ?.getBoundingClientRect();
    const pillBox = document
      .getElementById("presentation-pill")
      ?.getBoundingClientRect();

    const softLeftBoundary =
      (leftNavigation?.left || 0) + (leftNavigation?.width || 0);

    const softRightBoundary = window.innerWidth / 2;
    const rightBoundary = window.innerWidth / 2 - largestPillWidth / 2;

    console.log({ rightBoundary, largestPillWidth });

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
  }, [setAreas, largestPillWidth]);

  const largestArea = useMemo(
    () =>
      areas?.reduce(
        (prev, curr) =>
          prev.height * prev.width < curr.height * curr.width ? curr : prev,
        areas[0]
      ),
    [areas]
  );

  const minDimension = useMemo(
    () =>
      (largestArea?.height || 0) > (largestArea?.width || 0)
        ? largestArea?.width || 0
        : largestArea?.height || 0,
    [largestArea]
  );

  useEffect(() => {
    if (startSlideshow) {
      computeAreas();
      window.addEventListener("resize", computeAreas);
    }
    return () => window.removeEventListener("resize", computeAreas);
  }, [computeAreas, startSlideshow]);

  const [source1, setSource1] = useState<Coordinates>({ x: 0, y: 0 });
  const source1Ref = useRef<HTMLDivElement | null>(null);

  const resizeObserver = new ResizeObserver((mutation) => {
    const rect = source1Ref.current?.getBoundingClientRect();
    const x = (rect?.x || 0) + (rect?.width || 0) / 2;
    const y = (rect?.y || 0) + (rect?.height || 0);
    setSource1({ x, y });
  });

  useEffect(() => {
    if (source1Ref.current) resizeObserver.observe(source1Ref.current);
  }, []);
  const DESIRED_X = 40;

  const path = useGoAroundElement(
    source1,
    {
      y: window.innerHeight,
      x: -(sistemgasHQStartX || 0) + DESIRED_X,
    },
    Position.Bottom,
    Position.Top,
    [TEXT_ID, "Building"]
  );

  console.log({
    source1,
    dest: { y: window.innerHeight, x: sistemgasHQStartX || 0 },
  });

  return (
    <>
      <svg
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "1",
        }}
      >
        <path
          fill="transparent"
          stroke="#FE6B7F"
          d={path}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: largestArea?.left,
          top: largestArea?.top,
          width: largestArea?.width,
          height: largestArea?.height,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={source1Ref}
          style={{
            width: 0.6 * minDimension > 52 ? 52 : 0.6 * minDimension,
            height: 0.6 * minDimension > 52 ? 52 : 0.6 * minDimension,
            border: "2px solid #FE6B7F",
            backgroundColor: "#F8E0E3",
            borderRadius: "50%",
          }}
        ></div>
      </div>
      <div
        style={{
          position: "absolute",
          left:
            window.innerWidth -
            (largestArea?.width || 0) -
            (largestArea?.left || 0),
          top: largestArea?.top,
          width: largestArea?.width,
          height: largestArea?.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 0.6 * minDimension > 52 ? 52 : 0.6 * minDimension,
            height: 0.6 * minDimension > 52 ? 52 : 0.6 * minDimension,
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        ></div>
      </div>
    </>
  );
};

export default Bubbles;
