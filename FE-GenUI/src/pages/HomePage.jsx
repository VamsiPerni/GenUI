import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { SessionManager } from "../components/sessionManager";
import { FiPlus, FiArrowRight, FiClock, FiEdit2 } from "react-icons/fi";
import { SessionManagerHome } from "../components/sessionManagerHome";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50">
      <Navbar />

      <main className="flex-grow flex flex-col items-center px-4 py-8 md:py-12">
        <div className="max-w-4xl w-full text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-indigo-600">GenUI</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Your AI-powered micro-frontend generator to build, preview, and
            deploy components with ease.
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <SessionManagerHome />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { HomePage };
