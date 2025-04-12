import { poppers } from "components/Content/helper/animte-component-on-hover";
import { shouldExit, updateLastElementHovered } from "lib/debounce-hover";
import React, { FC, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Tooltip: FC<{
  tooltipTitle: string;
  masterId: string;
}> = ({ tooltipTitle, masterId }) => {
  const onLeave = useCallback(() => {
    const master = document.getElementById(masterId);
    if (!master) return;

    shouldExit(master, (lastElementHovered) => {
      const popper = poppers.find((popper) => popper.reference.id === masterId);
      if (popper) popper.hide();

      const hoverClassName = [...lastElementHovered.classList.values()].find(
        (className) => className.includes("svg-hover")
      );
      if (hoverClassName) lastElementHovered.classList.remove(hoverClassName);
    });
  }, []);

  const onEnter = useCallback(() => {
    const master = document.getElementById(masterId);
    if (!master) return;

    // keep those to functions returning nulls to make sure we update the last element hovered!
    updateLastElementHovered(master, {
      effect: () => null,
      cleanup: () => null,
    });
  }, []);

  const [element, setElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    element?.addEventListener("mouseleave", onLeave);
    element?.addEventListener("mouseenter", onEnter);

    return () => {
      if(element) {
        element.removeEventListener("mouseleave", onLeave);
        element.addEventListener("mouseenter", onEnter);
      }
    };
  }, [element, masterId]);

  return ReactDOM.createPortal(
    <div
      ref={(element) => {
        if (element) setElement(element);
      }}
      id={`tooltip-${masterId}`}
    >
      <button className="mb-2 p-2 text-xl bg-white rounded-lg border-2 font-poppins font-semibold border-slate-200 text-slate-800">
        {tooltipTitle}
      </button>
    </div>,
    document.body
  );
};

export default Tooltip;
