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
      className="border border-slate-400/30 bg-white/40 backdrop-blur-md p-3 max-w-md rounded-xl text-center mb-3 text-gray-600"
    >
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md mb-2 border border-slate-200 ">
        🎉 Bine ati venit pe site-ul nostru! 👋🏻
      </div>

      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md border border-slate-200 flex flex-col mb-2">
        In primul rand:
        <button className="border border-slate-300 px-3 py-1 rounded-md uppercase font-semibold text-slate-900 mt-1">
          AFLA OFERTELE
        </button>
      </div>

      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md border border-slate-200 flex flex-col">
        Sau apasa pe cladire pentru:
        <button className="border border-slate-300 px-3 py-1 rounded-md uppercase font-semibold text-slate-900 mt-1">
          Detalii despre noi
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AboutUsTooltip;
