import { useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { HashLoader } from "react-spinners";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        ErrorToast("Email & password are required!");
        return;
      }

      const dataObj = {
        email,
        password,
      };

      const result = await axiosInstance.post("/auth/login", dataObj);

      if (result.status === 200) {
        SuccessToast(result.data.message);
        window.open("/", "_self");
      } else {
        ErrorToast(result.data.message);
      }
    } catch (err) {
      ErrorToast(
        `Cannot signup: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <HashLoader size={120} color="#10b981" speedMultiplier={1.2} />
        <div className="mt-6 text-gray-700">Verifying Credentials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-cyan-200">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Welcome Back
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-600 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-indigo-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 mt-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg shadow-md transition"
          >
            Login
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { LoginPage };
