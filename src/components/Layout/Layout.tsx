import { ComponentType, FC } from "react";
interface Component {
  Header: FC;
  Content: ComponentType;
  Navbar?: FC<{ images: HTMLImageElement[] }>;
  Body?: FC;
}

const Layout: FC<Component> = ({ Header, Content, Navbar }) => {
  return (
    <div className="w-screen h-screen flex flex-col bg-slate-100">
      <Content />
    </div>
  );
};

export default Layout;
