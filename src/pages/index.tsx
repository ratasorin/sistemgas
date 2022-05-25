import type { NextPage, GetServerSidePropsResult } from "next";
import Layout from "components/Layout/Layout";
import Header from "components/Header/Header";
import Content from "components/Content/Content";
import Navbar from "components/Navbar/Navbar";
import { promises as fs } from "fs";
import path from "path";
import { store } from "config/redux";
import { Provider } from "react-redux";
const Home: NextPage<{ images: HTMLImageElement[] }> = ({ images }) => {
  return (
    <Provider store={store}>
      {/* <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100;200;300&display=swap'
          rel='stylesheet'
        />
      </Head> */}
      <Layout Header={Header} Content={Content} Navbar={Navbar}></Layout>
    </Provider>
  );
};

export default Home;
