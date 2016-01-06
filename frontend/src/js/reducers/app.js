const { 
  addLoadDatum, 
  bufferChartData, 
  flushBuffer, 
  toggleTheme } = require("./app-actions");
const { head } = require("../utils");

const loadInterval = 1000;
const loadSpan = 10 * 60 * 1000;

const initialState = {
  chartDataBuffer: {},  // keeps a buffer of data we haven't graphed yet
  loadData: [],         // most recent data come first
  latestDatum: null,
  alerts: [],
  maxAlertHistory: 100,
  loadAlertThreshold: 1.2,
  loadInterval,         // ms (store load data in 1s intervals)
  loadSpan,             // ms (keep 10 mins of load data)
  chartTickInterval: 10000, // ms
  themeName: "load",
};

setInitialLoadData(initialState);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LOAD_DATUM"   : return addLoadDatum(state, action);
    case "BUFFER_CHART_DATA": return bufferChartData(state, action);
    case "FLUSH_BUFFER"     : return flushBuffer(state, action);
    case "TOGGLE_THEME"     : return toggleTheme(state, action);
    default                 : return state;
  }
};

module.exports = reducer;

function setInitialLoadData(state) {
  let loadData = createInitialLoadData(state);
  let latestDatum = head(loadData);

  state.loadData = loadData;
  state.latestDatum = latestDatum;
}

function createInitialLoadData(state) {
  const { loadInterval, loadSpan } = state;
  const maxLoadDataLength = Math.floor(loadSpan / loadInterval);
  const currentTimestamp = new Date().getTime();

  const result = [];
  for (let i = 0; i < maxLoadDataLength; i++) {
    let timestamp = currentTimestamp - i * loadInterval;
    let loadavg = 0;
    result.push({ timestamp, loadavg })
  }
  return result;
}