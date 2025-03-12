import {
  END_TRANSITION_DURATION,
  GRAPHICS_CONTAINER_ID,
  PILL_PLACEHOLDER_ID,
  screens,
  TEXT_RENDERED_DIV_ID,
} from "constant";
import { gsap } from "gsap";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CarRender, { useAnimationState } from "./Car/Car";
import Pill, { startSlideshowAtom } from "./pill";
import scene_styles from "./styles.module.css";
import { Positions } from "./Text/helpers/math/coordinates";
import EmbedSvg from "lib/embed-svg";

export interface Render {
  render: () => void;
  update: () => void;
  initializeCanvas: (canvas: HTMLCanvasElement, dpr: number) => void;
  dimensions?: (
    coordinates: Positions
  ) => { width: number; height: number } | Error;
  end: () => void;
}

const getResponsiveCarVelocity = (screenWidth: number) => {
  let speed: number = 6;
  if (screenWidth < screens["xl"]) speed = speed - 0.1;
  if (screenWidth < screens["lg"]) speed = speed - 0.2;
  if (screenWidth < screens["md"]) speed = speed - 0.3;
  if (screenWidth < screens["sm"]) speed = speed - 0.4;

  return speed;
};

const getTextRendererDiv = () => document.getElementById(TEXT_RENDERED_DIV_ID);

const bringTextCanvasFront = () => {
  const textRendererDiv = getTextRendererDiv();
  const graphicsContainer = document.getElementById(GRAPHICS_CONTAINER_ID);

  if (!graphicsContainer || !textRendererDiv) return;

  const rect = textRendererDiv.getBoundingClientRect();

  const y = rect.top - graphicsContainer.getBoundingClientRect().top;

  textRendererDiv.style.top = `${y}px`;

  graphicsContainer.appendChild(textRendererDiv);
};

/**
 * Handle the pill placement if the user has pressed the skip (forceEnd) animation sequence
 * @param announceSlideshowStart *function* - A method to announce all other components (like the pipes and grid background) they can enter the screen
 * @param canvasTextIsFront *MutableRefObject<boolean>* - A flag to signal if the pill was transported to the root div
 */
const handleForceEnd = (
  announceSlideshowStart: () => any,
  canvasTextIsFront: React.MutableRefObject<boolean>
) => {
  // the settimeout is needed to ensure the pill gets dimensions after setting it's width to: animation-finished
  setTimeout(() => {
    const textRendererDiv = getTextRendererDiv();
    if (!textRendererDiv) return;

    const desiredLocation =
      (document.getElementById(PILL_PLACEHOLDER_ID)?.getBoundingClientRect()
        .top || 0) - 2;
    const currentLocation = textRendererDiv.getBoundingClientRect().top;

    const deltaY = desiredLocation - currentLocation;

    if (!canvasTextIsFront.current) {
      bringTextCanvasFront();
      canvasTextIsFront.current = true;
      gsap.to(textRendererDiv, {
        y: deltaY,
        duration: 0,
      });
      announceSlideshowStart();
    } else {
      textRendererDiv.style.top = `${
        Number(textRendererDiv.style.top.replace("px", "")) + deltaY
      }px`;
    }
  }, 50);
};

/**
 * Handle the pill placement and animation when the car exits the canvas
 * @param announceSlideshowStart *function* - A method to announce all other components (like the pipes and grid background) they can enter the screen
 * @param canvasTextIsFront *MutableRefObject<boolean>* - A flag to signal if the pill was transported to the root div
 */
