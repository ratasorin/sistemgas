import { FC } from "react";
import layout from "./layout.module.css";
interface Component {
  Header: FC;
  Content: FC;
  Navbar?: FC<{ images: HTMLImageElement[] }>;
  Body?: FC;
}

const Layout: FC<Component> = ({ Header, Content, Navbar }) => {
  return (
    <div className='w-screen h-screen flex flex-col bg-slate-100'>
      <Header></Header>
      {/* <Navbar images={[] as HTMLImageElement[]}></Navbar> */}
      <Content />
    </div>
  );
};

export default Layout;
