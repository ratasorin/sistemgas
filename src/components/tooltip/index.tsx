import { poppers } from "components/Content/Content";
import { shouldExit, updateLastElementHovered } from "lib/debounce-hover";
import React, { FC } from "react";
import ReactDOM from "react-dom";

const Tooltip: FC<{ tooltipTitle: string; elementId: string }> = ({
  tooltipTitle,
  elementId,
}) => {
  return ReactDOM.createPortal(
    <div
      ref={(el) => {
        if (!el) return;
        el.addEventListener("mouseenter", () => {
          updateLastElementHovered(el, null, null);
        });

        el.addEventListener("mouseleave", () => {
          shouldExit(el, (lastElementHovered) => {
            const popper = poppers.find(
              (popper) => popper.props.content === el
            );
            if (popper) popper.hide();

            const hoverClassName = [
              ...lastElementHovered.classList.values(),
            ].find((className) => className.includes("svg-hover"));
            if (hoverClassName)
              lastElementHovered.classList.remove(hoverClassName);
          });
        });
      }}
      id={`tooltip-${elementId}`}
    >
      <button className="mb-2 p-2 text-xl bg-white rounded-lg border-2 font-poppins font-semibold border-slate-200 text-slate-800">
        {tooltipTitle}
      </button>
    </div>,
    document.body
  );
};

export default Tooltip;
