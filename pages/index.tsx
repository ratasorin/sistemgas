import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsResult,
} from "next";
import Layout from "../components/Layout/Layout";
import Header from "../components/Header/Header";
import Head from "next/head";
import MainScene from "../components/MainScene/MainScene";
import Navbar from "../components/Navbar/Navbar";
import { promises as fs } from "fs";
import path from "path";

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
export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<{ images: HTMLImageElement[] }>
> {
  const Path = path.join(process.cwd(), "public", "NavbarImages");
  const images: HTMLImageElement[] = [];
  const filenames = await fs.readdir(Path);
  console.log(filenames);
  return {
    props: {
      images: images,
    },
  };
}
export default Home;
