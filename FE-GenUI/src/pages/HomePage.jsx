import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { SessionManager } from "../components/sessionManager";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#f8fafc] to-[#e2e8f0]">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-700">GenUI</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Your AI-powered micro-frontend generator to build, preview, and deploy
          frontend components with ease.
        </p>
      </main>
      <SessionManager />
      <Footer />
    </div>
  );
};

export { HomePage };
