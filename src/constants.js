require("dotenv").config();
const path = require("path");

exports.SERVER_PORT = process.env.SERVER_PORT || 3001;
exports.CLIENT_PORT = process.env.CLIENT_PORT || 3000;
exports.SERVING_PATH =
  process.env.SERVING_PATH || path.join(__dirname, "../public");
