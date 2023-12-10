import { useState, useRef, useEffect, FC } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import AnimatedBackground from "./helper/animated-background";
import { useAnimationState } from "./Scene/Car/Car";

const backgroundAnimations = [
  {
    baseClassName: content["clouds-back"],
    speed: 13,
  },
  {
    baseClassName: content["mountains-back"],
    speed: 17,
    transitionDown: true,
  },
  {
    baseClassName: content["mountains-front"],
    speed: 14,
    transitionDown: true,
  },
  {
    baseClassName: content["clouds-front"],
    speed: 10,
  },
  {
    baseClassName: content["forest-back"],
    speed: 14,
    transitionDown: true,
  },
  {
    baseClassName: content["forest-mid"],
    speed: 12,
    transitionDown: true,
  },
  {
    baseClassName: content["forest-front"],
    speed: 9,
    transitionDown: true,
  },
];

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

  return (
    <div
      ref={sceneRef}
      className="relative overflow-x-hidden w-screen flex-1 flex flex-col-reverse"
    >
      <Scene width={dimensions.width} height={dimensions.height}></Scene>
      <div className={`${content.parallax} z-0`}>
        {backgroundAnimations.map((elem) => (
          <AnimatedBackground {...elem} widthType="--background-svg-width" />
        ))}
        <div
          className={`${content["grass"]} z-0 ${
            finished ? content["transition-down"] : ""
          }`}
        ></div>
        <AnimatedBackground
          baseClassName={content["street"]}
          speed={2.5}
          key={content["street"]}
          transitionDown={true}
          widthType="--road-svg-width"
        />
        <div
          className={`${content["sistemgas-hq"]} ${
            finished ? content["sistemgas-hq-animate-in"] : ""
          }`}
        >
          <img src="./sistemgas-hq.svg" />
        </div>
      </div>
    </div>
  );
};

export default MainScene;
