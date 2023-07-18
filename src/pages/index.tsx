import type { NextPage, GetServerSidePropsResult } from "next";
import Layout from "components/Layout/Layout";
import Header from "components/Header/Header";
import Navbar from "components/Navbar/Navbar";
import { store } from "config/redux";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});

const Home: NextPage<{ images: HTMLImageElement[] }> = ({ images }) => {
  return (
    <Provider store={store}>
      <Layout Header={Header} Content={Content} Navbar={Navbar}></Layout>
    </Provider>
  );
};

export default Home;
