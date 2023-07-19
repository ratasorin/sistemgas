import type { NextPage, GetServerSidePropsResult } from "next";
import Layout from "components/Layout/Layout";
import Navbar from "components/Navbar/Navbar";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});

const Home: NextPage<{ images: HTMLImageElement[] }> = ({ images }) => {
  return <Layout Content={Content} Navbar={Navbar}></Layout>;
};

export default Home;
