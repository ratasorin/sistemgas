"use client";

import Marquee from "components/Content/elements/marquee/Marquee";
import { landingPageTooltips } from "components/tooltip/landing-page-tooltips";
import { AnimationProvider } from "lib/animation/manage";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});

const Navbar = dynamic(() => import("components/Navbar/Navbar"), {
  ssr: false,
});

const Tooltip = dynamic(() => import("components/tooltip"), { ssr: false });
const AboutUsTooltip = dynamic(
  () => import("components/tooltip/about-us-tooltip"),
  { ssr: false }
);

const Home = () => {
  return (
    <AnimationProvider>
      <Navbar />
      <div
        id="root"
        className="relative w-screen h-screen flex flex-col overflow-y-hidden justify-center"
      >
        <Content />

      </div>
      {landingPageTooltips.map((el) =>
        el.tooltip === "default" ? (
          <Tooltip key={el.id} masterId={el.id} tooltipTitle={el.title} />
        ) : (
          <AboutUsTooltip key={el.id} elementId={el.id} />
        )
      )}
    </AnimationProvider>
  );
};

export default Home;
