import { useState, useRef, useEffect, FC } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import { useAnimationState } from "./Scene/Car/Car";
import AnimatedBackground from "./helper/animated-background";

const backgroundAnimations = [
  {
    baseClassName: content["clouds-back"],
    speed: 13,
  },
  {
    baseClassName: content["mountains-back"],
    speed: 17,
  },
  {
    baseClassName: content["mountains-front"],
    speed: 14,
  },
  {
    baseClassName: content["clouds-front"],
    speed: 10,
  },
  {
    baseClassName: content["forest-back"],
    speed: 14,
  },
  {
    baseClassName: content["forest-mid"],
    speed: 12,
  },
  {
    baseClassName: content["forest-front"],
    speed: 9,
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
          <AnimatedBackground
            baseClassName={elem.baseClassName}
            speed={elem.speed}
            key={elem.baseClassName}
            widthType="--background-svg-width"
          />
        ))}
        <div className={`${content["grass"]} z-0`}></div>
        <AnimatedBackground
          baseClassName={content["street"]}
          speed={2.5}
          key={content["street"]}
          widthType="--road-svg-width"
        />
      </div>
    </div>
  );
};

export default MainScene;
