import { FC, useMemo, useRef, useState } from "react";
import { useAnimationState } from "../Scene/Car/Car";

const END_TRANSITION_DURATION = 4000;

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
        ? `calc(-1/2 * var(${widthType}))`
        : `calc(-1 * var(${widthType}))`,
    [widthType]
  );
  const [running, setRunning] = useState(false);

  return (
    <div
      key={baseClassName}
      ref={(element) => {
        if (!element || running) return;
        if (!animationRef.current && !forceEnd) {
          console.log({ forceEnd });
          animationRef.current = element.animate(
            [
              {
                transform: "translateX(0px)",
              },
              {
                transform: `translateX(${width})`,
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
            }) scale(${zoomOut ?? 1})`
          );
        } else if (finished && animationRef.current) {
          animationRef.current?.commitStyles();
          // Cancel the animation
          animationRef.current?.cancel();

          setRunning(true);

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
                  END_TRANSITION_DURATION / (speed * 1000)
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
        }
      }}
      className={
        origin ? `${baseClassName} z-10 origin-bottom` : `${baseClassName} z-10`
      }
    ></div>
  );
};

export default AnimatedBackground;
