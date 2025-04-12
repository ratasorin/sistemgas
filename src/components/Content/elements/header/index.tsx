import {
  pillDimensionsAtom,
  startSlideshowAtom,
} from "components/Content/Scene/pill";
import { useAtomValue } from "jotai";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import header_styles from "./header.module.css";
import { Button } from "@mui/material";
import EmojiScroll from "./emoji-scroll";
import PathConnector from "../path-connector";
import { createPortal } from "react-dom";
import { createAnimationImplementation } from "lib/animation/manage";

const m4 = 16; //px

interface BubbleInterface {
  startElement: HTMLElement | null;
  endOffsetX: number;
}

const BUBBLE_1 = "BUBBLE_1";
const BUBBLE_2 = "BUBBLE_2";
const BUBBLE_3 = "BUBBLE_3";
const BUBBLE_4 = "BUBBLE_4";
const DETAILS_BUTTON_ID = "DETAILS_BUTTON";

const BUBBLE_SVG = {
  [BUBBLE_1]: "rocket.svg",
  [BUBBLE_2]: "hourglass.svg",
  [BUBBLE_3]: "seedling.svg",
  [BUBBLE_4]: "handshake.svg",
};

export const BUILDING_TOP_CLASSNAME = ".cls-57";
export const BUILDING_HQ_ID = "Layer_2";

const getBuildingTop = () => {
  const svg = document.getElementById(BUILDING_HQ_ID) as unknown as
    | SVGElement
    | undefined;
  const buildingTop = svg?.querySelectorAll(BUILDING_TOP_CLASSNAME)[0];

  return buildingTop;
};

const getButton = () => {
  return document.getElementById(DETAILS_BUTTON_ID);
};

const getBBox = (el?: Element | null | undefined): DOMRect => {
  return (
    el?.getBoundingClientRect() || {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => "0",
    }
  );
};

