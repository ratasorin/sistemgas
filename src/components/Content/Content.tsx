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
const BUILDING_ID = "Building";
const EMPLOYEE_ID = "Employee";
const TRUCKS_ID = "Trucks";
const GAS_TANK_ID = "Gas_Tank";

const animateComponentOnHover = (
  componentId: string,
  shadowBlur1: number = 0,
  shadowBlur2: number = 0
) => {
  const component = document.getElementById(componentId);
  if (!component) {
    console.error(`There is no component with id: ${componentId}!`);
    return;
  }

  component.classList.add(content["svg-original"]);
  component.style.setProperty("--shadow-blur-1", `${shadowBlur1}px`);
  component.style.setProperty("--shadow-blur-2", `${shadowBlur2}px`);

  component.addEventListener("mouseenter", () => {
    component.classList.add(content["svg-hover"]);
  });

  component.addEventListener("mouseleave", () => {
    component.classList.remove(content["svg-hover"]);
  });
};

const MainScene: FC = () => {
  const svg = useSvg(SISTEMGAS_HQ_SVG_ID);

  useEffect(() => {
    if (svg) {
      rotateElementAroundAnchorPoint("hand", [-10, 10, -10], false);
      rotateElementAroundAnchorPoint("forearm", [0, 15, 0], false);
      rotateElementAroundAnchorPoint("right_arm", [0, 10, 0], true);

      animateComponentOnHover(BUILDING_ID, 10, 20);
      animateComponentOnHover(EMPLOYEE_ID, 5, 10);
      animateComponentOnHover(TRUCKS_ID, 5, 10);
      animateComponentOnHover(GAS_TANK_ID, 5, 10);
      setImageHeight(svg.clientHeight);
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
      className="relative overflow-x-hidden overflow-y-hidden w-screen flex-1 flex flex-col-reverse"
    >
      <Scene
        width={dimensions.width}
        height={dimensions.height}
        imageHeight={imageHeight}
      ></Scene>

      <div
        style={{ width }}
        className={`${content["sistemgas-hq"]} ${
          finished ? content["sistemgas-hq-animate-in"] : ""
        }`}
      >
        <EmbedSvg
          className="h-screen flex flex-col justify-end"
          svgClassName="overflow-visible"
          elementId={SISTEMGAS_HQ_SVG_ID}
          svgName="sistemgas-hq.svg"
        ></EmbedSvg>
      </div>

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
      </div>
    </div>
  );
};

export default MainScene;
