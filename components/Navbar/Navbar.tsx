import type { NextPage, GetStaticPropsResult } from "next";
import { InferGetStaticPropsType } from "next";
// import getImages from "../../pages/api/hello";
import { GetStaticProps } from "next";
import navbar from "./navbar.module.css";
import NavbarElement from "./NavbarElement/NavbarElement";
import fs from "fs";
import path from "path";

const Navbar: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  images,
}) => {
  return (
    <div className={navbar.container}>
      {images.map((image, index) => (
        <NavbarElement key={index} {...image}></NavbarElement>
      ))}
    </div>
  );
};
export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ images: HTMLImageElement[] }>
> {
  const Path = path.join(process.cwd(), "/public/NavbarImages");
  const images: HTMLImageElement[] = [];
  await fs.readdir(Path, (err, files: string[]) => {
    files.map((file) => {
      console.log(file);
      const image = new Image();
      image.src = file;
      images.push(image);
    });
  });
  console.log("Path");
  return {
    props: {
      images: images,
    },
  };
}
export default Navbar;
