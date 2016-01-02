"use strict"
const PORT = 1337;
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const emitLoadavgUpdate = require("./emit-loadavg");
const printListeningMessage = require("./listening-message");

module.exports = startServer;

function startServer(options) {
  const pathToIndex = path.join(__dirname, options.pathToIndex);
  const pathToAssets = path.join(__dirname, options.pathToAssets);

  app.use(express.static(pathToAssets));
  app.get('/', createRootHandler(pathToIndex));
  io.on('connection', wsConnectionHandler);
  http.listen(PORT, serverListeningHandler); 

}

function createRootHandler(pathToIndex) {
  return function rootHandler(request, response) {
      response.sendFile(pathToIndex);
  }  
}

function wsConnectionHandler(socket) {
    // For debugging
    console.log("Ooooh look! A wild websocket connection appeared.");
}

function serverListeningHandler() {
    startEmittingLoadavgData(io);
    printListeningMessage(PORT);
}

function startEmittingLoadavgData(io, interval) {
    setInterval(() => emitLoadavgUpdate(io), interval);
}