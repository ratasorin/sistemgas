import { useState, useRef, useEffect, FC, useMemo } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import AnimatedBackground from "./helper/animated-background";
import { useAnimationState } from "./Scene/Car/Car";
import EmbedSvg, { useSvg } from "lib/embed-svg";
import { rotateElementAroundAnchorPoint } from "lib/rotate-svg";

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

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

const SISTEMGAS_HQ_SVG_ID = "sistemgas-hq-svg2834902838";

const MainScene: FC = () => {
  const svg = useSvg(SISTEMGAS_HQ_SVG_ID);

  useEffect(() => {
    if (svg) {
      rotateElementAroundAnchorPoint("hand", [-10, 10, -10], false);
      rotateElementAroundAnchorPoint("forearm", [0, 15, 0], false);
      rotateElementAroundAnchorPoint("right_arm", [0, 10, 0], true);
    }
  }, [svg]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageHeight, setImageHeight] = useState(0);
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

  const width = useMemo(() => {
    // this will be displayed on the biggest screens
    let w = "1550px";
    if (dimensions.width < screens["lg"]) w = "1450px";
    if (dimensions.width < screens["md"]) w = "1350px";
    if (dimensions.width < screens["sm"]) w = "960px";

    return w;
  }, [dimensions]);

  return (
    <div
      ref={sceneRef}
      className="relative overflow-x-hidden w-screen flex-1 flex flex-col-reverse"
    >
      <Scene
        width={dimensions.width}
        height={dimensions.height}
        imageHeight={imageHeight}
      ></Scene>
      <div className={`${content.parallax} z-0`}>
        {backgroundAnimations.map((elem) => (
          <AnimatedBackground {...elem} widthType="--background-svg-width" />
        ))}
        <div
          className={`${content["grass"]} z-0 ${
            finished ? content["transition-down"] : ""
          }`}
        ></div>
        <div
          className={`${content["street-background"]} ${
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
          ref={(elem) => {
            if (!elem) return;
            setImageHeight(elem.clientHeight);
          }}
          style={{ width }}
          className={`${content["sistemgas-hq"]} ${
            finished ? content["sistemgas-hq-animate-in"] : ""
          }`}
        >
          <EmbedSvg
            elementId={SISTEMGAS_HQ_SVG_ID}
            svgName="sistemgas-hq_10.svg"
          ></EmbedSvg>
        </div>
      </div>
    </div>
  );
};

export default MainScene;
