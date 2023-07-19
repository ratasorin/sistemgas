import Navbar from "components/Navbar/Navbar";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("components/Content/Content"), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-cyan-100">
      <Content />
      <Navbar />
    </div>
  );
};

export default Home;
