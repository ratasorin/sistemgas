import { useState, useRef, useEffect, FC, useMemo } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import AnimatedBackground from "./helper/animated-background";
import { useAnimationState } from "./Scene/Car/Car";
import EmbedSvg, { useSvg } from "lib/embed-svg";
import { rotateElementAroundAnchorPoint } from "lib/rotate-svg";
import tippy, { DelegateInstance, Props } from "tippy.js";
import {
  LANDING_PAGE_BUILDING_SVG_ID,
  LANDING_PAGE_EMPLOYEE_SVG_ID,
  LANDING_PAGE_GAS_TANK_SVG_ID,
  LANDING_PAGE_SISTEMGAS_HQ_SVG_ID,
  LANDING_PAGE_TRUCKS_SVG_ID,
} from "constant";
import { shouldExit, updateLastElementHovered } from "lib/debounce-hover";
import "tippy.js/animations/scale.css";

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
    speed: 16,
    zoomOut: 0.9,
  },
  {
    baseClassName: content["mountains-back"],
    speed: 20,
    transitionDown: true,
    zoomOut: 0.95,
    origin: "bottom",
  },
  {
    baseClassName: content["mountains-front"],
    speed: 17,
    transitionDown: true,
    zoomOut: 0.9,
    origin: "bottom",
  },
  {
    baseClassName: content["clouds-front"],
    speed: 14,
    zoomOut: 0.85,
  },
  {
    baseClassName: content["forest-back"],
    speed: 18,
    transitionDown: true,
    zoomOut: 0.8,
  },
  {
    baseClassName: content["forest-mid"],
    speed: 15,
    transitionDown: true,
    zoomOut: 0.8,
  },
  {
    baseClassName: content["forest-front"],
    speed: 12,
    transitionDown: true,
    zoomOut: 0.8,
  },
];

export let poppers: DelegateInstance<Props>[] = [];

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
    updateLastElementHovered(
      component,
      (currentElementHovered) => {
        currentElementHovered?.classList.add(content["svg-hover"]);
        const popper = poppers.find(
          (popper) => popper.reference === currentElementHovered
        );

        setTimeout(() => {
          popper?.show();
        }, 200);
      },
      (lastElementHovered) => {
        if (lastElementHovered === component) return;

        lastElementHovered?.classList.remove(content["svg-hover"]);
        const popper = poppers.find(
          (popper) => popper.reference === lastElementHovered
        );
        popper?.hide();
      }
    );
  });

  component.addEventListener("mouseleave", () => {
    shouldExit(component, (element) => {
      element.classList.remove(content["svg-hover"]);
      const popper = poppers.find((popper) => popper.reference === element);
      popper?.hide();
    });
  });
};

const MainScene: FC = () => {
  const svg = useSvg(LANDING_PAGE_SISTEMGAS_HQ_SVG_ID);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [loading]);

  useEffect(() => {
    console.log({ loading });
  }, [loading]);

  useEffect(() => {
    if (svg) {
      rotateElementAroundAnchorPoint("hand", [-10, 10, -10], false);
      rotateElementAroundAnchorPoint("forearm", [0, 15, 0], false);
      rotateElementAroundAnchorPoint("right_arm", [0, 10, 0], true);

      animateComponentOnHover(LANDING_PAGE_BUILDING_SVG_ID, 10, 20);
      animateComponentOnHover(LANDING_PAGE_EMPLOYEE_SVG_ID, 5, 10);
      animateComponentOnHover(LANDING_PAGE_TRUCKS_SVG_ID, 5, 10);
      animateComponentOnHover(LANDING_PAGE_GAS_TANK_SVG_ID, 5, 10);

      poppers = tippy(`.${content["svg-original"]}`, {
        appendTo: document.body,
        trigger: "manual",
        placement: "top",
        animation: "scale",
        interactive: true,
        content: (reference) => {
          const template = document.getElementById(`tooltip-${reference.id}`);
          if (!template) return "";

          return template;
        },
      });
      setImageHeight(svg.clientHeight);
    }
  }, [svg]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageHeight, setImageHeight] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { finished, forceEnd } = useAnimationState();

  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

  const width = useMemo(() => {
    // this will be displayed on the biggest screens
    let w = "1550px";
    if (dimensions.width < screens["lg"]) w = "1450px";
    if (dimensions.width < screens["md"]) w = "1350px";
    if (dimensions.width < screens["sm"]) w = "960px";

    return w;
  }, [dimensions]);

  return (
    <>
      {/* {loading && (
        <div className="absolute z-10 w-screen h-screen bg-white">Loading</div>
      )} */}
      <div
        ref={sceneRef}
        className="relative overflow-x-hidden overflow-y-hidden w-screen flex-1 flex flex-col-reverse z-0"
      >
        <button
          className="absolute z-[1000] right-0 top-0 hover:cursor-pointer"
          onClick={() => useAnimationState.setState(() => ({ forceEnd: true }))}
        >
          END
        </button>
        <Scene
          width={dimensions.width}
          height={dimensions.height}
          imageHeight={imageHeight}
        ></Scene>

        <div
          style={{ width }}
          className={`${content["sistemgas-hq"]} ${
            finished
              ? content["sistemgas-hq-animate-in"]
              : forceEnd
              ? content["sistemgas-hq-force-end"]
              : ""
          }`}
        >
          <EmbedSvg
            className="h-screen flex flex-col justify-end items-center overflow-visible"
            svgClassName="h-2/3 overflow-visible"
            elementId={LANDING_PAGE_SISTEMGAS_HQ_SVG_ID}
            svgName="sistemgas-hq.svg"
          ></EmbedSvg>
        </div>

        <div className={`${content.parallax} z-0`}>
          {backgroundAnimations.map((elem) => (
            <AnimatedBackground {...elem} widthType="--background-svg-width" />
          ))}
          <div
            className={`${content["grass"]} z-0 ${
              finished
                ? `${content["transition-down"]}`
                : forceEnd
                ? content["force-end"]
                : ""
            }`}
          ></div>
          <div
            className={`${content["street-background"]} ${
              finished
                ? `${content["transition-down"]}`
                : forceEnd
                ? content["force-end"]
                : ""
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
    </>
  );
};

export default MainScene;
