"use strict"
const PORT = 1337;
const os = require("os");
const path = require("path");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

function letsDoThis() {
   app.get('/', rootHandler);
   io.on('connection', wsConnectionHandler);
   http.listen(PORT, serverListening); 
}

module.exports = letsDoThis;



function rootHandler(request, response) {
    response.sendFile(path.join(__dirname, "..", "index.html"));
}

function wsConnectionHandler(socket) {
    // For debugging
    console.log("Ooooh look! A wild connection appeared.");
}

function serverListening() {
    startEmittingLoadavgData();
    console.log("Node art listening to thou on port", PORT);
}

function startEmittingLoadavgData() {
    setInterval(emitLoadavgUpdate, 1000);
}

function emitLoadavgUpdate() {
    io.emit('loadavg update', getLoadavgUpdateData());
}

function getLoadavgUpdateData() {
    const timestamp_ms = getCurrentTimeMS();
    const loadavgData = getLoadavg();
    return Object.assign({ timestamp_ms }, loadavgData);
}

function getCurrentTimeMS() {
    return +new Date();
}

function getLoadavg() {
    const loadavg = os.loadavg();
    return {
        loadavg1: loadavg[0],
        loadavg5: loadavg[1],
        loadavg15: loadavg[2],
    };
}