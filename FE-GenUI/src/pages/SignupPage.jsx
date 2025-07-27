import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { HashLoader } from "react-spinners";

const SignupPage = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const navigate = useNavigate();

  if (loadingOtp || loadingRegister) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <HashLoader size={120} color="#10b981" speedMultiplier={1.2} />
        <div className="mt-6 text-gray-700">Processing...</div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (isOtpSent) {
      try {
        setLoadingRegister(true);
        if (!email || !password || !otp) {
          ErrorToast("Email, password & otp are required!");
          return;
        }

        const dataObj = {
          email,
          password,
          otp,
        };

        const result = await axiosInstance.post("/auth/signup", dataObj);

        if (result.status === 201) {
          SuccessToast(result.data.message);
          navigate("/login");
        } else {
          ErrorToast(result.data.message);
        }
      } catch (err) {
        ErrorToast(
          `Cannot signup: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setLoadingRegister(false);
      }
    } else {
      ErrorToast(`Cannot signup before sending otp`);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async () => {
    try {
      setLoadingOtp(true);

      if (!isValidEmail(email)) {
        ErrorToast("Please enter a valid email address.");
        return;
      }

      const resp = await axiosInstance.post("/auth/send-otp", {
        email,
      });

      if (resp.data.isSuccess) {
        SuccessToast(resp.data.message);
        setIsOtpSent(true);
      } else {
        SuccessToast(resp.data.message);
      }
    } catch (err) {
      console.log(err);
      ErrorToast(
        `Cannot send otp: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoadingOtp(false);
    }
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = isValidEmail(email) && isValidPassword(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-emerald-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-emerald-200 space-y-6">
          <h2 className="text-3xl font-bold text-center text-emerald-700">
            Create Account
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-600 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                required
                className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {isOtpSent && (
              <>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-emerald-600 mb-1"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6‑digit OTP"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-emerald-600 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}
          </div>

          {isOtpSent ? (
            <button
              onClick={handleRegister}
              disabled={!isFormValid}
              className={`w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 to-teal-700 text-white rounded-lg shadow-md ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              } transition`}
            >
              Complete Registration
            </button>
          ) : (
            <button
              onClick={handleSendOtp}
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg shadow-md transition"
            >
              Send OTP
            </button>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignupPage };
