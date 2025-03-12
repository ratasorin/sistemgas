import { useAnimationState } from "components/Content/Scene/Car/Car";
import { atom, useSetAtom } from "jotai";
import { FC, useCallback, useEffect, useRef } from "react";
import { create } from "zustand";

interface SvgStoreInterface {
  svgCollection: { [x: string]: HTMLElement | null };
  setSvg: (svg: HTMLElement, id: string) => void;
}

const useSvgStore = create<SvgStoreInterface>((set) => ({
  svgCollection: {},
  setSvg: (svg, id) => {
    set((state) => ({
      svgCollection: { ...state.svgCollection, [id]: svg },
    }));
  },
}));

export const useSvg = (elementId: string) => {
  const { svgCollection } = useSvgStore();
  return svgCollection[elementId];
};


const EmbedSvg: FC<{
  className?: string;
  svgClassName?: string;
  elementId: string;
  svgName: string;
  notifySvgLoaded?: () => void;
}> = ({ elementId, svgName, className, svgClassName, notifySvgLoaded }) => {
  const svgCreated = useRef(false);
  const { setSvg } = useSvgStore();
  const element = useRef<HTMLDivElement | null>(null);
  
  const getSVG = useCallback(async () => {
    const svg = fetch(svgName).then((response) =>
      response.text().then((text) => {
        const parser = new DOMParser();
        const parsedSvg = parser.parseFromString(
          text,
          "image/svg+xml"
        ).documentElement;
        if(notifySvgLoaded)
          notifySvgLoaded();
        return parsedSvg;
      })
    );

    return svg;
  }, [notifySvgLoaded]);
  
  useEffect(() => {
    if (document && !svgCreated.current) {
      svgCreated.current = true;
      getSVG().then((svg) => {
        if (!svg) return null;
        document.getElementById(elementId)!.appendChild(svg);
        setSvg(svg, elementId);
        if (svgClassName) {
          const classes = svgClassName.split(" ");
          svg.classList.add(...classes);
        }
      });
    }
  }, []);

  return <div ref={element} className={className} id={elementId}></div>;
};

export default EmbedSvg;
