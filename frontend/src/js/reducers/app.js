const { addLoadDatum, toggleTheme } = require("./app-actions");

const loadInterval = 1000;
const loadSpan = 10 * 60 * 1000;

const initialState = {
  loadData: [],         // most recent data come first
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
    case "ADD_LOAD_DATUM": return addLoadDatum(state, action);
    case "TOGGLE_THEME"  : return toggleTheme(state, action);
    default              : return state;
  }
};

module.exports = reducer;

function setInitialLoadData(state) {
  state.loadData = createInitialLoadData(state);
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