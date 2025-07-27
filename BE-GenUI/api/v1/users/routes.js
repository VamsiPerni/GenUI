const express = require("express");
const {
  sendUserBasicInfoController,
  sendUserDetailsController,
  updateDisplayPictureController,
} = require("./controllers");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersRouter = express.Router();

usersRouter.get("/", sendUserBasicInfoController);

usersRouter.get("/details", sendUserDetailsController);

usersRouter.put(
  "/display-picture",
  upload.single("displayPicture"),
  updateDisplayPictureController
);

module.exports = { usersRouter };
