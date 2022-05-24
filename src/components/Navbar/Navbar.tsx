import { FC } from "react";
import navbar from "./navbar.module.css";
import NavbarElement from "./NavbarElement/NavbarElement";

const Navbar: FC<{ images: HTMLImageElement[] }> = ({ images }) => {
  return (
    <div className={navbar.container}>
      {images.map((image, index) => (
        <NavbarElement key={index} {...image}></NavbarElement>
      ))}
    </div>
  );
};

export default Navbar;
