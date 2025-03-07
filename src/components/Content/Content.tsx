import { useState, useRef, useEffect, FC, useMemo } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";
import AnimatedBackground from "./helper/animated-background";
import { useAnimationState, useImageLoaded } from "./Scene/Car/Car";
import EmbedSvg, { useSvg } from "lib/embed-svg";
import { rotateElementAroundAnchorPoint } from "lib/rotate-svg";
import tippy, { DelegateInstance, Props } from "tippy.js";
import {
  END_TRANSITION_DURATION,
  LANDING_PAGE_BUILDING_SVG_ID,
  LANDING_PAGE_EMPLOYEE_SVG_ID,
  LANDING_PAGE_GAS_TANK_SVG_ID,
  LANDING_PAGE_SISTEMGAS_HQ_GLOW_SVG_ID,
  LANDING_PAGE_SISTEMGAS_HQ_SVG_ID,
  LANDING_PAGE_TRUCKS_SVG_ID,
} from "constant";
import { updateLastElementHovered } from "lib/debounce-hover";
import "tippy.js/animations/scale.css";
import WebFont from "webfontloader";
import { scrollElementBy } from "lib/scroll-smooth";
import { atom, useSetAtom } from "jotai";
import Loading from "./elements/loading";
import Header from "./elements/header";
import {
  actions,
  animateComponentOnHover,
  poppers,
} from "./helper/animte-component-on-hover";
import { GridPattern } from "./elements/grid-background";
import { cn } from "lib/utils";

const backgroundAnimations = [
  {
    baseClassName: content["clouds-back"],
    speed: 0.8,
    zoomOut: 0.95,
    transitionDown: true,
  },
  {
    baseClassName: content["clouds-front"],
    speed: 0.85,
    zoomOut: 0.95,
    transitionDown: true,
  },

  {
    baseClassName: content["road-park-front"],
    speed: 1.2,
    transitionDown: true,
    zoomOut: 0.9,
  },
  {
    baseClassName: content["park-back"],
    speed: 1,
    transitionDown: true,
    zoomOut: 0.9,
  },
  {
    baseClassName: content["buildings-front"],
    speed: 0.75,
    transitionDown: true,
    zoomOut: 0.8,
  },
  {
    baseClassName: content["buildings-back"],
    speed: 0.7,
    transitionDown: true,
    zoomOut: 0.8,
  },
];

