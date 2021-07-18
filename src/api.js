const fs = require("fs");
const path = require("path");
const isImage = require("is-image");
const isVideo = require("is-video");
const C = require("./constants");

function sortAlphaNum(a, b) {
  var reA = /[^a-zA-Z]/g;
  var reN = /[^0-9]/g;

  var aA = a.replace(reA, "");
  var bA = b.replace(reA, "");
  if (aA === bA) {
    var aN = parseInt(a.replace(reN, ""), 10);
    var bN = parseInt(b.replace(reN, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
}

exports.getFile = async (req, res) => {
  var file = req.query.file ? req.query.file : "";

  res.sendFile(C.SERVING_PATH + file);
};

exports.getDirectory = async (req, res) => {
  var folder = req.query.folder ? req.query.folder : "";
  var willSort = typeof req.query.sort !== undefined ? req.query.sort : false;

  var files = fs.readdirSync(C.SERVING_PATH + folder, {
    withFileTypes: true,
  });

  var list = {
    directories: [],
    images: [],
    others: [],
  };

  list.images = files
    .filter((dirent) => dirent.isFile() && isImage(dirent.name))
    .map((dirent) => dirent.name);

  files = files //remove images from list
    .filter((dirent) => !(dirent.isFile() && isImage(dirent.name)));

  list.videos = files
    .filter((dirent) => dirent.isFile() && isVideo(dirent.name))
    .map((dirent) => dirent.name);

  files = files //remove videos from list
    .filter((dirent) => !(dirent.isFile() && isVideo(dirent.name)));

  list.directories = files
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  files = files //remove directories from list
    .filter((dirent) => !dirent.isDirectory());

  list.others = files.map((dirent) => dirent.name);

  if (willSort) {
    Object.keys(list).forEach(function (key) {
      // sort
      list[key].sort(sortAlphaNum);
    });
  }

  res.send(list);
};
