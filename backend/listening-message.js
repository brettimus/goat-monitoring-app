"use strict";
require("colors");
const face = require("cool-ascii-faces");
const nTimes = require("./utils").nTimes;

module.exports = function printListeningMessage(port) {
    const borderType = ".\n";
    const serverFace = face().green;

    nTimes(2, () => console.log(borderType));
    console.log(serverFace);
    console.log(serverFace, "   Hello!");
    console.log(serverFace, "   I have my ear cupped against".blue, ("port " + port) + ".".blue);
    console.log(serverFace);
    nTimes(3, () => console.log(borderType));
};