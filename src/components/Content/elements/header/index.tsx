import {
  pillDimensionsAtom,
  startSlideshowAtom,
} from "components/Content/Scene/pill";
import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import header_styles from "./header.module.css";
import { Button } from "@mui/material";
import EmojiScroll from "./emoji-scroll";

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

    console.log({ condition: largestPillWidth < window.innerWidth - 4 * m4 });

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
  console.log({ startSlideshow });

  return (
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
            !startSlideshow && pillDimensions[0]?.width ? "visible" : "hidden",
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
        id="main-text"
        style={{
          position: "relative",
          gap: window.innerHeight < 680 ? "12px" : "16px",
        }}
        className="overflow-visible left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center"
      >
        <h3 className="font-poppins px-8 font-extrabold text-center text-[32px] leading-9 md:text-5xl overflow-visible">
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
  );
};

export default Header;
