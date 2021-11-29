import type { NextPage } from "next";

const NavbarElement: NextPage<HTMLImageElement> = (image) => {
  console.log(image.src);
  return <div> {image} </div>;
};

export default NavbarElement;
