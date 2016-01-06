const { createLoadDatum, trimLoadData } = require("./app-actions-load-data");
const getAlertsFromLoadData = require("./app-actions-alerts");
const { head, tail } = require("../utils");

module.exports = {
  addLoadDatum,
  bufferChartData,
  flushBuffer,
  toggleTheme,
};

function addLoadDatum(state, action) {
  let loadDatum = createLoadDatum(state, action);
  let loadData = [loadDatum, ...state.loadData];
  loadData = trimLoadData(state, action, loadData);

  const alerts = getAlertsFromLoadData(state, action, loadData);
  const latestDatum = head(loadData);
  return { 
    ...state, 
    loadData, 
    alerts,
    latestDatum,
  };
}

function bufferChartData(state, action) {
  const chartDataBuffer = action.columns.reduce(
    appendColumnData, 
    { ...state.chartDataBuffer }
  );

  return {...state, chartDataBuffer};
}

  function appendColumnData(chartDataBuffer, col) {
    let name = head(col);
    if (!(name in chartDataBuffer)) {
      chartDataBuffer[name] = [name];
    }
    let prevBuffer = chartDataBuffer[name];
    chartDataBuffer[name] = [...prevBuffer, ...tail(col)];
    return chartDataBuffer;
  }

function flushBuffer(state, action) {
  const chartDataBuffer = {};
  return { ...state, chartDataBuffer };
}

function toggleTheme(state, action) {
  let prevTheme = state.themeName;
  let themeName = (prevTheme === "goat") ? "load" : "goat";
  return { ...state, themeName };
}