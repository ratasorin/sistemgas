import { Position } from "@xyflow/react";
import bubbles_styles from "./index.module.css";
import { sistemgasHQBBoxAtom } from "components/Content/Content";
import { getTextTrueBBox } from "components/Content/hooks/getTextTrueBBox";
import { useGoAroundElement } from "components/Content/hooks/goAroundElements";
import {
  pillDimensionsAtom,
  startSlideshowAtom,
} from "components/Content/Scene/pill";
import { Coordinates } from "components/Content/Scene/Text/helpers/math/coordinates";
import { atom, useAtomValue, useSetAtom } from "jotai";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import GlowingPath from "./svg-glow";
import { useAnimationState } from "components/Content/Scene/Car/Car";

type Area = {
  width: number;
  height: number;
  left: number;
  top: number;
};

const MARGIN = 16; //px
const TEXT_ID = "main-text";

const useAreas = () => {
  const pills = useAtomValue(pillDimensionsAtom);
  const [areas, setAreas] = useState<[Area, Area] | undefined>();
  const largestPillWidth = useMemo(
    () =>
      Object.values(pills).reduce(
        (prev, { width }) => (width > prev ? width : prev),
        0
      ),
    [pills]
  );

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

  return { minDimension, largestArea, computeAreas };
};

interface ComputePathAroundProps {
  elementsId: string[];
  source: MutableRefObject<HTMLDivElement | null>;
  destination: { x: number; y: number };
  sourcePosition?: Position;
  destinationPosition?: Position;
}

export const computePathAround = ({
  elementsId,
  source,
  destination,
  sourcePosition = Position.Bottom,
  destinationPosition = Position.Top,
}: ComputePathAroundProps) => {
  const [sourceCoordinates, setSourceCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0,
  });
  const sistemgasHQBBox = useAtomValue(sistemgasHQBBoxAtom); // general offset

  const elementResizer = new ResizeObserver((mutation) => {
    const rect = source.current?.getBoundingClientRect();
    const x = (rect?.x || 0) + (rect?.width || 0) / 2;
    const y = (rect?.y || 0) + (rect?.height || 0);
    setSourceCoordinates({ x, y });
  });

  useEffect(() => {
    if (source.current) elementResizer.observe(source.current);
  }, [destination]);

  const destinationCoordinates = useMemo(() => {
    return {
      y: destination.y,
      x: -(sistemgasHQBBox?.scrollLeft || 0) + destination.x,
    };
  }, [destination, sistemgasHQBBox]);

  const path = useGoAroundElement(
    sourceCoordinates,
    destinationCoordinates,
    sourcePosition,
    destinationPosition,
    elementsId
  );

  return path;
};

export const bubblesDimensionAtom = atom(0);
const Bubbles = () => {
  const startSlideshow = useAtomValue(startSlideshowAtom);
  const { minDimension, largestArea, computeAreas } = useAreas();
  const sistemgasHQBBox = useAtomValue(sistemgasHQBBoxAtom);
  const setBubblesDimension = useSetAtom(bubblesDimensionAtom);

  useEffect(() => {
    setBubblesDimension(
      FACTOR * minDimension > 52 ? 52 : FACTOR * minDimension
    );
  }, [minDimension]);

  useEffect(() => {
    if (startSlideshow) {
      computeAreas();
      window.addEventListener("resize", computeAreas);
    }
    return () => window.removeEventListener("resize", computeAreas);
  }, [computeAreas, startSlideshow]);

  const leftmostBubble = useRef<HTMLDivElement | null>(null);
  const rightmostBubble = useRef<HTMLDivElement | null>(null);

  const leftmostPathElement = useRef<SVGPathElement | null>(null);
  const leftmostPathElementGlow = useRef<SVGPathElement | null>(null);
  const rightmostPathElement = useRef<SVGPathElement | null>(null);
  const rightmostPathElementGlow = useRef<SVGPathElement | null>(null);
  useEffect(() => {
    console.log({ element: leftmostPathElementGlow.current });
    leftmostPathElement.current?.classList.add(bubbles_styles["hide-path"]);
    leftmostPathElementGlow.current?.classList.add(bubbles_styles["hide-path"]);
    rightmostPathElement.current?.classList.add(bubbles_styles["hide-path"]);
    rightmostPathElementGlow.current?.classList.add(
      bubbles_styles["hide-path"]
    );

    if (startSlideshow) {
      leftmostPathElement.current?.classList.add(bubbles_styles["reveal-path"]);
      leftmostPathElementGlow.current?.classList.add(
        bubbles_styles["reveal-path"]
      );
      rightmostPathElement.current?.classList.add(
        bubbles_styles["reveal-path"]
      );
      rightmostPathElementGlow.current?.classList.add(
        bubbles_styles["reveal-path"]
      );
    }
  }, [startSlideshow]);

  const textTrueBBoxIds = useMemo(
    () => getTextTrueBBox(TEXT_ID),
    [startSlideshow]
  );

  const leftmostPath = computePathAround({
    elementsId: [...textTrueBBoxIds, "Building"],
    destination: { x: 10, y: window.innerHeight },
    source: leftmostBubble,
  });

  const rightmostPath = computePathAround({
    elementsId: [...textTrueBBoxIds, "Building"],
    destination: {
      x: (sistemgasHQBBox?.width || 0) - 10,
      y: window.innerHeight,
    },
    source: rightmostBubble,
  });

  const FACTOR = 0.68;

  return (
    <div style={{ visibility: startSlideshow ? "visible" : "hidden" }}>
      <GlowingPath
        reference={leftmostPathElementGlow}
        pathData={leftmostPath || ""}
        color="#FE6B7F"
      />
      <svg
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "4",
        }}
      >
        <path
          fill="transparent"
          stroke="#FE6B7F"
          d={leftmostPath}
          strokeWidth={2}
          ref={leftmostPathElement}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <GlowingPath
        reference={rightmostPathElementGlow}
        pathData={rightmostPath || ""}
        color="#91CEFF"
      />
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
          stroke="#91CEFF"
          d={rightmostPath}
          strokeWidth={2}
          ref={rightmostPathElement}
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
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={leftmostBubble}
          style={{
            width: FACTOR * minDimension > 52 ? 52 : FACTOR * minDimension,
            height: FACTOR * minDimension > 52 ? 52 : FACTOR * minDimension,
            border: "2px solid #FE6B7F",
            backgroundColor: "#FFECEF",
            filter: `url(#line-glow)`, // Apply the filter to the div

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
          zIndex: 1,
        }}
      >
        <div
          ref={rightmostBubble}
          style={{
            width: FACTOR * minDimension > 52 ? 52 : FACTOR * minDimension,
            height: FACTOR * minDimension > 52 ? 52 : FACTOR * minDimension,
            border: "2px solid #91CEFF",
            backgroundColor: "#F1F8FF",
            borderRadius: "50%",
            filter: `url(#line-glow)`, // Apply the filter to the div
          }}
        >
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Bubbles;
