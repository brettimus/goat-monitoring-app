const os = require("os");

module.exports = emitLoadavgUpdate;

function emitLoadavgUpdate(io) {
    io.emit('loadavg update', getLoadavgUpdateData());
}

function getLoadavgUpdateData() {
    const timestamp = getTimestamp();
    const loadavgData = getLoadavg();
    return Object.assign(loadavgData, { timestamp });
}

function getTimestamp() {
    return new Date().getTime();
}

function getLoadavg() {
    const loadavg = os.loadavg();
    return {
        loadavg1: loadavg[0],
        loadavg5: loadavg[1],
        loadavg15: loadavg[2],
    };
}