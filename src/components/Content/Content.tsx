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
import { Button, styled } from "@mui/material";
import { useAtomValue } from "jotai";
import { pillDimensionsAtom } from "./Scene/pill";

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
    baseClassName: content["park-front"],
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

export let poppers: DelegateInstance<Props>[] = [];

const animateComponentOnHover = <T,>(
  componentId: string,
  options: Partial<Props>,
  actions: (el: HTMLElement, props: T) => void,
  props: T
) => {
  const component = document.getElementById(componentId);
  if (!component) {
    console.error(`There is no component with id: ${componentId}!`);
    return;
  }

  const popper = tippy(`#${componentId}`, options);
  poppers = [...poppers, ...popper];

  actions(component, props);
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

      const actions = (
        component: HTMLElement,
        props: { shadowBlur1: number; shadowBlur2: number }
      ) => {
        const { shadowBlur1, shadowBlur2 } = props;
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
            const popper = poppers.find(
              (popper) => popper.reference === element
            );
            popper?.hide();
          });
        });
        // TODO: Fix touch outside not working on mobile!
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

            updateLastElementHovered(
              component,
              () => {
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
              (lastElementHovered) => {
                if (lastElementHovered === component) return;

                lastElementHovered?.classList.remove(content["svg-hover"]);

                const popper = poppers.find(
                  (popper) => popper.reference === lastElementHovered
                );
                popper?.hide();
              }
            );

            return;
          }

          if (finished)
            setTimeout(() => {
              const { shadowBlur1, shadowBlur2 } = props;
              component.classList.add(content["svg-original"]);

              updateLastElementHovered(
                component,
                () => {
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
                (lastElementHovered) => {
                  if (lastElementHovered === component) return;

                  lastElementHovered?.classList.remove(content["svg-hover"]);

                  const popper = poppers.find(
                    (popper) => popper.reference === lastElementHovered
                  );
                  popper?.hide();
                }
              );
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

  const pillDimensions = useAtomValue(pillDimensionsAtom);

  useEffect(() => {
    console.log({ pillDimensions });
  }, [pillDimensions]);

  return (
    <>
      <div
        className="absolute z-10 top-[52px] overflow-visible h-[calc(45%-52px)] flex flex-col w-full"
        style={{
          justifyContent: window.innerHeight < 760 ? "flex-end" : "center",
          paddingBottom:
            window.innerHeight < 680
              ? "16px"
              : window.innerHeight < 816
              ? "32px"
              : "0",
        }}
      >
        <div
          className={`text-center overflow-hidden opacity-50 text-sm rounded-2xl bg-cyan-50 relative mb-4 left-1/2 -translate-x-1/2 -translate-y-[2px] top-0 border border-cyan-400 border-dashed`}
          style={{
            width: pillDimensions.width - 4 || 0,
            height: pillDimensions.height - 2 || 0,
            visibility: pillDimensions.width ? "visible" : "hidden",
          }}
        >
          <div
            className={`h-full overflow-hidden ${content["pill-placeholder-scroll"]} whitespace-nowrap w-fit`}
          >
            <div className={content["pill-placeholder-scroll__batch-1"]}>
              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>
            </div>

            <div className={content["pill-placeholder-scroll__batch-2"]}>
              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>

              <span className="mr-2 bg-blend-multiply">🚀</span>
              <span className="mr-2 bg-blend-multiply">🌱</span>
              <span className="mr-2 bg-blend-multiply">⌛</span>
              <span className="mr-2 bg-blend-multiply">🤝🏼</span>
            </div>
          </div>
        </div>
        <div
          id="main-text"
          style={{
            position: "relative",
            gap: "16px",
          }}
          className="overflow-visible left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center"
        >
          <h3 className="font-poppins px-8 font-extrabold text-center text-4xl md:text-5xl overflow-visible">
            <span className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
              Alternativa
            </span>{" "}
            <span className="overflow-visible bg-clip-text text-transparent bg-gradient-to-r from-[#1334a0] to-[#3862ee]">
              in furnizarea gazului natural
            </span>
          </h3>
          <Button
            variant="contained"
            className="font-poppins !font-semibold !rounded-lg !bg-gradient-to-r from-[#3862ee] to-[#1334a0]"
          >
            INCEARCA ACUM
          </Button>
        </div>
      </div>
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
        className="relative overflow-x-hidden overflow-y-hidden flex-1 flex flex-col-reverse z-0 mb-4 mr-4 ml-4 mt-4 bg-gradient-to-t from-cyan-200 to-cyan-50 rounded-md"
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
              svgClassName="h-[55%] overflow-visible"
              elementId={LANDING_PAGE_SISTEMGAS_HQ_SVG_ID}
              svgName="sistemgas-hq.svg"
            ></EmbedSvg>
          </div>,
          document.getElementById("root")!
        )}

        <div ref={elementRef} className={`${content.parallax} z-0 relative`}>
          {backgroundAnimations.map((elem) => (
            <AnimatedBackground {...elem} widthType="--background-svg-width" />
          ))}
          <div
            style={{
              position: "relative",
              backgroundColor: "#1daa60",
              height: "20%",
              top: "80%",
            }}
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
            speed={2}
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
