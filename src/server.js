require("dotenv").config({ path: "./.env" });
const express = require("express");
const path = require("path");
const router = require("./router");
const cors = require("cors");
const app = express();
const C = require("./constants");
const expressWinston = require("express-winston");
const winston = require("winston"); // for transports.Console

const CLIENT_URL = "http://localhost:" + C.CLIENT_PORT;

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json()); // to support JSON-encoded bodies
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
//Logger
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint(winston.format.colorize())
    ),
    responseWhitelist: [...expressWinston.responseWhitelist, "body"],
  })
);
app.use(express.static(C.SERVING_PATH));
app.use("/api", router);

let testCount = 0;
app.get("/test", (req, res) => {
  const R = { text: "Test: " + testCount++ };
  res.send(R);
});

//////////////////////////////////////////////////////////////////////////////////////

app.listen(C.SERVER_PORT, () => {
  console.log(`Server: http://localhost:${C.SERVER_PORT}`);
  console.log(`Client: ${CLIENT_URL}`);

  console.log("Serving directory: " + C.SERVING_PATH);
});
