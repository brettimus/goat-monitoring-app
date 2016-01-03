const { addLoadDatum, toggleTheme } = require("./app-actions");

const loadInterval = 10000;
const loadSpan = 10 * 60 * 1000;

const initialState = {
  loadData: [],         // most recent data come first
  alerts: [],
  maxAlertHistory: 100,
  loadAlertThreshold: 1.2,
  loadInterval,         // ms (show data in 10 second intervals)
  loadSpan,             // ms (show 10 mins of data)
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