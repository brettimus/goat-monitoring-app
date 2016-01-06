const { head } = require("../utils");

const chartUpdateInterval = 3000;
const loadAlertThreshold = 1;
const loadInterval = 1000;
const loadSpan = 10 * 60 * 1000;
const maxAlertHistory = 100;
const themeName = "load";

const initialState = {
  chartDataBuffer: {},  // keeps a buffer of data we haven't graphed yet
  chartUpdateInterval,
  loadData: [],         // most recent data come first
  latestDatumTimestamp: null,
  latestChartTimestamp: null,
  alerts: [],
  maxAlertHistory,
  loadAlertThreshold,
  loadInterval,         // ms (store load data in 1s intervals) BIG WEAK POINT OF THIS APP!
  loadSpan,             // ms (keep 10 mins of load data)
  themeName,
};

setInitialLoadData(initialState);

module.exports = initialState;

function setInitialLoadData(state) {
  let loadData = createInitialLoadData(state);
  let latestDatum = head(loadData);

  state.loadData = loadData;
  state.latestDatumTimestamp = latestDatum.timestamp;
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