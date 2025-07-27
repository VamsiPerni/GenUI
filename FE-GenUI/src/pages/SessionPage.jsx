import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { ErrorToast } from "../utils/toastHelper";

const SessionPage = () => {
  const { id } = useParams();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionInfo = async () => {
    try {
      const response = await axiosInstance.get(`/sessions/${id}`);
      setSessionInfo(response.data?.session);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      ErrorToast("Failed to load session info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionInfo();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-900">
          Session Info
        </h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : sessionInfo ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
            <p className="text-lg font-medium mb-2">
              <span className="text-gray-600">Session Name:</span>{" "}
              {sessionInfo.name}
            </p>
            <p className="text-lg font-medium">
              <span className="text-gray-600">Created At:</span>{" "}
              {new Date(sessionInfo.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500">No session data found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export { SessionPage };
