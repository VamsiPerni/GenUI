const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  chat: [
    // chat history
    {
      role: { type: String, enum: ["user", "assistant"] },
      message: String,
    },
  ],
  generatedCode: {
    jsx: String,
    css: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
