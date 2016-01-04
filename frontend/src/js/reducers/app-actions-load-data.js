const { average } = require("../utils");

module.exports = {
    createLoadDatum,
    getTwoMinuteLoadavg,
    trimLoadData,
};

function createLoadDatum(state, action) {
    let rawDatum = action.loadDatum;
    let loadavg = rawDatum.loadavg1;  // Grab the one-minute load average
    let { timestamp } = rawDatum;
    return { loadavg, timestamp };
}

function trimLoadData(state, action, loadData) {
    const { loadSpan, loadInterval } = state;
    const trimTo = Math.floor(loadSpan / loadInterval);
    return loadData.slice(0, trimTo);
}

// TODO
// - generalize
function getTwoMinuteLoadavg(state, action, loadData=null) {
    if (!loadData) loadData = state.loadData;

    const intervalsAgo = Math.floor(
        minutesToMilliseconds(1) / state.loadInterval
    );

    return averageLoadDatumLoadavgs(
                latest(loadData), 
                nAgo(loadData, intervalsAgo)
            );
}

function averageLoadDatumLoadavgs(loadDatum1, loadDatum2) {
    if (!(loadDatum1 && loadDatum2)) return "NA";
    const data = [...arguments];
    return average(data.map( ({loadavg}) => loadavg ));
}

function latest(loadData) {
    return nAgo(loadData, 0);
}

function nAgo(loadData, n) {
    if (n > loadData.length - 1) {
        return null;
    }
    return loadData[n];
}

function minutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
}