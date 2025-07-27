const Session = require("../../../models/sessionSchema");

// Create new session
const createSessionController = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const newSession = await Session.create({
      userId,
      name: name || "Untitled Session",
      chat: [],
      generatedCode: {
        jsx: "",
        css: "",
      },
    });

    return res.status(201).json({
      message: "Session created successfully",
      sessionId: newSession._id,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all sessions for logged-in user
const getUserSessionsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get one session by ID
const getSessionByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findOne({ _id: id, userId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const renameSessionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await Session.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Session not found" });

    res.json({ session: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to rename session" });
  }
};

const deleteSessionController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Session.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Session not found" });

    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete session" });
  }
};

module.exports = {
  createSessionController,
  getUserSessionsController,
  getSessionByIdController,
  renameSessionController,
  deleteSessionController,
};
