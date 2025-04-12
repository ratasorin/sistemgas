import React, { useRef } from "react";
import { Position } from "@xyflow/react";
import { useGoAroundElement } from "components/Content/hooks/goAroundElements";
import { useEffect, useState, useCallback } from "react";
import { createAnimationImplementation } from "lib/animation/manage";

export interface Coordinates {
  x: number;
  y: number;
}

const MAX_LENGTH = 10_000;
export const useDynamicCoordinates = (
  elementRef: Element | null,
  initialOffset: Coordinates
) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0,
  });

  const updateCoordinates = useCallback(() => {
    if (!elementRef) return;

    const rect = elementRef.getBoundingClientRect();

    setCoordinates({
      x: rect.left + initialOffset.x,
      y: rect.top + initialOffset.y,
    });
  }, [initialOffset, elementRef]);

  useEffect(() => {
    updateCoordinates();
    window.addEventListener("resize", updateCoordinates);
    window.addEventListener("scroll", updateCoordinates, true);
    return () => {
      window.removeEventListener("resize", updateCoordinates);
      window.removeEventListener("scroll", updateCoordinates, true);
    };
  }, [updateCoordinates]);

  return coordinates;
};

interface GradientProps {
  id: string;
  defs: React.ReactNode;
}

interface PathConnectorProps {
  startRef: Element | null;
  endRef: Element | null;
  startOffset?: Coordinates;
  endOffset?: Coordinates;
  elementsToDodge: string[];
  strokeWidth?: number;
  gradient?: GradientProps; // Custom gradient definition
}

const PathConnector: React.FC<PathConnectorProps> = ({
  startRef,
  endRef,
  startOffset = { x: 0, y: 0 },
  endOffset = { x: 0, y: 0 },
  elementsToDodge,
  strokeWidth = 2,
  gradient,
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);

  const startCoordinates = useDynamicCoordinates(startRef, startOffset);
  const endCoordinates = useDynamicCoordinates(endRef, endOffset);

  const pathData = useGoAroundElement(
    startCoordinates,
    endCoordinates,
    Position.Bottom,
    Position.Top,
    elementsToDodge
  );

  const createdAnimationImplementation = useRef(false);

  useEffect(() => {
    console.log({ pathData });
    if (
      !pathData ||
      pathData === "M0,0 L0,0" ||
      createdAnimationImplementation.current
    )
      return;

    createdAnimationImplementation.current = true;
    createAnimationImplementation(
      "pipes",
      (duration, triggerNext) => {
        return new Promise((resolve) => {
          if (pathRef.current && pathData) {
            const path = pathRef.current;
            const length = pathRef.current.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            path.getBoundingClientRect();

            requestAnimationFrame(() => {
              path.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
              path.style.strokeDashoffset = "0";
            });

            setTimeout(() => {
              path.style.strokeDasharray = "0";
              resolve([]);
            }, triggerNext || duration);
          }
        });
      },
      true
    );
  }, [pathData]);

  return (
    <svg
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <defs>{gradient?.defs}</defs>

      <path
        style={{
          strokeDasharray: MAX_LENGTH,
          strokeDashoffset: MAX_LENGTH,
        }}
        ref={pathRef}
        d={pathData || ""}
        stroke={gradient ? `url(#${gradient.id})` : "#FE6B7F"} // Default solid color if no gradient
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PathConnector;