export const sistemgasHQBBoxAtom = atom<ScrollBBox | undefined>();

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
        requestAnimationFrame(() => {
          setLoading(false);
        });
      }, 500);
    }
  }, [imageLoaded]);

  useEffect(() => {
    if (svg) {
      rotateElementAroundAnchorPoint("hand", [-10, 10, -10], false);
      rotateElementAroundAnchorPoint("forearm", [0, 15, 0], false);
      rotateElementAroundAnchorPoint("right_arm", [0, 10, 0], true);

      const options: Partial<Props> = {
        appendTo: document.body,
        trigger: "manual",
        placement: "top",
        animation: "scale",
        maxWidth: "none",
        interactive: true,
        content: (reference) => {
          const template = document.getElementById(`tooltip-${reference.id}`);
          if (!template) return "";

          return template;
        },
      };

      animateComponentOnHover<{ shadowBlur1: number; shadowBlur2: number }>(
        LANDING_PAGE_BUILDING_SVG_ID,
        options,
        actions,
        { shadowBlur1: 5, shadowBlur2: 30 }
      );

      animateComponentOnHover<{ shadowBlur1: number; shadowBlur2: number }>(
        LANDING_PAGE_TRUCKS_SVG_ID,
        options,
        actions,
        { shadowBlur1: 0, shadowBlur2: 20 }
      );

      animateComponentOnHover<{ shadowBlur1: number; shadowBlur2: number }>(
        LANDING_PAGE_GAS_TANK_SVG_ID,
        options,
        actions,
        { shadowBlur1: 0, shadowBlur2: 20 }
      );

      const showPopoverAfterAnimationFinish = (
        component: HTMLElement,
        props: { shadowBlur1: number; shadowBlur2: number }
      ) => {
        actions(component, props);
        useAnimationState.subscribe(({ finished, forceEnd }) => {
          if (forceEnd) {
            const { shadowBlur1, shadowBlur2 } = props;
            component.classList.add(content["svg-original"]);

            updateLastElementHovered(component, {
              effect: () => {
                component.classList.add(content["svg-hover"]);
                component.style.setProperty(
                  "--shadow-blur-1",
                  `${shadowBlur1}px`
                );
                component.style.setProperty(
                  "--shadow-blur-2",
                  `${shadowBlur2}px`
                );

                const popper = poppers.find(
                  (popper) => popper.reference === component
                );

                let popperTemplate = popper?.props.content;
                if (!popperTemplate) {
                  popperTemplate =
                    document.getElementById(`tooltip-${component.id}`) ||
                    undefined;
                  if (popperTemplate) popper?.setContent(popperTemplate);
                  else {
                    console.error("THERE WAS A PROBLEM LOADING THE POPPER!");
                  }
                }

                popper?.show();
              },
              cleanup: (lastElementHovered) => {
                if (lastElementHovered === component) return;

                lastElementHovered?.classList.remove(content["svg-hover"]);

                const popper = poppers.find(
                  (popper) => popper.reference === lastElementHovered
                );
                popper?.hide();
              },
            });

            return;
          }

          if (finished)
            setTimeout(() => {
              const { shadowBlur1, shadowBlur2 } = props;
              component.classList.add(content["svg-original"]);

              updateLastElementHovered(component, {
                effect: () => {
                  component.classList.add(content["svg-hover"]);
                  component.style.setProperty(
                    "--shadow-blur-1",
                    `${shadowBlur1}px`
                  );
                  component.style.setProperty(
                    "--shadow-blur-2",
                    `${shadowBlur2}px`
                  );

                  const popper = poppers.find(
                    (popper) => popper.reference === component
                  );

                  let popperTemplate = popper?.props.content;
                  if (!popperTemplate) {
                    popperTemplate =
                      document.getElementById(`tooltip-${component.id}`) ||
                      undefined;
                    if (popperTemplate) popper?.setContent(popperTemplate);
                    else {
                      console.error("THERE WAS A PROBLEM LOADING THE POPPER!");
                    }
                  }

                  popper?.show();
                },
                cleanup: (lastElementHovered) => {
                  if (lastElementHovered === component) return;

                  lastElementHovered?.classList.remove(content["svg-hover"]);

                  const popper = poppers.find(
                    (popper) => popper.reference === lastElementHovered
                  );
                  popper?.hide();
                },
              });
            }, END_TRANSITION_DURATION);
        });
      };

      animateComponentOnHover<{ shadowBlur1: number; shadowBlur2: number }>(
        LANDING_PAGE_EMPLOYEE_SVG_ID,
        options,
        showPopoverAfterAnimationFinish,
        { shadowBlur1: 0, shadowBlur2: 20 }
      );

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
        window.innerWidth / 2 +
        35;
      sistemgasSvgRef.current.style.overflowX = "scroll";
    }
  }, [finished, forceEnd]);

  const setBBox = useSetAtom(sistemgasHQBBoxAtom);
  const handleScroll = () => {
    if (sistemgasSvgRef.current) {
      setBBox({
        scrollLeft: sistemgasSvgRef.current.scrollLeft,
        height: sistemgasSvgRef.current.scrollHeight,
        width: sistemgasSvgRef.current.scrollWidth,
        x: sistemgasSvgRef.current.clientLeft,
        y: sistemgasSvgRef.current.clientTop,
      });
    }
  };

  useEffect(() => {
    const svg = document.getElementById(LANDING_PAGE_SISTEMGAS_HQ_GLOW_SVG_ID);

    // Access the animate tags by their unique ids and trigger animation
    if (svg) {
      const animateTags = svg.querySelectorAll("animate");

      // Iterate over all the animate tags and control their "begin" attribute based on state
      animateTags.forEach((animateTag) => {
        if (finished || forceEnd) {
          setTimeout(() => {
            animateTag.beginElement();
          }, 2000);
        } else {
          animateTag.setAttribute("begin", "indefinite");
        }
      });
    }
  }, [finished, forceEnd]);

  return (
    <>
      {loading && <Loading />}

      <div
        ref={sceneRef}
        id="scene-root"
        className="relative top-0 left-0 h-full overflow-x-hidden overflow-y-auto flex-1 z-0 mb-4 mr-4 ml-4 mt-4 bg-gradient-to-b from-[#94ddff] to-cyan-200 rounded-md"
      >
        <Header></Header>

        <div
          style={{
            maskImage:
              "radial-gradient(50% 50% ellipse at 50% 50%, white, transparent)",
          }}
          className={cn(
            "absolute -z-10 top-0 flex h-2/3 w-full left-1/2 -translate-x-1/2 flex-col items-center justify-center overflow-hidden rounded-lg"
          )}
        >
          <GridPattern
            width={20}
            height={20}
            squareFillProbability={0.1}
            className={cn("skew-y-3")}
          />
        </div>
        <Scene
          width={dimensions.width}
          height={dimensions.height}
          imageHeight={imageHeight}
          start={!loading}
        ></Scene>
        <div
          onScroll={handleScroll}
          ref={sistemgasSvgRef}
          id="sistemgas-hq"
          className={`${content["sistemgas-hq"]} ${
            finished
              ? content["sistemgas-hq-animate-in"]
              : forceEnd
              ? content["sistemgas-hq-force-end"]
              : ""
          }`}
        >
          <EmbedSvg
            className={`absolute w-full z-10 left-0 translate-x-full h-full flex flex-col justify-end items-center min-w-min ${
              finished
                ? content["sistemgas-svg-animate-in"]
                : forceEnd
                ? content["sistemgas-svg-force-end"]
                : ""
            }`}
            svgClassName={`h-[45%] overflow-visible`}
            elementId={LANDING_PAGE_SISTEMGAS_HQ_SVG_ID}
            svgName="sistemgas-hq.svg"
          ></EmbedSvg>

          <EmbedSvg
            className={`absolute w-full left-0 translate-x-full h-full flex flex-col justify-end items-center min-w-min ${
              finished
                ? content["sistemgas-svg-animate-in"]
                : forceEnd
                ? content["sistemgas-svg-force-end"]
                : ""
            }`}
            svgClassName={`h-[45%] overflow-visible`}
            elementId={LANDING_PAGE_SISTEMGAS_HQ_GLOW_SVG_ID}
            svgName="sistemgas-hq-glow.svg"
          ></EmbedSvg>
        </div>
        <div ref={elementRef} className={`${content.parallax} z-0 relative`}>
          {backgroundAnimations.map((elem) => (
            <AnimatedBackground {...elem} widthType="--background-svg-width" />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainScene;
