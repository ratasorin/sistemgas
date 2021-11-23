import type { NextPage } from "next";
import { FC } from "react";
import Layout from "../components/Layout/Layout";
import Header from "../components/Header/Header";
import Head from "next/head";
import MainScene from "../components/MainScene/MainScene";
import Navbar from "../components/Navbar/Navbar";
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100;200;300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout Header={Header} MainScene={MainScene} Navbar={Navbar}></Layout>
    </div>
  );
};

export default Home;
