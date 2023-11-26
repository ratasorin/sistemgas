import { useState, useRef, useEffect, FC } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import { useAnimationState } from "./Scene/Car/Car";
import anime from "animejs";

const SVG_WIDTH = 4023;
const SVG_HEIGHT = 1080;

const MainScene: FC = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const sceneRef = useRef<HTMLDivElement>(null);
  const { finished } = useAnimationState();
  useEffect(() => {
    const scene = sceneRef.current as HTMLDivElement;
    setDimensions({
      width: scene.getBoundingClientRect().width,
      height: scene.getBoundingClientRect().height,
    });

    window.addEventListener("resize", () => {
      setDimensions({
        width: scene.getBoundingClientRect().width,
        height: scene.getBoundingClientRect().height,
      });
    });
  }, []);

  const animation = useRef<any>(undefined);
  return (
    <div
      ref={sceneRef}
      className="relative overflow-x-hidden w-screen flex-1 flex flex-col-reverse"
    >
      <Scene width={dimensions.width} height={dimensions.height}></Scene>
      <div className={content.parallax}>
        <div
          ref={(element) => {
            if (!element) return;

            const height = window.innerHeight;
            const width = (((SVG_WIDTH / SVG_HEIGHT) * 4) / 5) * height;
            const speed = width / 13;
            const duration = (width / speed) * 1000;
            const translateX = new DOMMatrixReadOnly(
              window.getComputedStyle(element).getPropertyValue("transform")
            ).m41;

            console.log(translateX);

            if (finished && !animation.current) {
              element.setAttribute(
                "style",
                `transform:translateX(${translateX}px);`
              );
              element.classList.remove(content["animate-clouds-back"]);
              animation.current = anime({
                targets: element,
                translateX: -width,
                duration,
                easing: "linear",
              });
            }
          }}
          className={`${content["clouds-back"]} ${
            content["animate-clouds-back"]
          }  ${finished ? content["stop"] : ""}`}
        ></div>
        <div
          className={`${content["mountains-back"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div
          className={`${content["mountains-front"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div
          className={`${content["clouds-front"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div className={`${content["grass"]}`}></div>
        <div
          className={`${content["forest-back"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div
          className={`${content["forest-mid"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div
          className={`${content["forest-front"]} ${
            finished ? content["stop"] : ""
          }`}
        ></div>
        <div
          className={`${content["street"]} ${finished ? content["stop"] : ""}`}
        ></div>
      </div>
    </div>
  );
};

export default MainScene;
