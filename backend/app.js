"use strict"

const PORT = 1337;
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const face = require("cool-ascii-faces");
const emitLoadavgUpdate = require("./emit-loadavg");

function startServer(options) {
  const pathToIndex = path.join(__dirname, options.pathToIndex);
  const pathToAssets = path.join(__dirname, options.pathToAssets);

  app.use(express.static(pathToAssets));
  app.get('/', createRootHandler(pathToIndex));
  io.on('connection', wsConnectionHandler);
  http.listen(PORT, serverListeningHandler); 
}

module.exports = startServer;

function createRootHandler(pathToIndex) {

  return rootHandler;

  function rootHandler(request, response) {
      let index = pathToIndex;
      response.sendFile(index);
  }  
}

function wsConnectionHandler(socket) {
    // For debugging
    console.log("Ooooh look! A wild connection appeared.");
}

function serverListeningHandler() {
    startEmittingLoadavgData();
    let serverFace = face();
    console.log(serverFace, " Hello. I have my ear cupped against port", PORT + ". ", serverFace);
}

function startEmittingLoadavgData() {
    setInterval(() => emitLoadavgUpdate(io), 1000);
}