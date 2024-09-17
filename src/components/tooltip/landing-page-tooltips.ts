import {
  LANDING_PAGE_BUILDING_SVG_ID,
  LANDING_PAGE_EMPLOYEE_SVG_ID,
  LANDING_PAGE_GAS_TANK_SVG_ID,
  LANDING_PAGE_TRUCKS_SVG_ID,
} from "constant";

export type TooltipType = "default" | "about-us";

export const landingPageTooltips: {
  title: string;
  id: string;
  tooltip: TooltipType;
}[] = [
  { title: "ACASA", id: LANDING_PAGE_BUILDING_SVG_ID, tooltip: "default" },
  {
    title: "DESPRE NOI",
    id: LANDING_PAGE_EMPLOYEE_SVG_ID,
    tooltip: "about-us",
  },
  { title: "SERVICII", id: LANDING_PAGE_GAS_TANK_SVG_ID, tooltip: "default" },
  { title: "NOUTATI", id: LANDING_PAGE_TRUCKS_SVG_ID, tooltip: "default" },
];
