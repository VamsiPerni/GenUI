import { Link, useNavigate } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const Navbar = () => {
  const { user = {} } = useAppContext();
  const navigate = useNavigate();
  const { isAuthenticated } = user;

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      ErrorToast("Logout Successful!");
      window.location.reload();
    } catch (err) {
      ErrorToast(err.message);
    }
  };

  const handleOpenProfilePage = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-[#1e1e2f] text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-400">
          {" "}
          <Link to="/">GenUI</Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <Link
            to="/session"
            className="hover:text-indigo-400 transition-colors"
          >
            Sessions
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-indigo-300 hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-indigo-300 hover:underline">
                Signup
              </Link>
            </>
          ) : (
            <>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md transition"
                onClick={handleLogout}
              >
                Logout
              </button>
              <div
                onClick={handleOpenProfilePage}
                className="h-10 w-10 rounded-full bg-indigo-400 text-white text-lg flex items-center justify-center cursor-pointer"
              >
                {user?.email?.charAt(0)?.toUpperCase()}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
