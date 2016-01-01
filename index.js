"use strict";
const path = require("path");
const config = {
    pathToIndex: path.join("..", "index.html"),
    pathToAssets: path.join("..", "frontend", "dist")
};
const startServer = require("./backend/app");

startServer(config);