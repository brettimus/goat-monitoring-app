"use strict"
const PORT = 1337;
const path = require("path");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const face = require("cool-ascii-faces");
const emitLoadavgUpdate = require("./emit-loadavg");

function startServer() {
   app.get('/', rootHandler);
   io.on('connection', wsConnectionHandler);
   http.listen(PORT, serverListeningHandler); 
}

module.exports = startServer;

function rootHandler(request, response) {
    let index = path.join(__dirname, "..", "index.html");
    response.sendFile(index);
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