const Header = () => {
  const pillDimensions = useAtomValue(pillDimensionsAtom);

  const [largestPillFitsScreenWidth, setLargestPillsFitsScreenWidth] =
    useState(false);
  const computeIfPillFitsScreen = useCallback(() => {
    const largestPillWidth = Object.values(pillDimensions).reduce(
      (prev, curr) => (curr.width > prev ? curr.width : prev),
      0
    );

    if (largestPillWidth < window.innerWidth - 4 * m4)
      setLargestPillsFitsScreenWidth(true);
    else setLargestPillsFitsScreenWidth(false);
  }, [setLargestPillsFitsScreenWidth]);

  useEffect(() => {
    window.addEventListener("resize", computeIfPillFitsScreen);
    computeIfPillFitsScreen();

    return () => window.removeEventListener("resize", computeIfPillFitsScreen);
  }, [pillDimensions]);

  const startSlideshow = useAtomValue(startSlideshowAtom);

  const [buildingTop, setBuildingTop] = useState<Element | null>(null);
  const [bubbles, setBubbles] = useState<
    [BubbleInterface, BubbleInterface, BubbleInterface, BubbleInterface]
  >([
    { startElement: null, endOffsetX: 0 },
    { startElement: null, endOffsetX: 0 },
    { startElement: null, endOffsetX: 0 },
    { startElement: null, endOffsetX: 0 },
  ]);

  useEffect(() => {
    createAnimationImplementation("bubbles", (duration, triggerNext) => {
      return new Promise((resolve) => {
        
        const bubblesConatiner = document.getElementById("bubbles");
        if(!bubblesConatiner) return;

        bubblesConatiner.style.animation = `${header_styles["expand-height"]} ${duration}ms ease-in-out forwards`;

        setTimeout(() => {
          const bubble1 = document.getElementById(BUBBLE_1);
          const bubble2 = document.getElementById(BUBBLE_2);
          const bubble3 = document.getElementById(BUBBLE_3);
          const bubble4 = document.getElementById(BUBBLE_4);
      
          const buildingTop = getBuildingTop();
          setBuildingTop((b) => (b ? b : buildingTop || null));
      
          const buildingBBox = getBBox(buildingTop);
          const buildingStartX = buildingBBox.x;
          const buildingEndX = buildingStartX + buildingBBox.width;
      
          const button = getButton();
          const buttonBBox = getBBox(button);
          const buttonStartX = buttonBBox.x;
          const buttonEndX = buttonBBox.x + buttonBBox.width;
      
          const seg1 = buttonStartX - buildingStartX;
          const seg2 = buildingEndX - buttonEndX;
      
          const localAnchor1 = seg1 / 3;
          const localAnchor2 = (2 * seg1) / 3;
      
          const localAnchor3 = buttonEndX - buildingStartX + seg2 / 3;
          const localAnchor4 = buttonEndX - buildingStartX + (2 * seg2) / 3;
      
          setBubbles([
            { endOffsetX: localAnchor1, startElement: bubble1 },
            { endOffsetX: localAnchor2, startElement: bubble2 },
            { endOffsetX: localAnchor3, startElement: bubble3 },
            { endOffsetX: localAnchor4, startElement: bubble4 },
          ]);

          setTimeout(() => {
            resolve(["pipes"]);
          }, 100);
        }, triggerNext || duration);
      });
    });
  }, [setBubbles]);

  const startOffset = useMemo(() => {
    const bubbleBBox = getBBox(bubbles[0].startElement);
    return {
      x: bubbleBBox.width / 2,
      y: bubbleBBox.height,
    };
  }, [bubbles]);

  return (
    <>
      <div
        className="absolute z-20 top-[72px] overflow-visible h-[calc(65%-72px)] flex flex-col w-full"
        style={{
          justifyContent: "flex-start",
          paddingBottom: !largestPillFitsScreenWidth
            ? window.innerHeight < 680
              ? "28px"
              : window.innerHeight < 816
              ? "36px"
              : "0"
            : "0",
        }}
      >
        <div
          id="pill-placeholder-scroll"
          className={`text-center overflow-hidden opacity-50 text-sm rounded-2xl bg-cyan-50 relative left-1/2 -translate-x-1/2 -translate-y-[2px] top-0 border-2 border-cyan-300 border-dashed`}
          style={{
            width: pillDimensions[0]?.width - 6 || 0,
            height: pillDimensions[0]?.height - 4 || 0,
            visibility:
              !startSlideshow && pillDimensions[0]?.width
                ? "visible"
                : "hidden",
            marginBottom:
              window.innerHeight < 680
                ? "8px"
                : window.innerHeight < 816
                ? "12px"
                : "12px",
          }}
        >
          <div
            className={`h-full overflow-hidden ${header_styles["pill-placeholder-scroll"]} whitespace-nowrap w-fit`}
          >
            <EmojiScroll></EmojiScroll>
          </div>
        </div>
        <div
          id="main-text-and-button"
          style={{
            position: "relative",
          }}
          className="overflow-visible left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center "
        >
          <h2 className="overflow-visible mb-2 mt-3 bg-clip-text font-bold text-4xl md:text-5xl text-transparent bg-gradient-to-r from-[#1334A1] to-[#264cca]">
            SISTEMGAS
          </h2>
          <h3 className="font-poppins font-bold text-center text-2xl leading-6 md:text-3xl overflow-visible px-4">
            <span className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
              Alternativa
            </span>{" "}
            <span className="overflow-visible bg-clip-text text-transparent bg-gradient-to-tr from-[#3A57B6] to-[#557CFC]">
              in furnizarea gazului natural
            </span>
          </h3>
        </div>

        <div className="w-full flex-1 px-2 flex items-center flex-col">
          <div
            className="h-0 w-full max-w-sm flex justify-evenly items-center mb-2 overflow-hidden"
            id="bubbles"
          >
            {([BUBBLE_1, BUBBLE_2, BUBBLE_3, BUBBLE_4] as const).map((id) => (
              <div
                id={id}
                style={{
                  marginBottom: [BUBBLE_2, BUBBLE_3].includes(id)
                    ? "2rem"
                    : "0",
                  marginTop: [BUBBLE_1, BUBBLE_4].includes(id) ? "2rem" : "0",
                }}
                className="w-12 h-12 mt-6 rounded-full bg-[#D9E2FE] border-2 border-[#91A3E1] flex items-center justify-center p-2"
              >
                <img src={`/emojis/${BUBBLE_SVG[id]}`} alt="" />
              </div>
            ))}

            {createPortal(
              <>
                {bubbles.map((b) => (
                  <PathConnector
                    elementsToDodge={[DETAILS_BUTTON_ID]}
                    startRef={b.startElement}
                    endRef={buildingTop}
                    endOffset={{ x: b.endOffsetX, y: 0 }}
                    startOffset={startOffset}
                    strokeWidth={2}
                    gradient={{
                      id: "customGradient",
                      defs: (
                        <linearGradient
                          id="customGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#95A9E300" />
                          <stop offset="50%" stopColor="#91A3E1" />
                          <stop offset="100%" stopColor="#637BCD" />
                        </linearGradient>
                      ),
                    }}
                  ></PathConnector>
                ))}
              </>,
              document.getElementById("root")!
            )}
          </div>
          <div className="h-1/2 flex items-start justify-center py-4 !overflow-visible">
            <Button
              variant="contained"
              id={DETAILS_BUTTON_ID}
              className="font-poppins !font-semibold !rounded-lg !px-4 !py-1 !shadow-none !overflow-visible"
              style={{
                background:
                  "linear-gradient(to bottom, #afbde7 -30%, #1334A1 150%)",
              }}
              sx={{
                "::before": {
                  overflow: "visible",
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  width: "calc(100% + 4px)",
                  height: "calc(100% + 4px)",
                  borderRadius: "0.50rem",
                  background:
                    "linear-gradient(to bottom, #9DB0EF -20%, #1334A1 120%)",
                  zIndex: -1,
                },
              }}
            >
              VEZI DETALII
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
