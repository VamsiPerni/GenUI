const express = require("express");
const {
  createSessionController,
  getUserSessionsController,
  getSessionByIdController,
  renameSessionController,
  deleteSessionController,
  updateChatController,
} = require("./controller");

const sessionsRouter = express.Router();

sessionsRouter.get("/", getUserSessionsController);
sessionsRouter.post("/", createSessionController);
sessionsRouter.get("/:id", getSessionByIdController);
sessionsRouter.put("/:id", renameSessionController);
sessionsRouter.delete("/:id", deleteSessionController);
sessionsRouter.post("/chat/update", updateChatController);

module.exports = { sessionsRouter };
