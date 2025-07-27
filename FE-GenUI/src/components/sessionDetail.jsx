import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { toast } from "react-toastify"; // Pure feedback.

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/sessions/${id}`);
      setSession(res.data.session);
      setEditName(res.data.session.name);
    } catch {
      ErrorToast("Failed to fetch session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line
  }, [id]);

  const handleRename = async () => {
    if (!editName?.trim()) {
      ErrorToast("Session name can't be empty");
      return;
    }
    try {
      const res = await axiosInstance.put(`/sessions/${id}`, {
        name: editName,
      });
      setSession(res.data.session);
      toast.success("Session renamed!");
    } catch {
      ErrorToast("Rename failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await axiosInstance.delete(`/sessions/${id}`);
      toast.success("Session deleted");
      navigate("/session");
    } catch {
      ErrorToast("Delete failed");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!session)
    return <p className="text-center text-red-600">Session not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Session Details</h2>
      <div>
        <label className="block font-medium">Session Name:</label>
        <input
          className="border px-3 py-2 rounded w-full mt-2 mb-4"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <button
          onClick={handleRename}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-3"
        >
          Rename
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete Session
        </button>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold">Created:</h4>
        <p>{new Date(session.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SessionDetail;
