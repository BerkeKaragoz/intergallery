const responseLengthLimit = 1028;

let count = 0;

const logger = (req, res, next) => {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      console.log("ARGS: ", restArgs[0].length);
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString("utf8");

    console.log({
      Count: ++count,
      //time: new Date().toUTCString(),
      //fromIP: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      method: req.method,
      //originalUri: req.originalUrl,
      uri: req.url,
      requestData: { Body: req.body, Query: req.query, Params: req.params },
      responseData:
        body.length <= responseLengthLimit
          ? body
          : body.substr(0, responseLengthLimit).concat("...AND MORE."),
      referer: req.headers.referer || "",
      //ua: req.headers["user-agent"],
    });

    // console.log(body);
    oldEnd.apply(res, restArgs);
  };

  next();
};

module.exports = logger;
