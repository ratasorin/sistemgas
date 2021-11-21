import type { NextPage } from "next";
import layout from "./layout.module.css";
interface Component {
  Header: NextPage;
  MainScene: NextPage;
  Navbar: NextPage;
  Body?: NextPage;
}

const Layout: NextPage<Component> = ({ Header, MainScene, Navbar }) => {
  return (
    <div className={layout.default}>
      <Header></Header>
      <Navbar></Navbar>
      <MainScene></MainScene>
    </div>
  );
};

export default Layout;
