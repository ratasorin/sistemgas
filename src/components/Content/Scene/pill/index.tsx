import pill_styles from "./styles.module.css";
import { FC, useEffect, useRef, useState } from "react";
import { m, motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useAnimationState } from "../Car/Car";

const ATTRIBUTES = [
  { id: 0, name: "RAPID 🚀", color: "rgb(255, 28, 28)" },
  { id: 1, name: "SUSTENABIL 🌱", color: "rgb(0, 177, 0)" },
  { id: 2, name: "EFICIENT ⌛", color: "rgb(31, 102, 255)" },
  { id: 3, name: "DE INCREDERE 🤝🏼", color: "rgb(245, 135, 32)" },
];

export const pillDimensionsAtom = atom<
  Record<string, { width: number; height: number }>
>({});

export const startSlideshowAtom = atom(false);

const Pill: FC<{ x: number }> = ({ x }) => {
  const { forceEnd } = useAnimationState();
  const [width, setWidth] = useState<number | "finished-animation">(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const [pillDimensions, setPillDimensions] = useAtom(pillDimensionsAtom);
  const interval = useRef<NodeJS.Timer | undefined>(undefined);
  const startSlideshow = useAtomValue(startSlideshowAtom);

  const referencePill = useRef<HTMLElement | null>(null);
  const pills = useRef<
    { element: HTMLElement; attribute: (typeof ATTRIBUTES)[number] }[]
  >([]);

  useEffect(() => {
    const measuredPills = pills.current.reduce((obj, pill) => {
      return {
        ...obj,
        [pill.attribute.id]: {
          width: pill.element.getBoundingClientRect().width,
          height: pill.element.getBoundingClientRect().height,
        },
      };
    }, {} as Record<number, { width: number; height: number }>);
    setPillDimensions((p) => ({
      ...p,
      ...measuredPills,
    }));
  }, [setPillDimensions]);

  useEffect(() => {
    const referencePillBoundingBox =
      referencePill.current?.getBoundingClientRect();

    if (forceEnd) {
      console.log("HERE!");
      setWidth("finished-animation");
      clearInterval(interval.current);
      return;
    }

    if (!referencePillBoundingBox) return;

    if (x < referencePillBoundingBox.left) {
      setWidth(0);
      return;
    }
    if (x > referencePillBoundingBox.left + referencePillBoundingBox.width) {
      setWidth("finished-animation");
      clearInterval(interval.current);
      return;
    }

    setWidth(x - referencePillBoundingBox.left);
  }, [setWidth, x, forceEnd]);

  const [attribute, setAttribute] = useState(ATTRIBUTES[0]);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (startSlideshow)
      interval = setInterval(() => {
        setAttribute((a) => {
          const index = ATTRIBUTES.findIndex((attr) => attr === a);
          if (index !== undefined && index < ATTRIBUTES.length - 1)
            return ATTRIBUTES[index + 1];
          else {
            return ATTRIBUTES[0];
          }
        });
      }, 3000);

    return () => clearInterval(interval);
  }, [setAttribute, startSlideshow]);

  useEffect(() => {
    if (pillDimensions[attribute.id])
      setMaxWidth(pillDimensions[attribute.id].width);
  }, [attribute, pillDimensions]);

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
        id="presentation-pill"
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

      {ATTRIBUTES.map((attr) => {
        return (
          <div
            className={`${pill_styles["card"]} ${pill_styles["example-2"]}`}
            ref={(e) => {
              if (e) {
                pills.current.push({ element: e, attribute: attr });
                if (attr.id === 0) referencePill.current = e;
              }
            }}
            style={{
              wordBreak: "keep-all",
              whiteSpace: "nowrap",
              visibility: "hidden",
              position: "absolute",
              top: 0,
            }}
          >
            <div className={pill_styles["inner"]}>
              <span>🔥 SISTEMGAS este furnizorul: {attr.name}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Pill;
