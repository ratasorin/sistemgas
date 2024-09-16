import { useState, useRef, useEffect, FC, useMemo } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import AnimatedBackground, {
  END_TRANSITION_DURATION,
} from "./helper/animated-background";
import { useAnimationState, useImageLoaded } from "./Scene/Car/Car";
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
import { IoPlaySkipForward } from "react-icons/io5";
import WebFont from "webfontloader";
import { createPortal } from "react-dom";
import { scrollElementBy } from "lib/scroll-smooth";

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
    speed: 19,
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
    speed: 19.5,
    transitionDown: true,
    zoomOut: 0.9,
    origin: "bottom",
  },
  {
    baseClassName: content["clouds-front"],
    speed: 16,
    zoomOut: 0.85,
  },
  {
    baseClassName: content["forest-back"],
    speed: 19,
    transitionDown: true,
    zoomOut: 0.8,
  },
  {
    baseClassName: content["forest-mid"],
    speed: 17,
    transitionDown: true,
    zoomOut: 0.8,
  },
  {
    baseClassName: content["forest-front"],
    speed: 15,
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

  const { imageLoaded } = useImageLoaded();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins:100,200,300,400,500,600,700,800,900"],
      },
    });
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [imageLoaded]);

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

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finished)
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          if (elementRef.current) {
            elementRef.current.animate(
              [
                {
                  filter: "blur(0px)",
                },
                {
                  filter: "blur(10px)",
                },
              ],
              {
                duration: END_TRANSITION_DURATION * 0.6,
                easing: "cubic-bezier(0.33, 0.27, .58, 1)",
                fill: "forwards",
                iterations: 1,
              }
            );
          }
        });
      }, END_TRANSITION_DURATION * 0.4);

    if (forceEnd && elementRef.current)
      elementRef.current.style.filter = "blur(10px)";
  }, [finished, forceEnd]);

  const sistemgasSvgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sistemgasSvgRef.current && finished) {
      scrollElementBy(
        sistemgasSvgRef.current,
        sistemgasSvgRef.current.children[0].scrollWidth / 2 -
          window.innerWidth / 2,
        END_TRANSITION_DURATION / 4
      );

      setTimeout(() => {
        sistemgasSvgRef.current!.style.overflowX = "scroll";
      }, END_TRANSITION_DURATION / 4);
    } else if (sistemgasSvgRef.current && forceEnd) {
      sistemgasSvgRef.current.scrollLeft =
        sistemgasSvgRef.current.children[0].scrollWidth / 2 -
        window.innerWidth / 2;
      sistemgasSvgRef.current.style.overflowX = "scroll";
    }
  }, [finished, forceEnd]);

  return (
    <>
      {loading && (
        <div className="absolute z-50 w-screen h-screen bg-black/60 flex flex-col items-center justify-center">
          <div className={content["fire"]}>
            <div className={content["fire-left"]}>
              <div className={content["fire-left__main-fire"]}></div>
              <div className={content["fire-left__particle-fire"]}></div>
            </div>
            <div className={content["fire-center"]}>
              <div className={content["fire-center__main-fire"]}></div>
              <div className={content["fire-center__particle-fire"]}></div>
            </div>
            <div className={content["fire-right"]}>
              <div className={content["fire-right__main-fire"]}></div>
              <div className={content["fire-right__particle-fire"]}></div>
            </div>

            <div className={content["fire-bottom"]}>
              <div className={content["main-fire"]}></div>
            </div>
          </div>
          <h2 className="text-white text-3xl overflow-hidden font-bold mt-4">
            LOADING...
          </h2>
        </div>
      )}
      <div
        ref={sceneRef}
        className="relative overflow-x-hidden overflow-y-hidden flex-1 flex flex-col-reverse z-0 mb-4 mr-4 ml-4 mt-4 bg-cyan-100 rounded-md"
      >
        <Scene
          width={dimensions.width}
          height={dimensions.height}
          imageHeight={imageHeight}
          start={!loading}
        ></Scene>
        {createPortal(
          <div
            ref={sistemgasSvgRef}
            className={`${content["sistemgas-hq"]} ${
              finished
                ? content["sistemgas-hq-animate-in"]
                : forceEnd
                ? content["sistemgas-hq-force-end"]
                : ""
            }`}
          >
            <EmbedSvg
              className={`translate-x-full h-screen flex flex-col justify-end items-center overflow-x-visible min-w-min ${
                finished
                  ? content["sistemgas-svg-animate-in"]
                  : forceEnd
                  ? content["sistemgas-svg-force-end"]
                  : ""
              }`}
              svgClassName="h-3/5 overflow-visible"
              elementId={LANDING_PAGE_SISTEMGAS_HQ_SVG_ID}
              svgName="sistemgas-hq.svg"
            ></EmbedSvg>
          </div>,
          document.getElementById("root")!
        )}

        <div ref={elementRef} className={`${content.parallax} z-0`}>
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
            speed={5}
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
