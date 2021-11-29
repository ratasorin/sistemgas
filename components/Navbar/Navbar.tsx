import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsResult,
} from "next";
import navbar from "./navbar.module.css";
import NavbarElement from "./NavbarElement/NavbarElement";

const Navbar: NextPage<{ images: HTMLImageElement[] }> = ({ images }) => {
  return (
    <div className={navbar.container}>
      {images.map((image, index) => (
        <NavbarElement key={index} {...image}></NavbarElement>
      ))}
    </div>
  );
};

export default Navbar;
