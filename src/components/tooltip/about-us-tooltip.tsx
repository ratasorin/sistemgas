import dynamic from "next/dynamic";
import React, { FC } from "react";
import { createPortal } from "react-dom";
import { MdCheck } from "react-icons/md";

export type AboutUsTooltipProps = {
  elementId: string;
};

const AboutUsTooltip: FC<AboutUsTooltipProps> = ({ elementId }) => {
  return createPortal(
    <div
      id={`tooltip-${elementId}`}
      className="border border-slate-400/30 bg-white/40 backdrop-blur-md p-2 max-w-xs rounded-xl text-center mb-2 text-gray-900"
    >
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm mb-2 border border-slate-200 ">
        🎉 Bine ati venit pe site-ul nostru! 👋🏻
      </div>

      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm border border-slate-200 mb-2">
        Desenele cu sigla{" "}
        <span className="text-blue-950 font-bold text-sm">SISTEMGAS</span>{" "}
        dezvaluie mai multe informatii
      </div>
    </div>,
    document.body
  );
};

export default AboutUsTooltip;
