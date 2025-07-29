import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiArrowRight,
  FiClock,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { BsCodeSlash } from "react-icons/bs";

const SessionManagerHome = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/sessions");
      setSessions(res.data.sessions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await axiosInstance.post("/sessions", {
        name: "Untitled Session",
      });
      const sessionId = res.data.sessionId;
      toast.success("New session created!");
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create session");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Your Workspaces
            </h2>
            <p className="text-gray-500">Manage your component sessions</p>
          </div>
          <button
            onClick={handleCreateSession}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus size={18} />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <BsCodeSlash size={32} className="text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No sessions yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first session to start building components
          </p>
          <button
            onClick={handleCreateSession}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FiPlus size={18} />
            <span>Create Session</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="font-medium text-gray-800 cursor-pointer hover:text-indigo-600"
                    onClick={() => navigate(`/session/${session._id}`)}
                  >
                    {session.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FiClock size={14} />
                    <span>Created {formatDate(session.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/session/detail/${session._id}`)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit session"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/session/${session._id}`)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-white hover:bg-indigo-600 px-3 py-1 rounded-lg border border-indigo-600 transition-colors"
                  >
                    <span>Open</span>
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { SessionManagerHome };
