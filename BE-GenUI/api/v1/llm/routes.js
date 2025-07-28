const express = require("express");
const { generateComponentController } = require("./controller");

const llmRouter = express.Router();

llmRouter.post("/generate-component", generateComponentController);

module.exports = { llmRouter };
