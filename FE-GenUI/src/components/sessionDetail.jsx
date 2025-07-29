import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiSave,
  FiLoader,
} from "react-icons/fi";

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/sessions/${id}`);
      setSession(res.data.session);
      setEditName(res.data.session.name);
    } catch (err) {
      toast.error("Failed to fetch session details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleRename = async () => {
    if (!editName?.trim()) {
      toast.error("Session name cannot be empty");
      return;
    }

    setIsRenaming(true);
    try {
      const res = await axiosInstance.put(`/sessions/${id}`, {
        name: editName,
      });
      setSession(res.data.session);
      toast.success("Session renamed successfully!");
    } catch (err) {
      toast.error("Failed to rename session");
      console.error(err);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/sessions/${id}`);
      toast.success("Session deleted successfully!");
      navigate("/session");
    } catch (err) {
      toast.error("Failed to delete session");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-red-600 mb-2">
            Session not found
          </h3>
          <button
            onClick={() => navigate("/session")}
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft /> Back to sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <button
          onClick={() => navigate("/session")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <FiArrowLeft /> Back to sessions
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Session Details</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter session name"
            />
            <button
              onClick={handleRename}
              disabled={isRenaming || editName === session.name}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRenaming ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Created At</h4>
          <p className="text-gray-800">{formatDate(session?.createdAt)}</p>
        </div>

        {session?.updatedAt && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Last Updated
            </h4>
            <p className="text-gray-800">{formatDate(session.updatedAt)}</p>
          </div>
        )}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FiTrash2 />
                <span>Delete Session</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This action cannot be undone
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
