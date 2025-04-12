import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationState } from "../Scene/Car/Car";
import { END_TRANSITION_DURATION } from "constant";
import { createAnimationImplementation } from "lib/animation/manage";

const AnimatedBackground: FC<{
  baseClassName: string;
  speed: number;
  transitionDown?: boolean;
  widthType: "--background-svg-width" | "--road-svg-width";
  zoomOut?: number;
  origin?: string;
}> = ({ baseClassName, speed, widthType, transitionDown, zoomOut, origin }) => {
  const { forceEnd } = useAnimationState();
  const animationRef = useRef<Animation | undefined>(undefined);
  const elementRef = useRef<HTMLDivElement | undefined>(undefined);
  const width = useMemo(
    () =>
      widthType === "--background-svg-width"
        ? `calc(-1 * var(${widthType}))`
        : `calc(-1 * var(${widthType}))`,
    [widthType]
  );

  const isEndAnimationRunning = useRef(false);
  const createdAnimationImplementation = useRef(false);

  useEffect(() => {
    if(!createdAnimationImplementation.current) {
      createAnimationImplementation("hit-breaks", (duration, triggerNext) => {
        return new Promise((resolve) => {
          window.requestAnimationFrame(() => {
          animationRef.current!.pause();
          const element = elementRef.current;
          if(!element) return;

          let translateX = new DOMMatrixReadOnly(
            window.getComputedStyle(element).getPropertyValue("transform")
          ).m41;

          element.setAttribute(
            "style",
            `transform: translateX(0); left: calc(${translateX}px);`
          );

          animationRef.current = element.animate(
            [
              {
                transform: `translate(0, 0) scale(1)`,
              },
              {
                transform: `translate(calc(${-speed / 1.5}*500px), ${
                  transitionDown ? "calc(1 / 8 * 100vh)" : "0"
                }) scale(${zoomOut ?? 1})`,
              },
            ],
            {
              duration: duration,
              easing: "cubic-bezier(0.33, 0.27, .58, 1)",
              fill: "forwards",
              iterations: 1,
            }
          );

          setTimeout(() => {
            resolve([]);
          }, triggerNext || duration);
        });
      });
    }, true);
    createdAnimationImplementation.current = true;
  }
  }, []);

  return (
    <div
      key={baseClassName}
      ref={(element) => {
        if (!element || isEndAnimationRunning.current) return;
        elementRef.current = element;
        if (!animationRef.current && !forceEnd) {
          animationRef.current = element.animate(
            [
              {
                transform: `translateX(calc(2*${width}))`,
              },
              {
                transform: `translateX(calc(3*${width}))`,
              },
            ],
            {
              duration: 10_000 / speed,
              iterations: Infinity,
            }
          );
        }

        if (forceEnd) {
          animationRef.current?.cancel();
          let translateX = new DOMMatrixReadOnly(
            window.getComputedStyle(element).getPropertyValue("transform")
          ).m41;

          element.setAttribute(
            "style",
            `transform: translate(0, 0); left: calc(${translateX}px);`
          );

          element.setAttribute(
            "style",
            `transform: translate(calc(${-speed / 1.5}*3000px), ${
              transitionDown ? "calc(1 / 8 * 100vh)" : "0"
            }) scale(${zoomOut ?? 1})`
          );
        }
      }}
      className={
        origin ? `${baseClassName} z-10 origin-bottom` : `${baseClassName} z-10`
      }
    ></div>
  );
};

export default AnimatedBackground;