const animatePillOnFinish = (
  announceSlideshowStart: () => any,
  canvasTextIsFront: React.MutableRefObject<boolean>
) => {
  requestAnimationFrame(() => {
    const textRendererDiv = getTextRendererDiv();
    const graphicsContainer = document.getElementById(GRAPHICS_CONTAINER_ID);

    if (!graphicsContainer || !textRendererDiv) return;

    const pillPlaceholder = document.getElementById(PILL_PLACEHOLDER_ID);

    const desiredLocation =
      (pillPlaceholder?.getBoundingClientRect().top || 0) - 2;
    const currentLocation = textRendererDiv.getBoundingClientRect().top;

    const deltaY = desiredLocation - currentLocation;

    if (!canvasTextIsFront.current) {
      bringTextCanvasFront();
      canvasTextIsFront.current = true;

      const textRendererDiv = getTextRendererDiv();
      if (!textRendererDiv) {
        console.error("No text renderer to translate up!");
        return;
      }

      gsap
        .to(textRendererDiv, {
          y: deltaY,
          duration: END_TRANSITION_DURATION / 1000,
          ease: "expo.out",
        })
        .then(() =>
          // set a timeout because the BuildingHQ takes END_TRANSITION_DURATION / 4 (ms) to animate in
          setTimeout(
            () => announceSlideshowStart(),
            END_TRANSITION_DURATION / 4
          )
        );
    } else {
      textRendererDiv.style.top = `${
        Number(textRendererDiv.style.top.replace("px", "")) + deltaY
      }px`;
    }
  });
};

const Scene: FC<{
  width: number;
  height: number;
  imageHeight: number;
  start: boolean;
}> = ({ width, height, imageHeight }) => {
  const { finished, forceEnd } = useAnimationState();

  const carVelocity = useMemo(() => {
    return getResponsiveCarVelocity(width);
  }, [width]);

  const [carLoaded, setCarLoaded] = useState(false);

  const notifyCarLoaded = useCallback(() => setCarLoaded(true), [setCarLoaded]);
  const carRenderer = useMemo(() => {
    if (!carLoaded || finished || forceEnd) return null;

    const carElement = document.getElementById("GAS_TRUCK_CONTAINER");

    if (carVelocity && carElement)
      return new CarRender(carElement, carVelocity);
  }, [carVelocity, carLoaded]);

  const setStartSlideshow = useSetAtom(startSlideshowAtom);
  const canvasTextIsFront = useRef(false);

  /**
   * Handle pill placement on forceEnd or car regular exit (finish)
   */
  useEffect(() => {
    if (!height || !imageHeight) return;

    if (forceEnd) {
      handleForceEnd(() => setStartSlideshow(true), canvasTextIsFront);
    } else if (finished && imageHeight && height) {
      animatePillOnFinish(() => setStartSlideshow(true), canvasTextIsFront);
    }
  }, [finished, imageHeight, height, forceEnd]);

  const [x, setX] = useState(0);

  useEffect(() => {
    let id: number | undefined = undefined;

    if(forceEnd) {
      if (id) window.cancelAnimationFrame(id);
      carRenderer?.remove();
      carRenderer?.end();
    }

    if (carRenderer && !id) {
      carRenderer.start();
      const callback = () => {
        if (carRenderer?.ended) {
          if (id) window.cancelAnimationFrame(id);
          return;
        }
        carRenderer.update();
        carRenderer.render();
        setX((carRenderer?.car?.position || 0) - 400);
        id = window.requestAnimationFrame(callback);
      };

      id = window.requestAnimationFrame(callback);
    }
    return () => {
      if (id) window.cancelAnimationFrame(id);
      carRenderer?.remove();
    };
  }, [carRenderer, forceEnd]);


  return (
    <div className="absolute bottom-0 w-full h-full overflow-hidden z-10">
      <div
        id={TEXT_RENDERED_DIV_ID}
        className={`absolute top-[60vh] z-10 h-max ${scene_styles["centered"]}`}
      >
        <Pill x={x} />
      </div>
      <div className="absolute bottom-0 w-full h-full z-20 overflow-hidden flex items-end -translate-y-[84px]">
        <EmbedSvg
          svgName="gas_truck.svg"
          elementId="GAS_TRUCK_CONTAINER"
          className="h-[40%] -translate-x-full overflow-visible"
          svgClassName="relative h-full -translate-x-full"
          notifySvgLoaded={notifyCarLoaded}
        ></EmbedSvg>
      </div>
    </div>
  );
};

export default Scene;
