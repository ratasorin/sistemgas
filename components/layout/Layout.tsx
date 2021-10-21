import type { NextPage } from "next";
import layout from "./layout.module.css";

interface Component {
  Header: NextPage;
  MainHeader: NextPage;
  Navbar?: NextPage;
  Body?: NextPage;
}

const Layout: NextPage<Component> = ({ Header, MainHeader }) => {
  return (
    <div className={layout.default}>
      <Header></Header>
      <MainHeader></MainHeader>
    </div>
  );
};

export default Layout;
