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
import { bubblesDimensionAtom, computePathAround } from "../bubbles";
import { sistemgasHQBBoxAtom } from "components/Content/Content";
import GlowingPath from "../bubbles/svg-glow";
import { Position } from "@xyflow/react";

const m4 = 16; //px

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
  const bubbleDimension = useAtomValue(bubblesDimensionAtom);

  const sistemgasHQBBox = useAtomValue(sistemgasHQBBoxAtom);

  const innerLeftBubble = useRef<HTMLDivElement | null>(null);
  const leftmostPathElement = useRef<SVGPathElement | null>(null);
  const leftmostPathElementGlow = useRef<SVGPathElement | null>(null);

  const innerLeftPath = computePathAround({
    elementsId: [],
    destination: {
      x: (sistemgasHQBBox?.width || 0) / 3 + 60,
      y: window.innerHeight - (sistemgasHQBBox?.height || 0) / 3,
    },
    source: innerLeftBubble,
    destinationPosition: Position.Left,
  });

  return (
    <>
      <GlowingPath
        reference={leftmostPathElementGlow}
        pathData={innerLeftPath || ""}
        color="#FFDEA1"
      />
      <svg
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "4",
        }}
      >
        <path
          fill="transparent"
          stroke="#FFDEA1"
          d={innerLeftPath}
          strokeWidth={2}
          ref={leftmostPathElement}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute z-10 top-[52px] overflow-visible h-[calc(45%-52px)] flex flex-col w-full"
        style={{
          justifyContent: largestPillFitsScreenWidth ? "center" : "flex-end",
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
            gap: window.innerHeight < 680 ? "12px" : "16px",
          }}
          className="overflow-visible left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center"
        >
          <h3
            id="main-text"
            className="font-poppins font-extrabold text-center text-[32px] leading-9 md:text-5xl overflow-visible"
          >
            <span
              id="main-text-1"
              className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-400"
            >
              Alternativa
            </span>{" "}
            <span
              id="main-text-2"
              className="overflow-visible bg-clip-text text-transparent bg-gradient-to-r from-[#1334a0] to-[#3862ee]"
            >
              in furnizarea gazului natural
            </span>
          </h3>
          <div className="w-full h-full flex items-center justify-center gap-5">
            <div
              ref={innerLeftBubble}
              style={{
                width: bubbleDimension,
                height: bubbleDimension,
                border: "2px solid #FFDEA1",
                backgroundColor: "#FFF4DE",
                filter: `url(#line-glow)`, // Apply the filter to the div
                borderRadius: "50%",
              }}
            ></div>
            <Button
              variant="contained"
              className="font-poppins !font-semibold !rounded-lg !bg-gradient-to-r from-[#3862ee] to-[#1334a0]"
            >
              INCEARCA ACUM
            </Button>
            <div
              style={{
                width: bubbleDimension,
                height: bubbleDimension,
                border: "2px solid #92FFB3",
                backgroundColor: "#D7FFE3",
                filter: `url(#line-glow)`, // Apply the filter to the div
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
