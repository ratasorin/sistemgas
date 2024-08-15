import Navbar from "components/Navbar/Navbar";
import { landingPageTooltips } from "components/tooltip/landing-page-tooltips";
import dynamic from "next/dynamic";
import Head from "next/head";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});
const Tooltip = dynamic(() => import("components/tooltip/index"), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <Head>
        <title>Sistemgas</title>
      </Head>
      <div id="root" className="w-screen h-screen flex flex-col bg-cyan-100">
        <Content />
        <Navbar />
        {landingPageTooltips.map((el) => (
          <Tooltip tooltipTitle={el.title} elementId={el.id} />
        ))}
      </div>
    </>
  );
};

export default Home;
