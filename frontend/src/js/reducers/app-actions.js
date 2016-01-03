const { getPastNMinutes } = require("./app-actions-load-data");
const getAlertsFromLoadData = require("./app-actions-alerts");

module.exports = {
  toggleTheme,
  addLoadDatum,
};

function toggleTheme(state, action) {
  let prevTheme = state.themeName;
  let themeName = (prevTheme === "goat") ? "load" : "goat";
  return { ...state, themeName };
}

function addLoadDatum(state, action) {
  let loadData = [action.loadDatum, ...state.loadData];
  loadData = getPastNMinutes(loadData, 10);

  const alerts = getAlertsFromLoadData(state, action, loadData);

  return { 
    ...state, 
    loadData, 
    alerts, 
  };
}