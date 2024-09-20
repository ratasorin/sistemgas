import { FC, useMemo, useRef, useState } from "react";
import { useAnimationState } from "../Scene/Car/Car";

export const END_TRANSITION_DURATION = 2000;

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
        ? `calc(-1 * var(${widthType}) + 64px)`
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
                transform: "translateX(-250px)",
              },
              {
                transform: `translateX(calc(${width} - 250px))`,
              },
            ],
            {
              duration: speed * 1000,
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
            `transform: translate(calc(${
              END_TRANSITION_DURATION / (speed * 1000)
            } * ${width}), ${
              transitionDown ? "calc(1 / 5 * 100vh)" : "0"
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
              `transform: translateX(0); left: ${translateX}px`
            );

            animationRef.current = element.animate(
              [
                {
                  transform: `translate(0, 0) scale(1)`,
                },
                {
                  transform: `translate(calc(${
                    (END_TRANSITION_DURATION / (speed * 1000)) * 1.5
                  } * ${width}), ${
                    transitionDown ? "calc(1 / 5 * 100vh)" : "0"
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
