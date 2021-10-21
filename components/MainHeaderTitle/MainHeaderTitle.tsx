import { NextPage } from "next";
import title_page from "./main-header-title.module.css";
const Title: NextPage = () => {
  return (
    <div className={title_page.container}>
      <div className={title_page.title}> Solutia Alternativa </div>
      <div className={title_page.subtitle}>
        pentru furnizarea gazelor naturale
      </div>
    </div>
  );
};

export default Title;
