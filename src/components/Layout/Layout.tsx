import { ComponentType, FC } from "react";
interface Component {
  Content: ComponentType;
  Navbar?: FC<{ images: HTMLImageElement[] }>;
  Body?: FC;
}

const Layout: FC<Component> = ({ Content, Navbar }) => {
  return (
    <div className="w-screen h-screen flex flex-col bg-cyan-100">
      <Content />
    </div>
  );
};

export default Layout;
