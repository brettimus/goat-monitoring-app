const { average } = require("../utils");

const loadInterval = 10000;
const loadSpan = 10 * 60 * 1000;

const defaultLoadDatum = {
  timestamp: null,
  loadavg: 0,
}

const initialState = {
  loadData: [], // most recent data come first
  alerts: [],
  loadInterval, // ms (show data in 10 second intervals)
  loadSpan,     // ms (show 10 mins of data)
  themeName: "load",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LOAD_DATUM": return addLoadDatum(state, action);
    case "TOGGLE_THEME"  : return toggleTheme(state, action);
    default              : return state;
  }
};

module.exports = reducer;

function toggleTheme(state, action) {
  let prevTheme = state.themeName;
  let themeName = (prevTheme === "goat") ? "load" : "goat";
  return { ...state, themeName };
}

function addLoadDatum(state, action) {

  let loadData = [action.loadDatum, ...state.loadData];
  loadData = getPastTenMinutes(loadData);

  const prevTwoMinuteAvg = getTwoMinuteAvg(state.loadData);
  const nextTwoMinuteAvg = getTwoMinuteAvg(loadData);
  const alerts = getAlerts(state, action, { prevTwoMinuteAvg, nextTwoMinuteAvg });

  return { 
    ...state, 
    loadData, 
    alerts, 
  };
}

function getAlerts(state, action, twoMinuteAvgs) {
  const { prevTwoMinuteAvg, nextTwoMinuteAvg } = twoMinuteAvgs;
  const wasInAlertMode = isLoadavgAvgHigh(prevTwoMinuteAvg);
  const isInAlertMode = isLoadavgAvgHigh(nextTwoMinuteAvg);

  let { alerts } = state;

  if (!wasInAlertMode && isInAlertMode) {
    let twoMinuteAvg = nextTwoMinuteAvg;
    let alert = createWarningAlert(state, action, { twoMinuteAvg })
    return [ alert, ...alerts ];
  }

  if (wasInAlertMode && !isInAlertMode) {
    let twoMinuteAvg = nextTwoMinuteAvg;
    let alert = createResolvedAlert(state, action, { twoMinuteAvg })
    return [ alert, ...alerts ];
  }

  return alerts;
}

function createResolvedAlert(state, action, { twoMinuteAvg }) {
  let { timestamp } = action.loadDatum;
  return {
    type: "success",
    message: "High {theme} recovered",
    twoMinuteAvg,
    timestamp,
  };
}

function createWarningAlert(state, action, { twoMinuteAvg }) {
  let { timestamp } = action.loadDatum;
  return {
    type: "warning",
    message: "High {theme} generated an alert",
    twoMinuteAvg,
    timestamp,
  };
}

// Both of these helpers assume each datum is 1 second 

function getPastTenMinutes(loadData) {
  const tenMinutes = 10;
  return loadData.slice(0, tenMinutes);
}

function isLoadavgAvgHigh(loadavgAvg) {
    if (loadavgAvg > 1.2) {
      return true;
    }
    return false;
}

function getTwoMinuteAvg(loadData) {
  const twoMinutes = 60 * 2;
  const loadavgs = loadData.slice(0, twoMinutes).map( ({loadavg}) => loadavg )
  return average(loadavgs);
}