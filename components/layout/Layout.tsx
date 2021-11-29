import type { NextPage } from "next";
import layout from "./layout.module.css";
interface Component {
  Header: NextPage;
  MainScene: NextPage;
  Navbar: NextPage<{ images: HTMLImageElement[] }>;
  Body?: NextPage;
}

const Layout: NextPage<Component> = ({ Header, MainScene, Navbar }) => {
  return (
    <div className={layout.default}>
      <Header></Header>
      <Navbar images={[] as HTMLImageElement[]}></Navbar>
      <MainScene></MainScene>
    </div>
  );
};

export default Layout;
