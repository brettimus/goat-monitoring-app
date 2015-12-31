const { average } = require("../utils");

const initialState = {
  twoMinuteAvg: null,
  isInAlertMode: false,
  loadData: [], // most recent data come first
  alerts: [],
  loadInterval: 10000, // ms (show data in 10 second intervals)
  loadSpan: 10 * 60 * 1000, // ms (show 10 mins of data)
};

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

  const currentAlertMode = state.isInAlertMode;
  const nextAlertMode = isLoadavgAvgHigh(twoMinuteAvg);

  const currentTimestamp = newLoadDatum.timestamp;

  let { alerts } = state;

  if (nextAlertMode) {
    let newAlert = {
      type: "warning",
      message: `High load alert (${twoMinuteAvg})`,
      timestamp: currentTimestamp,
    };

    alerts = [ newAlert, ...alerts ];
  }
  if (currentAlertMode && !nextAlertMode) {
    // add "resolved" alert
    let newAlert = {
      type: "success",
      message: "High load resolved",
      timestamp: currentTimestamp,
    };
    alerts = [ newAlert, ...alerts ];
  }

  const isInAlertMode = nextAlertMode;

  return { 
    ...state, 
    loadData, 
    alerts, 
    twoMinuteAvg, 
    isInAlertMode
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