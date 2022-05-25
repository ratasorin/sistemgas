import { FC } from "react";
import navbar from "./navbar.module.css";
import NavbarElement from "./NavbarElement/NavbarElement";

const SECTIONS = ["DESPRE NOI", "ACASA", "CONTACT", "NOUTATI", "SERVICII"];

const Navbar: FC = () => {
  return (
    <div className={navbar.container}>
      {SECTIONS.map((section) => (
        <NavbarElement key={section} section={section}></NavbarElement>
      ))}
    </div>
  );
};

export default Navbar;
