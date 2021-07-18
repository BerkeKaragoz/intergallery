const router = require("express").Router();

const api = require("./api");

router.get("/getFile", api.getFile);
router.get("/getDirectory", api.getDirectory);

module.exports = router;
