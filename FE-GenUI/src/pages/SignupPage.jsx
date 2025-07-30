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
      <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 content-center">
        <HashLoader size={120} color="#10b981" speedMultiplier={1.2} />
        <div className="border-1 border-lime-800 p-8 rounded-lg">
          <p>Please wait for a while </p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-emerald-100">
        <h2 className="text-3xl font-bold text-center text-emerald-800">
          Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-emerald-700 mb-1"
              htmlFor="user-email"
            >
              Email
            </label>
            <input
              id="user-email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
              placeholder="your@email.com"
            />
          </div>

          {isOtpSent && (
            <>
              <div>
                <label
                  className="block text-sm font-medium text-emerald-700 mb-1"
                  htmlFor="user-otp"
                >
                  OTP
                </label>
                <input
                  id="user-otp"
                  type="text"
                  name="otp"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-emerald-700 mb-1"
                  htmlFor="user-password"
                >
                  Password
                </label>
                <input
                  id="user-password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition duration-200"
                  placeholder="Create password"
                />
                {password.length > 0 && !isValidPassword(password) && (
                  <div className="text-sm mt-1 space-y-1">
                    <p className="text-red-500">
                      Password must meet the following requirements:
                    </p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li
                        className={
                          password.length >= 8
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        At least 8 characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        An uppercase letter (e.g., <strong>A</strong>)
                      </li>
                      <li
                        className={
                          /[a-z]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        A lowercase letter (e.g., <strong>a</strong>)
                      </li>
                      <li
                        className={
                          /\d/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        A number (e.g., <strong>1</strong>)
                      </li>
                      <li
                        className={
                          /[@$!%*?&#]/.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        A special character (e.g.,{" "}
                        <strong>! @ # $ % ^ & *</strong>)
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          {isOtpSent ? (
            <button
              onClick={handleRegister}
              disabled={!isFormValid}
              className={`w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 
    hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg 
    shadow-md transition duration-200 focus:outline-none focus:ring-2 
    focus:ring-emerald-500 focus:ring-opacity-50 
    ${!isFormValid ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
            >
              Complete Registration
            </button>
          ) : (
            <button
              onClick={handleSendOtp}
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              Send OTP
            </button>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition duration-200"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignupPage };
