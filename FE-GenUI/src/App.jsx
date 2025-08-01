import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { useAppContext } from "./contexts/appContext";
import { BounceLoader, HashLoader } from "react-spinners";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SessionPage } from "./pages/SessionPage";
import { SessionManager } from "./components/sessionManager";
import SessionDetail from "./components/sessionDetail";

const App = () => {
  const { appLoading, user } = useAppContext();

  const { isAuthenticated } = user;

  if (appLoading) {
    return (
      <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 content-center">
        <HashLoader size="175" color="#2020ff" />
        <div className="border-1 border-lime-800 p-8 rounded-lg">
          <p>Please note:</p>
          <p>Backend is hosted on free server</p>
          <p>It may take upto 2 minutes to warmup (for the first time)!</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<HomePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/session" element={<SessionManager />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/session/detail/:id" element={<SessionDetail />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
