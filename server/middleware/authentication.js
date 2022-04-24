const mongoose = require("mongoose");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers;
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) {
    next();
    return;
  }
  const user = await User.findOne({ "sessions._id": sessionid });
  if (!user) {
    next();
    return;
  }
  req.user = user;
  next();
};

module.exports = { authenticate };
