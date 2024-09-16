import {
  LANDING_PAGE_BUILDING_SVG_ID,
  LANDING_PAGE_EMPLOYEE_SVG_ID,
  LANDING_PAGE_GAS_TANK_SVG_ID,
  LANDING_PAGE_TRUCKS_SVG_ID,
} from "constant";
import dynamic from "next/dynamic";

const Tooltip = dynamic(() => import("components/tooltip/index"), {
  ssr: false,
});

const AboutUsTooltip = dynamic(
  () => import("components/tooltip/about-us-tooltip"),
  { ssr: false }
);

export const landingPageTooltips = [
  { title: "ACASA", id: LANDING_PAGE_BUILDING_SVG_ID, tooltip: Tooltip },
  {
    title: "DESPRE NOI",
    id: LANDING_PAGE_EMPLOYEE_SVG_ID,
    tooltip: AboutUsTooltip,
  },
  { title: "SERVICII", id: LANDING_PAGE_GAS_TANK_SVG_ID, tooltip: Tooltip },
  { title: "NOUTATI", id: LANDING_PAGE_TRUCKS_SVG_ID, tooltip: Tooltip },
];
