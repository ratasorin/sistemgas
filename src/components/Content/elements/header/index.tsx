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
import { Position } from "@xyflow/react";
import { createPortal } from "react-dom";

const m4 = 16; //px

const BUBBLE_1 = "BUBBLE_1";
const BUBBLE_2 = "BUBBLE_2";
const BUBBLE_3 = "BUBBLE_3";
const BUBBLE_4 = "BUBBLE_4";
const DETAILS_BUTTON_ID = "DETAILS_BUTTON";

const BUILDING_TOP_CLASSNAME = ".cls-57";

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
  const [bubble1, setBubble1] = useState<HTMLElement | null>(null);
  const [bubble2, setBubble2] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setBubble1((bubble) =>
      bubble ? bubble : document.getElementById(BUBBLE_1)
    );
    setBubble2((bubble) =>
      bubble ? bubble : document.getElementById(BUBBLE_2)
    );

    const svg = document.getElementById("Layer_2") as unknown as SVGElement;
    if (svg) {
      setBuildingTop((buildingTop) =>
        buildingTop ? buildingTop : svg.querySelectorAll(".cls-57")[0]
      );
    }
  }, [startSlideshow]);

  const startOffset = useMemo(() => {
    console.log({
      x: (bubble1?.getBoundingClientRect().width || 0) / 2,
      y: bubble1?.getBoundingClientRect().height || 0,
    });
    return {
      x: (bubble1?.getBoundingClientRect().width || 0) / 2,
      y: bubble1?.getBoundingClientRect().height || 0,
    };
  }, [startSlideshow]);

  const endOffset1 = useMemo(() => {
    return { x: 20, y: 0 };
  }, []);

  const endOffset2 = useMemo(() => {
    return { x: 80, y: 0 };
  }, []);

  return (
    <>
      <div
        className="absolute z-10 top-[72px] overflow-visible h-[calc(65%-72px)] flex flex-col w-full"
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
          <h3
            id="main-text"
            className="font-poppins font-bold text-center text-2xl leading-6 md:text-3xl overflow-visible px-4"
          >
            <span
              id="main-text-1"
              className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-orange-500 to-orange-400"
            >
              Alternativa
            </span>{" "}
            <span
              id="main-text-2"
              className="overflow-visible bg-clip-text text-transparent bg-gradient-to-tr from-[#3A57B6] to-[#557CFC]"
            >
              in furnizarea gazului natural
            </span>
          </h3>
        </div>

        <div className="w-full flex-1 px-2 flex items-center flex-col">
          <div className="h-1/2 w-full max-w-sm flex justify-evenly items-center pt-6 overflow-visible">
            <div
              id={BUBBLE_1}
              className="w-10 h-10 mt-6 rounded-full bg-[#D9E2FE]"
            ></div>
            {startSlideshow &&
              createPortal(
                <>
                  <PathConnector
                    elementsToDodge={[DETAILS_BUTTON_ID]}
                    startRef={bubble1}
                    endRef={buildingTop}
                    endOffset={endOffset1}
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
                  <PathConnector
                    elementsToDodge={[DETAILS_BUTTON_ID]}
                    startRef={bubble2}
                    endRef={buildingTop}
                    endOffset={endOffset2}
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
                </>,
                document.getElementById("root")!
              )}
            <div
              id={BUBBLE_2}
              className="w-10 h-10 rounded-full bg-[#D9E2FE]"
            ></div>
            <div
              id={BUBBLE_3}
              className="w-10 h-10 rounded-full bg-[#D9E2FE]"
            ></div>
            <div
              id={BUBBLE_4}
              className="w-10 h-10 mt-6 rounded-full bg-[#D9E2FE]"
            ></div>
          </div>
          <div className="h-1/2 flex items-center justify-center py-4">
            <Button
              variant="contained"
              id={DETAILS_BUTTON_ID}
              className="font-poppins !font-semibold !rounded-lg !px-4 !py-1 !bg-gradient-to-r from-[#3862ee] to-[#1334a0]"
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
