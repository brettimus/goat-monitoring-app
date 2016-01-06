const { getAlertsFromLoadData } = require("./app-actions-alerts");
const { appendNewColumnData } = require("./app-actions-buffer");
const { createLoadDatum, trimLoadData } = require("./app-actions-load-data");
const { head } = require("../utils");

module.exports = {
  addLoadDatum,
  bufferChartData,
  flushBuffer,
  recordChartUpdate,
  toggleTheme,
};

function addLoadDatum(state, action) {
  const loadDatum = createLoadDatum(state, action);  
  
  let loadData = [loadDatum, ...state.loadData];
  loadData = trimLoadData(state, action, loadData);

  const latestDatumTimestamp = loadDatum.timestamp;

  const alerts = getAlertsFromLoadData(state, action, loadData);

  return { 
    ...state, 
    loadData, 
    alerts,
    latestDatumTimestamp,
  };
}

function bufferChartData(state, action) {
  const { columns } = action;
  const prevChartDataBuffer = { ...state.chartDataBuffer };
  const chartDataBuffer = columns.reduce(appendNewColumnData, prevChartDataBuffer);
  return {...state, chartDataBuffer};
}

function flushBuffer(state, action) {
  const chartDataBuffer = {};
  return { ...state, chartDataBuffer };
}

function recordChartUpdate(state, action) {
  const latestChartTimestamp = state.latestDatumTimestamp;
  return { ...state, latestChartTimestamp };
}

function toggleTheme(state, action) {
  const prevTheme = state.themeName;
  const themeName = (prevTheme === "goat") ? "load" : "goat";
  return { ...state, themeName };
}