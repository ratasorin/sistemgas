import pill_styles from "./styles.module.css";
import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const ATTRIBUTES = [
  { name: "RAPID 🚀", color: "rgb(255, 28, 28)" },
  { name: "SUSTENABIL 🌱", color: "rgb(0, 177, 0)" },
  { name: "EFICIENT ⌛", color: "rgb(31, 102, 255)" },
  { name: "DE INCREDERE 🤝🏼", color: "rgb(245, 135, 32)" },
];

export const pillDimensionsAtom = atom({ width: 0, height: 0 });
export const startSlideshowAtom = atom(false);

const Pill: FC<{ x: number }> = ({ x }) => {
  const [width, setWidth] = useState<number | "finished-animation">(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const [pillDimensions, setPillDimensions] = useAtom(pillDimensionsAtom);

  const pill = useRef<HTMLDivElement | null>(null);
  const interval = useRef<NodeJS.Timer | undefined>(undefined);
  const startSlideshow = useAtomValue(startSlideshowAtom);

  useEffect(() => {
    if (!pill.current) return;

    if (x < pill.current.getBoundingClientRect().left) {
      setWidth(0);
      return;
    }
    if (
      x >
      pill.current.getBoundingClientRect().left +
        pill.current.getBoundingClientRect().width
    ) {
      setWidth("finished-animation");
      clearInterval(interval.current);
      return;
    }

    setWidth(x - pill.current.getBoundingClientRect().left);
  }, [setWidth, x]);

  const [attribute, setAttribute] = useState(ATTRIBUTES[0]);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (startSlideshow)
      interval = setInterval(() => {
        setAttribute((a) => {
          const index = ATTRIBUTES.findIndex((attr) => attr === a);
          if (index !== undefined && index < ATTRIBUTES.length - 1)
            return ATTRIBUTES[index + 1];
          else return ATTRIBUTES[0];
        });
      }, 3000);

    return () => clearInterval(interval);
  }, [setAttribute, startSlideshow]);

  const resizeObserver = useRef(
    new ResizeObserver((mutation) => {
      const width = mutation[0].contentRect.width;
      setPillDimensions((dimensions) =>
        !dimensions.width || !dimensions.height
          ? {
              height: mutation[0].contentRect.height,
              width: mutation[0].contentRect.width,
            }
          : dimensions
      );

      setMaxWidth(width);
    })
  );

  useEffect(() => {
    if (pill.current) resizeObserver.current.observe(pill.current);
    return () => resizeObserver.current.disconnect();
  }, []);

  const [slideshowClassName, setSlideShowClassName] = useState("");
  useEffect(() => {
    if (startSlideshow)
      setTimeout(() => {
        setSlideShowClassName(pill_styles["start-slideshow"]);
      }, 1500);
  }, [startSlideshow]);

  return (
    <>
      <div
        className={`${pill_styles["card"]} ${pill_styles["example-2"]} ${
          width === "finished-animation" ? pill_styles["animate-width"] : ""
        } ${slideshowClassName}`}
        style={{
          wordBreak: "keep-all",
          whiteSpace: "nowrap",
          display: width === 0 ? "none" : "block",
          width: width === "finished-animation" ? maxWidth : width,
        }}
      >
        <div className={pill_styles["inner"]} style={{ overflow: "visible" }}>
          <motion.span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflow: "visible",
            }}
          >
            🔥 SISTEMGAS este furnizorul:{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={attribute.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: attribute.color,
                  display: "inline-block",
                  overflow: "visible",
                }}
              >
                {attribute.name}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </div>
      </div>

      <div
        className={`${pill_styles["card"]} ${pill_styles["example-2"]}`}
        ref={pill}
        style={{
          wordBreak: "keep-all",
          whiteSpace: "nowrap",
          visibility: "hidden",
          position: "absolute",
          top: 0,
        }}
      >
        <div className={pill_styles["inner"]}>
          <span>🔥 SISTEMGAS este furnizorul: {attribute.name}</span>
        </div>
      </div>
    </>
  );
};

export default Pill;
