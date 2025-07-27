import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { toast } from "react-toastify";

const SessionManager = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get("/sessions");
      setSessions(res.data.sessions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sessions");
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await axiosInstance.post("/sessions", {
        name: "New GenUI Session",
      });
      const sessionId = res.data.sessionId;
      toast.success("Session created!");
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create session");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Sessions</h2>
        <button
          onClick={handleCreateSession}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-4 text-gray-500">No sessions found.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {sessions.map((session) => (
            <div>
              <li
                key={session._id}
                onClick={() => navigate(`/session/${session._id}`)}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                🔹 {session.name}
              </li>
              <Link
                to={`/session/detail/${session._id}`}
                className="text-indigo-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SessionManager };
