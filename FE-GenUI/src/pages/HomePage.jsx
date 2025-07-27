import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div>
        <p>HomePage</p>
      </div>
      <Footer />
    </div>
  );
};

export { HomePage };
