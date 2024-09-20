import { landingPageTooltips } from "components/tooltip/landing-page-tooltips";
import dynamic from "next/dynamic";
import Head from "next/head";

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
    <>
      <Head>
        <title>Sistemgas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />
      <div
        id="root"
        className="relative w-screen h-screen flex flex-col overflow-y-hidden justify-center"
      >
        <Content />
      </div>
      {landingPageTooltips.map((el) =>
        el.tooltip === "default" ? (
          <Tooltip elementId={el.id} tooltipTitle={el.title} />
        ) : (
          <AboutUsTooltip elementId={el.id} />
        )
      )}
    </>
  );
};

export default Home;
