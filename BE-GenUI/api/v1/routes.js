const express = require("express");
const { authRouter } = require("./auth/routes");
const { usersRouter } = require("./users/routes");
const { userAuthenticationMiddleware } = require("./middleware");
const { sessionsRouter } = require("./sessions/routes");
const { llmRouter } = require("./llm/routes");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use(userAuthenticationMiddleware);

// all the routes below the above middleware are now (protected APIs)
// if anyone want to reach the below {/users} then they need to pass the above checks

apiRouter.use("/users", usersRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/ai", llmRouter);

module.exports = { apiRouter };
