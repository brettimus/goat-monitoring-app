const { average } = require("../utils");

const loadInterval = 10000;
const loadSpan = 10 * 60 * 1000;

const defaultLoadDatum = {
  timestamp: null,
  loadavg: 0,
}

const initialState = {
  twoMinuteAvg: null,
  isInAlertMode: false,
  loadData: [], // most recent data come first
  alerts: [],
  loadInterval, // ms (show data in 10 second intervals)
  loadSpan,     // ms (show 10 mins of data)
  themeName: "load",
};

// initialState.loadData = getInitialLoadData

// *** loadDatum *** 
//
// it looks like this:
/*
{
  x: Number,
  y: Date,
}
*/

// TODO:
//
// *** alert *** 
//
// it _should_ look like this:
/*
{
  type: String,
  timestamp: String,
  message: String,
}
*/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_LOAD_DATUM": return addLoadDatum(state, action);
    case "CREATE_ALERT"  : return createAlert(state, action);
    default              : return state;
  }
};

module.exports = reducer;

function addLoadDatum(state, action) {
  const oldLoadData = state.loadData;
  const newLoadDatum = action.loadDatum;

  let loadData = [newLoadDatum, ...oldLoadData];
  loadData = filterPastTenMinutes(loadData);

  const twoMinuteAvg = getTwoMinuteAvg(loadData);

  const wasInAlertMode = state.isInAlertMode;
  const isInAlertMode = isLoadavgAvgHigh(twoMinuteAvg);

  let { alerts } = state;

  if (isInAlertMode) {
    let newAlert = createWarningAlert(state, action, { twoMinuteAvg });
    alerts = [ newAlert, ...alerts ];
  }
  if (wasInAlertMode && !isInAlertMode) {
    // add "resolved" alert
    let newAlert = createResolvedAlert(state, action)
    alerts = [ newAlert, ...alerts ];
  }

  return { 
    ...state, 
    loadData, 
    alerts, 
    twoMinuteAvg, 
    isInAlertMode
  };
}

function createResolvedAlert(state, action) {
  let theme = state.themeName;
  let { timestamp } = action.loadDatum;
  return {
    type: "success",
    message: `High ${theme} resolved`,
    timestamp,
  };
}

function createWarningAlert(state, action, { twoMinuteAvg }) {
  let theme = state.themeName;
  let { timestamp } = action.loadDatum;
  return {
    type: "warning",
    message: `High ${theme} generated an alert. ${theme} = ${twoMinuteAvg}`,
    timestamp,
  };
}

// Both of these helpers assume each datum is 1 second 

function filterPastTenMinutes(loadData) {
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