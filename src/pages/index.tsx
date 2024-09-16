import { landingPageTooltips } from "components/tooltip/landing-page-tooltips";
import dynamic from "next/dynamic";
import Head from "next/head";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});

const Navbar = dynamic(() => import("components/Navbar/Navbar"), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <Head>
        <title>Sistemgas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />
      <div
        id="root"
        className="relative w-screen h-screen flex flex-col overflow-y-hidden justify-center"
      >
        <Content />
        {landingPageTooltips.map((el) => (
          <el.tooltip elementId={el.id} tooltipTitle={el.title} />
        ))}
      </div>
    </>
  );
};

export default Home;
