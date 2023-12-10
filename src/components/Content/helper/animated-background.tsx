import { FC, useRef } from "react";
import { useAnimationState } from "../Scene/Car/Car";

const END_TRANSITION_DURATION = 4000;

const AnimatedBackground: FC<{
  baseClassName: string;
  speed: number;
  widthType: "--background-svg-width" | "--road-svg-width";
}> = ({ baseClassName, speed, widthType }) => {
  const { finished } = useAnimationState();
  const animationRef = useRef<Animation | undefined>(undefined);
  const width =
    widthType === "--background-svg-width"
      ? `calc(-1/2 * var(${widthType}))`
      : `calc(-1 * var(${widthType}))`;

  return (
    <div
      key={baseClassName}
      ref={(element) => {
        if (!element) return;
        if (finished && animationRef.current) {
          animationRef.current?.commitStyles();
          // Cancel the animation
          animationRef.current?.cancel();

          let translateX = new DOMMatrixReadOnly(
            window.getComputedStyle(element).getPropertyValue("transform")
          ).m41;

          console.log(translateX, widthType);

          element.setAttribute(
            "style",
            `transform: translateX(0); left: ${translateX}px`
          );

          animationRef.current = element.animate(
            [
              {
                transform: `translateX(0px)`,
              },
              {
                transform: `translateX(calc(${
                  END_TRANSITION_DURATION / (speed * 1000)
                } * ${width}`,
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

        if (!animationRef.current)
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
              duration: speed * 1000,
              iterations: Infinity,
            }
          );
      }}
      className={`${baseClassName} z-10`}
    ></div>
  );
};

export default AnimatedBackground;
