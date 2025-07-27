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
      ErrorToast("Logout Successfull !!");
      window.location.reload();
    } catch (err) {
      ErrorToast(err.message);
    }
  };

  const handleOpenProfilePage = () => {
    navigate("/profile");
  };

  return (
    <div className="p-6 flex items-center justify-between bg-amber-200">
      <div>My App</div>
      <div></div>
      <div className="flex gap-4 ">
        <Link to="/">Home</Link>
        {!isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
            <Link to="/signup" className="text-blue-500 underline">
              Signup
            </Link>
          </div>
        ) : (
          <>
            <button
              className="py-1 px-2 border-1 border-blue-600 bg-blue-200 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div
              onClick={handleOpenProfilePage}
              className="h-10 w-10 rounded-full bg-indigo-900 text-amber-100 text-xl flex items-center justify-center"
            >
              <p>{user?.email?.substr(0, 1)?.toUpperCase()}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { Navbar };
