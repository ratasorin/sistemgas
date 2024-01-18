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

const EmbedSvg: FC<{ elementId: string; svgName: string }> = ({
  elementId,
  svgName,
}) => {
  const svgCreated = useRef(false);
  const { setSvg } = useSvgStore();
  const getSVG = useCallback(async () => {
    const svg = fetch(svgName).then((r) =>
      r.text().then((t) => {
        const parser = new DOMParser();
        const parsedSvg = parser.parseFromString(
          t,
          "image/svg+xml"
        ).documentElement;
        return parsedSvg;
      })
    );

    return svg;
  }, []);
  useEffect(() => {
    if (document && !svgCreated.current) {
      svgCreated.current = true;
      getSVG().then((svg) => {
        if (!svg) return null;
        document.getElementById(elementId)!.appendChild(svg);
        setSvg(svg, elementId);
      });
    }
  });
  return <div id={elementId}></div>;
};

export default EmbedSvg;
