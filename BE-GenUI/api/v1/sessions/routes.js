const express = require("express");
const {
  createSessionController,
  getUserSessionsController,
  getSessionByIdController,
  renameSessionController,
  deleteSessionController,
} = require("./controller");

const sessionsRouter = express.Router();

sessionsRouter.get("/", getUserSessionsController);
sessionsRouter.post("/", createSessionController);
sessionsRouter.get("/:id", getSessionByIdController);
sessionsRouter.put("/:id", renameSessionController);
sessionsRouter.delete("/:id", deleteSessionController);

module.exports = { sessionsRouter };
