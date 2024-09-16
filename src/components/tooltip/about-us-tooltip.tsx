import dynamic from "next/dynamic";
import React, { FC } from "react";
import { createPortal } from "react-dom";
import { MdCheck } from "react-icons/md";

export type AboutUsTooltipProps = {
  tooltipTitle: string;
  elementId: string;
};

const AboutUsTooltip: FC<AboutUsTooltipProps> = ({
  elementId,
  tooltipTitle,
}) => {
  return createPortal(
    <div
      id={`tooltip-${elementId}`}
      className="border border-slate-400/30 bg-white/40 backdrop-blur-md p-3 w-full rounded-xl text-center mb-3"
    >
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-xl max-w-md mb-2 border border-slate-200">
        Bine ati venit pe site-ul nostru!
      </div>
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-xl max-w-md border border-slate-200 mb-2">
        <span className="font-bold text-blue-900">SISTEMGAS</span> este alegerea
        <br />
        <div className="w-full flex items-center justify-center font-medium text-green-600 mt-2">
          <MdCheck className="text-2xl mr-1" /> practică
        </div>
        <div className="w-full flex items-center justify-center font-medium text-green-600">
          <MdCheck className="text-2xl mr-1" /> rentabilă
        </div>
        <div className="w-full flex items-center justify-center font-medium text-green-600 mb-2">
          <MdCheck className="text-2xl mr-1" /> sustenabilă
        </div>
        pentru aprovizionarea cu
        <br />
        gaz petrolier lichefiat
      </div>

      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-xl max-w-md border border-slate-200">
        <button className="border border-slate-300 px-3 py-1 rounded-md uppercase font-semibold text-slate-900">
          Vezi mai multe
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AboutUsTooltip;
