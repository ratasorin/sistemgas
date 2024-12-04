import { FC, useMemo, useRef, useState } from "react";
import { useAnimationState } from "../Scene/Car/Car";

export const END_TRANSITION_DURATION = 1500;

const AnimatedBackground: FC<{
  baseClassName: string;
  speed: number;
  transitionDown?: boolean;
  widthType: "--background-svg-width" | "--road-svg-width";
  zoomOut?: number;
  origin?: string;
}> = ({ baseClassName, speed, widthType, transitionDown, zoomOut, origin }) => {
  const { finished, forceEnd } = useAnimationState();
  const animationRef = useRef<Animation | undefined>(undefined);
  const width = useMemo(
    () =>
      widthType === "--background-svg-width"
        ? `calc(-1 * var(${widthType}))`
        : `calc(-1 * var(${widthType}))`,
    [widthType]
  );

  const isEndAnimationRunning = useRef(false);

  return (
    <div
      key={baseClassName}
      ref={(element) => {
        if (!element || isEndAnimationRunning.current) return;
        if (!animationRef.current && !forceEnd) {
          animationRef.current = element.animate(
            [
              {
                transform: "translateX(0)",
              },
              {
                transform: `translateX(${width})`,
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
            `transform: translateX(0); left: ${translateX}px`
          );
          element.setAttribute(
            "style",
            `transform: translate(calc(${speed / 20}*${width}), ${
              transitionDown ? "calc(1 / 8 * 100vh)" : "0"
            }) scale(${zoomOut || 1})`
          );
        } else if (finished && animationRef.current) {
          window.requestAnimationFrame(() => {
            animationRef.current!.pause();
            isEndAnimationRunning.current = true;

            let translateX = new DOMMatrixReadOnly(
              window.getComputedStyle(element).getPropertyValue("transform")
            ).m41;

            element.setAttribute(
              "style",
              `left: calc(${translateX}px); transform: translate(calc(${width}))`
            );

            animationRef.current = element.animate(
              [
                {
                  transform: `translate(calc(${width}), 0) scale(1)`,
                },
                {
                  transform: `translate(calc(${width} - 500px), ${
                    transitionDown ? "calc(1 / 8 * 100vh)" : "0"
                  }) scale(${zoomOut ?? 1})`,
                },
              ],
              {
                duration: END_TRANSITION_DURATION,
                easing: "cubic-bezier(0.33, 0.27, .58, 1)",
                fill: "forwards",
                iterations: 1,
              }
            );
          });
        }
      }}
      className={
        origin ? `${baseClassName} z-10 origin-bottom` : `${baseClassName} z-10`
      }
    ></div>
  );
};

export default AnimatedBackground;
