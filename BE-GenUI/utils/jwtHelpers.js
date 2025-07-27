const jwt = require("jsonwebtoken");

const attachJWTToken = (res, data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET);

  res.cookie("authorization", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "None",
    httpOnly: true,
  });
};

const removeJWTToken = (res) => {
  res.cookie("authorization", "", {
    maxAge: 0,
    secure: true,
    sameSite: "None",
    httpOnly: true,
  });
};

module.exports = { attachJWTToken, removeJWTToken };
